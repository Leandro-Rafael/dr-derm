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
    const type = event.queryStringParameters?.type || 'category'; // 'category' ou 'brand'

    // GET - Listar categorias ou marcas
    if (event.httpMethod === 'GET') {
      const table = type === 'brand' ? 'brands' : 'categories';
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          items: data || [],
          total: (data || []).length,
          type: type
        })
      };
    }

    // PUT - Editar categoria ou marca
    if (event.httpMethod === 'PUT') {
      const body = JSON.parse(event.body || '{}');
      const itemId = body.id;
      const name = (body.name || '').trim();
      const itemType = body.type || type;

      if (!itemId || !name) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'ID e nome são obrigatórios' })
        };
      }

      const table = itemType === 'brand' ? 'brands' : 'categories';
      
      // Buscar item atual
      const { data: currentItem, error: fetchError } = await supabase
        .from(table)
        .select('*')
        .eq('id', itemId)
        .single();

      if (fetchError || !currentItem) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: `${itemType === 'brand' ? 'Marca' : 'Categoria'} não encontrada` })
        };
      }

      // Atualizar nome
      const { data: updated, error: updateError } = await supabase
        .from(table)
        .update({ name })
        .eq('id', itemId)
        .select()
        .single();

      if (updateError) {
        if (updateError.code === '23505') { // Unique violation
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: `${itemType === 'brand' ? 'Marca' : 'Categoria'} com este nome já existe` })
          };
        }
        throw updateError;
      }

      // Atualizar todos os produtos vinculados
      const productColumn = itemType === 'brand' ? 'brand_id' : 'category_id';
      const { error: productError } = await supabase
        .from('products')
        .update({ [productColumn]: itemId })
        .eq(productColumn, itemId);

      // Nota: Os produtos já estão vinculados, então só atualizamos se necessário
      // Na verdade, como só mudamos o nome, os produtos já estão corretos

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ item: updated, message: `${itemType === 'brand' ? 'Marca' : 'Categoria'} atualizada com sucesso!` })
      };
    }

    // POST - Criar categoria ou marca
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const name = (body.name || '').trim();
      const itemType = body.type || type;

      if (!name) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Nome é obrigatório' })
        };
      }

      const table = itemType === 'brand' ? 'brands' : 'categories';
      const { data, error } = await supabase
        .from(table)
        .insert({ name })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique violation
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: `${itemType === 'brand' ? 'Marca' : 'Categoria'} já existe` })
          };
        }
        throw error;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ item: data, message: `${itemType === 'brand' ? 'Marca' : 'Categoria'} criada com sucesso!` })
      };
    }

    // DELETE - Excluir categoria ou marca (mas primeiro mostrar produtos vinculados)
    if (event.httpMethod === 'DELETE') {
      const body = JSON.parse(event.body || '{}');
      const itemId = body.id;
      const itemType = body.type || type;
      const forceDelete = body.force === true; // Para forçar exclusão depois de mostrar produtos

      if (!itemId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'ID é obrigatório' })
        };
      }

      const table = itemType === 'brand' ? 'brands' : 'categories';
      const productColumn = itemType === 'brand' ? 'brand_id' : 'category_id';
      
      // Buscar produtos vinculados
      const { data: linkedProducts, error: productsError } = await supabase
        .from('products')
        .select('id, name')
        .eq(productColumn, itemId);

      if (productsError) {
        throw productsError;
      }

      // Se não for exclusão forçada e houver produtos vinculados, retornar lista
      if (!forceDelete && linkedProducts && linkedProducts.length > 0) {
        return {
          statusCode: 409, // Conflict
          headers,
          body: JSON.stringify({
            error: `Não é possível excluir esta ${itemType === 'brand' ? 'marca' : 'categoria'} pois há produtos vinculados`,
            products: linkedProducts,
            count: linkedProducts.length,
            itemType: itemType
          })
        };
      }

      // Se houver produtos e for exclusão forçada, desvincular produtos
      if (linkedProducts && linkedProducts.length > 0) {
        if (itemType === 'category') {
          // Desativar produtos sem categoria
          await supabase
            .from('products')
            .update({ category_id: null, is_active: false })
            .eq(productColumn, itemId);
        } else {
          // Para marca, apenas remover a marca (produtos ficam sem marca)
          await supabase
            .from('products')
            .update({ brand_id: null })
            .eq(productColumn, itemId);
        }
      }

      // Agora pode excluir a categoria/marca
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', itemId);

      if (error) {
        throw error;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: `${itemType === 'brand' ? 'Marca' : 'Categoria'} excluída com sucesso!`,
          productsAffected: linkedProducts?.length || 0
        })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (e) {
    console.error('Error in admin-categories:', e);
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

