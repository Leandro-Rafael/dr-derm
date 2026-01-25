const { getSupabaseClient } = require('./supabase-client');

exports.handler = async function (event) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const supabase = getSupabaseClient();

    // GET - Buscar avaliações de um produto
    if (event.httpMethod === 'GET') {
      const productId = event.queryStringParameters?.product_id;

      if (!productId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'product_id é obrigatório' })
        };
      }

      const { data: reviews, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Calcular média de avaliações
      let averageRating = 0;
      let ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      if (reviews && reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => {
          ratingCounts[review.rating]++;
          return sum + review.rating;
        }, 0);
        averageRating = totalRating / reviews.length;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          reviews: reviews || [],
          averageRating: parseFloat(averageRating.toFixed(1)),
          totalReviews: reviews?.length || 0,
          ratingCounts
        })
      };
    }

    // POST - Criar nova avaliação
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { product_id, user_email, user_name, rating, comment } = body;

      if (!product_id || !user_email || !user_name || !rating) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'product_id, user_email, user_name e rating são obrigatórios' })
        };
      }

      if (rating < 1 || rating > 5) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Avaliação deve ser entre 1 e 5' })
        };
      }

      const insertData = {
        product_id,
        user_email,
        user_name,
        rating: parseInt(rating),
        comment: comment || null
      };

      const { data: review, error } = await supabase
        .from('product_reviews')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          review, 
          message: 'Avaliação enviada com sucesso!' 
        })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (e) {
    console.error('Error in product-reviews:', e);
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

