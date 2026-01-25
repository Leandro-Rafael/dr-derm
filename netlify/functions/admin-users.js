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
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS'
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

  const supabase = getSupabaseClient();

  try {
    // GET - Listar usuários
    if (event.httpMethod === 'GET') {
      const { data: users, error } = await supabase
        .from('users')
        .select('id, email, name, phone, created_at, is_admin, is_blocked, diploma_image, council_card_image, council_number')
        .order('created_at', { ascending: false });

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching users:', error);
        }
        throw error;
      }

      // Remover informações sensíveis, mas manter imagens dos documentos
      const sanitizedUsers = (users || []).map(user => ({
        id: user.id,
        email: user.email,
        name: user.name || '',
        phone: user.phone || '',
        isAdmin: user.is_admin || false,
        isBlocked: user.is_blocked || false,
        createdAt: user.created_at || '',
        diploma_image: user.diploma_image || null,
        council_card_image: user.council_card_image || null,
        council_number: user.council_number || null
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          users: sanitizedUsers,
          total: sanitizedUsers.length
        })
      };
    }

    // PUT - Bloquear/Desbloquear usuário
    if (event.httpMethod === 'PUT') {
      const body = JSON.parse(event.body || '{}');
      const userId = body.id || body.user_id;
      const isBlocked = body.is_blocked !== undefined ? body.is_blocked : true;

      if (!userId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'ID do usuário é obrigatório' })
        };
      }

      // Verificar se é admin - admin nunca pode ser bloqueado
      const { data: targetUser, error: fetchError } = await supabase
        .from('users')
        .select('email, is_admin')
        .eq('id', userId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (targetUser.is_admin && targetUser.email === 'drderm.adm@ofc') {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ error: 'Não é possível bloquear o acesso do administrador' })
        };
      }

      const { error } = await supabase
        .from('users')
        .update({ is_blocked: isBlocked })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: isBlocked ? 'Usuário bloqueado com sucesso!' : 'Usuário desbloqueado com sucesso!'
        })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error in admin-users:', e);
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

