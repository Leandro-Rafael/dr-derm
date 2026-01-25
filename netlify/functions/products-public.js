const { getSupabaseClient } = require('./supabase-client');

exports.handler = async function (event) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const supabase = getSupabaseClient();

    // Buscar apenas produtos ativos (is_active = true)
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
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
          const restoredPrice = originalPrice || parseFloat(product.price || 0);
          discountPercentage = 0;
          originalPrice = null;
          // Atualizar no banco em background
          supabase.from('products').update({
            discount_percentage: 0,
            original_price: null,
            discount_duration: null,
            discount_start_date: null,
            price: restoredPrice
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
      
      const finalPrice = discountPercentage > 0 ? parseFloat(product.price || 0) : parseFloat(product.price || 0);
      
      return {
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: finalPrice,
        original_price: discountPercentage > 0 ? originalPrice : null,
        discount_percentage: discountPercentage,
        stock: parseInt(product.stock || 0),
        is_active: product.is_active === true || product.is_active === 1, // Garantir que is_active seja booleano
        images: images,
        image_url: images[0] || product.image_url || '', // Mantém compatibilidade
        category: product.category_id ? categoriesMap[product.category_id] || null : null,
        brand: product.brand_id ? brandsMap[product.brand_id] || 'marca não identificada' : 'marca não identificada',
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
        how_to_use: product.how_to_use || null,
        created_at: product.created_at
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
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
    console.error('Error in products-public:', e);
    }
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Erro no servidor. Tente novamente mais tarde.'
      })
    };
  }
};

