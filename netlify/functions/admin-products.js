const { getSupabaseClient } = require('./supabase-client');

function getEmailFromAuth(header) {
  if (!header) return null;
  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  try {
    const decoded = Buffer.from(parts[1], 'base64').toString('utf8');
    const parts2 = decoded.split('|');
    return parts2[1] || null;
  } catch {
    return null;
  }
}

exports.handler = async function (event) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Verificar se é admin
  const email = getEmailFromAuth(event.headers.authorization || event.headers.Authorization);
  if (!email || email !== 'drderm.adm@ofc') {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ error: 'Acesso negado. Apenas administradores.' })
    };
  }

  try {
    const supabase = getSupabaseClient();

    // GET - Listar todos os produtos
    if (event.httpMethod === 'GET') {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Garantir que produtos sem categoria estão inativos
      const productsWithoutCategory = (products || []).filter(p => !p.category_id && p.is_active !== false);
      if (productsWithoutCategory.length > 0) {
        const idsToUpdate = productsWithoutCategory.map(p => p.id);
        await supabase
          .from('products')
          .update({ is_active: false })
          .in('id', idsToUpdate);
        // Atualizar localmente
        products.forEach(p => {
          if (!p.category_id) {
            p.is_active = false;
          }
        });
      }

      // Buscar categorias e marcas para fazer o join
      const categoryIds = [...new Set((products || []).map(p => p.category_id).filter(Boolean))];
      const brandIds = [...new Set((products || []).map(p => p.brand_id).filter(Boolean))];

      const categoriesMap = {};
      const brandsMap = {};

      if (categoryIds.length > 0) {
        const { data: categories } = await supabase
          .from('categories')
          .select('id, name')
          .in('id', categoryIds);
        (categories || []).forEach(cat => { categoriesMap[cat.id] = cat.name; });
      }

      if (brandIds.length > 0) {
        const { data: brands } = await supabase
          .from('brands')
          .select('id, name')
          .in('id', brandIds);
        (brands || []).forEach(brand => { brandsMap[brand.id] = brand.name; });
      }

      // Processar produtos e verificar expiração de descontos
      const now = new Date();
      const formattedProducts = (products || []).map(product => {
        // Verificar se desconto expirou
        let discountPercentage = parseFloat(product.discount_percentage || 0);
        let originalPrice = product.original_price ? parseFloat(product.original_price) : null;
        
        if (discountPercentage > 0 && product.discount_start_date && product.discount_duration && product.discount_duration !== 'unlimited') {
          const startDate = new Date(product.discount_start_date);
          const durationDays = product.discount_duration === 'month' ? 30 : 7;
          const expiryDate = new Date(startDate);
          expiryDate.setDate(expiryDate.getDate() + durationDays);
          
          if (now > expiryDate) {
            // Desconto expirado - remover desconto
            discountPercentage = 0;
            originalPrice = null;
            // Atualizar no banco em background
            supabase.from('products').update({
              discount_percentage: 0,
              original_price: null,
              discount_duration: null,
              discount_start_date: null,
              price: originalPrice || product.price
            }).eq('id', product.id).then(() => {});
          }
        }
        
        // Converter images JSONB para array
        let images = [];
        if (product.images) {
          try {
            images = Array.isArray(product.images) ? product.images : JSON.parse(product.images);
          } catch {
            images = [];
          }
        }
        // Fallback para image_url se images estiver vazio
        if (images.length === 0 && product.image_url) {
          images = [product.image_url];
        }
        
        // Converter image_crop_positions JSONB para array
        let imageCropPositions = [];
        if (product.image_crop_positions) {
          try {
            imageCropPositions = Array.isArray(product.image_crop_positions) ? product.image_crop_positions : JSON.parse(product.image_crop_positions);
          } catch {
            imageCropPositions = [];
          }
        }
        // Se não houver posições de crop, criar padrão baseado no número de imagens
        if (imageCropPositions.length === 0 && images.length > 0) {
          imageCropPositions = images.map(() => ({ x: 50, y: 50 }));
        }
        
        return {
          ...product,
          images: images,
          image_url: images[0] || product.image_url || '', // Mantém compatibilidade
          image_crop_positions: imageCropPositions,
          category_name: product.category_id ? categoriesMap[product.category_id] || null : null,
          brand_name: product.brand_id ? brandsMap[product.brand_id] || null : null,
          is_active: product.is_active !== false,
          discount_percentage: discountPercentage,
          original_price: originalPrice,
          discount_duration: product.discount_duration || null,
          discount_start_date: product.discount_start_date || null,
          application_area: (() => {
            // Converter application_area para array se necessário
            if (!product.application_area) return null;
            try {
              if (Array.isArray(product.application_area)) return product.application_area;
              if (typeof product.application_area === 'string') {
                const parsed = JSON.parse(product.application_area);
                return Array.isArray(parsed) ? parsed : [product.application_area];
              }
              return [product.application_area];
            } catch {
              return Array.isArray(product.application_area) ? product.application_area : [product.application_area];
            }
          })(),
          how_to_use: product.how_to_use || null
        };
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          products: formattedProducts,
          total: formattedProducts.length
        })
      };
    }

    // POST - Criar novo produto
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      
      const { name, description, price, stock, images, image_url, image_crop_positions, category_id, brand_id, discount_percentage, original_price, discount_duration, application_area, how_to_use } = body;

      if (!name || !price) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Nome e preço são obrigatórios' })
        };
      }

      // Processar imagens (até 3)
      let imagesArray = [];
      if (images && Array.isArray(images)) {
        imagesArray = images.filter(url => url && url.trim() !== '').slice(0, 3);
      } else if (image_url) {
        imagesArray = [image_url];
      }

      // Calcular preço final com desconto
      const originalPriceValue = parseFloat(original_price || price || 0);
      const discount = parseFloat(discount_percentage || 0);
      const finalPrice = discount > 0 ? originalPriceValue * (1 - discount / 100) : originalPriceValue;
      
      // Definir data de início do desconto se houver desconto
      let discountStartDate = null;
      if (discount > 0 && discount_duration && discount_duration !== 'unlimited') {
        discountStartDate = new Date().toISOString();
      }

      // Processar posições de crop das imagens
      let cropPositionsArray = [];
      if (image_crop_positions && Array.isArray(image_crop_positions)) {
        cropPositionsArray = image_crop_positions.slice(0, 3);
        // Garantir que cada posição tenha x e y
        cropPositionsArray = cropPositionsArray.map((pos, idx) => ({
          x: pos && typeof pos.x !== 'undefined' ? parseFloat(pos.x) : 50,
          y: pos && typeof pos.y !== 'undefined' ? parseFloat(pos.y) : 50
        }));
      } else if (imagesArray.length > 0) {
        // Criar posições padrão (centro) se não fornecidas
        cropPositionsArray = imagesArray.map(() => ({ x: 50, y: 50 }));
      }

      const insertData = {
        name,
        description: description || '',
        price: finalPrice,
        stock: parseInt(stock) || 0,
        images: imagesArray,
        image_url: imagesArray[0] || '', // Mantém compatibilidade
        image_crop_positions: cropPositionsArray.length > 0 ? cropPositionsArray : null,
        is_active: category_id ? true : false,
        discount_percentage: discount > 0 ? discount : 0,
        original_price: discount > 0 ? originalPriceValue : null,
        discount_duration: discount > 0 ? (discount_duration || 'unlimited') : null,
        discount_start_date: discountStartDate,
        application_area: Array.isArray(application_area) && application_area.length > 0 ? application_area : null,
        how_to_use: how_to_use || null
      };

      if (category_id) insertData.category_id = category_id;
      if (brand_id) insertData.brand_id = brand_id;

      const { data: product, error } = await supabase
        .from('products')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ product, message: 'Produto criado com sucesso!' })
      };
    }

    // PUT - Atualizar produto (incluindo estoque)
    if (event.httpMethod === 'PUT') {
      const body = JSON.parse(event.body || '{}');
      const productId = body.id;

      if (!productId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'ID do produto é obrigatório' })
        };
      }

      const updates = {};
      if (body.name !== undefined) updates.name = body.name;
      if (body.description !== undefined) updates.description = body.description;
      if (body.stock !== undefined) updates.stock = parseInt(body.stock);
      
      // Processar imagens (até 3) e posições de crop
      if (body.images !== undefined) {
        let imagesArray = [];
        if (Array.isArray(body.images)) {
          imagesArray = body.images.filter(url => url && url.trim() !== '').slice(0, 3);
        }
        updates.images = imagesArray;
        updates.image_url = imagesArray[0] || ''; // Mantém compatibilidade
        
        // Processar posições de crop
        if (body.image_crop_positions !== undefined && Array.isArray(body.image_crop_positions)) {
          let cropPositionsArray = body.image_crop_positions.slice(0, 3);
          // Garantir que cada posição tenha x e y
          cropPositionsArray = cropPositionsArray.map((pos, idx) => ({
            x: pos && typeof pos.x !== 'undefined' ? parseFloat(pos.x) : 50,
            y: pos && typeof pos.y !== 'undefined' ? parseFloat(pos.y) : 50
          }));
          // Se tiver mais imagens que posições, adicionar posições padrão
          while (cropPositionsArray.length < imagesArray.length) {
            cropPositionsArray.push({ x: 50, y: 50 });
          }
          updates.image_crop_positions = cropPositionsArray.length > 0 ? cropPositionsArray : null;
        } else if (imagesArray.length > 0) {
          // Criar posições padrão se não fornecidas
          updates.image_crop_positions = imagesArray.map(() => ({ x: 50, y: 50 }));
        }
      } else if (body.image_url !== undefined) {
        updates.image_url = body.image_url;
        // Se não houver images, criar array com image_url
        const currentProduct = await supabase.from('products').select('images, image_crop_positions').eq('id', productId).single();
        let currentImages = [];
        let currentCropPositions = [];
        if (currentProduct.data && currentProduct.data.images) {
          try {
            currentImages = Array.isArray(currentProduct.data.images) ? currentProduct.data.images : JSON.parse(currentProduct.data.images);
          } catch {}
        }
        if (currentProduct.data && currentProduct.data.image_crop_positions) {
          try {
            currentCropPositions = Array.isArray(currentProduct.data.image_crop_positions) ? currentProduct.data.image_crop_positions : JSON.parse(currentProduct.data.image_crop_positions);
          } catch {}
        }
        if (currentImages.length === 0 && body.image_url) {
          updates.images = [body.image_url];
          updates.image_crop_positions = [{ x: 50, y: 50 }];
        } else if (currentImages.length > 0 && body.image_url) {
          currentImages[0] = body.image_url;
          updates.images = currentImages.slice(0, 3);
          // Manter posições de crop existentes ou adicionar padrão
          if (currentCropPositions.length > 0) {
            updates.image_crop_positions = currentCropPositions.slice(0, 3);
          } else {
            updates.image_crop_positions = currentImages.map(() => ({ x: 50, y: 50 }));
          }
        }
      }
      
      // Processar image_crop_positions separadamente se enviado
      if (body.image_crop_positions !== undefined && body.images === undefined) {
        if (Array.isArray(body.image_crop_positions)) {
          let cropPositionsArray = body.image_crop_positions.slice(0, 3);
          cropPositionsArray = cropPositionsArray.map((pos, idx) => ({
            x: pos && typeof pos.x !== 'undefined' ? parseFloat(pos.x) : 50,
            y: pos && typeof pos.y !== 'undefined' ? parseFloat(pos.y) : 50
          }));
          updates.image_crop_positions = cropPositionsArray.length > 0 ? cropPositionsArray : null;
        }
      }
      
      // Gerenciar preço e desconto
      if (body.price !== undefined || body.discount_percentage !== undefined || body.original_price !== undefined || body.remove_discount !== undefined) {
        const removeDiscount = body.remove_discount === true || body.remove_discount === 'true';
        
        if (removeDiscount) {
          // Remover desconto
          const currentProduct = await supabase.from('products').select('original_price, price').eq('id', productId).single();
          const restoredPrice = currentProduct.data?.original_price || currentProduct.data?.price || parseFloat(body.price || body.original_price || 0);
          
          updates.price = restoredPrice;
          updates.original_price = null;
          updates.discount_percentage = 0;
          updates.discount_duration = null;
          updates.discount_start_date = null;
        } else {
          const originalPrice = parseFloat(body.original_price || body.price || 0);
          const discount = parseFloat(body.discount_percentage || 0);
          const finalPrice = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;
          
          updates.price = finalPrice;
          updates.original_price = discount > 0 ? originalPrice : null;
          updates.discount_percentage = discount > 0 ? discount : 0;
          
          // Definir duração do desconto
          if (discount > 0) {
            const discountDuration = body.discount_duration || 'unlimited';
            updates.discount_duration = discountDuration;
            
            // Definir data de início se não for unlimited
            if (discountDuration !== 'unlimited') {
              const currentProduct = await supabase.from('products').select('discount_start_date, discount_duration').eq('id', productId).single();
              // Se já existe desconto ativo, manter data original; senão, criar nova
              if (!currentProduct.data?.discount_start_date || 
                  (currentProduct.data?.discount_duration !== discountDuration)) {
                updates.discount_start_date = new Date().toISOString();
              }
            } else {
              updates.discount_start_date = null;
            }
          } else {
            updates.discount_duration = null;
            updates.discount_start_date = null;
          }
        }
      }
      
      // Novos campos
      if (body.application_area !== undefined) {
        // Se for array, converter para JSONB; se for null/vazio, definir como array vazio
        if (Array.isArray(body.application_area) && body.application_area.length > 0) {
          updates.application_area = body.application_area;
        } else {
          updates.application_area = null;
        }
      }
      if (body.how_to_use !== undefined) updates.how_to_use = body.how_to_use || null;
      
      // Processar is_active diretamente (se enviado) - deve ser processado antes de category_id
      if (body.is_active !== undefined) {
        updates.is_active = body.is_active === true || body.is_active === 'true' || body.is_active === 1;
      }
      
      if (body.category_id !== undefined) {
        updates.category_id = body.category_id || null;
        // Se remover categoria, produto fica inativo (a menos que is_active já tenha sido definido)
        if (!body.category_id && body.is_active === undefined) {
          updates.is_active = false;
        }
      }
      if (body.brand_id !== undefined) updates.brand_id = body.brand_id || null;

      const { data: product, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', productId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ product, message: 'Produto atualizado com sucesso!' })
      };
    }

    // DELETE - Excluir produto
    if (event.httpMethod === 'DELETE') {
      const body = JSON.parse(event.body || '{}');
      const productId = body.id || event.queryStringParameters?.id;

      if (!productId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'ID do produto é obrigatório' })
        };
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        throw error;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Produto excluído com sucesso!' })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (e) {
    console.error('Error in admin-products:', e);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Erro no servidor',
        details: e.message
      })
    };
  }
};

