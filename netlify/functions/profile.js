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

const { getSupabaseClient } = require('./supabase-client');

exports.handler = async function (event) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const email = getEmailFromAuth(event.headers.authorization || event.headers.Authorization);
  if (!email) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Não autenticado' })
    };
  }

  try {
    const supabase = getSupabaseClient();

    if (event.httpMethod === 'GET') {
      const { data: user, error } = await supabase
        .from('users')
        .select('email, name, phone')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          email: user?.email || email,
          name: user?.name || email.split('@')[0] || '',
          phone: user?.phone || ''
        })
      };
    }

    if (event.httpMethod === 'PUT' || event.httpMethod === 'POST') {
      try {
        const body = JSON.parse(event.body || '{}');
        
        const updates = {};
        if (body.name !== undefined) updates.name = body.name;
        if (body.phone !== undefined) updates.phone = body.phone;

        // Atualização de senha (opcional)
        if (body.newPassword !== undefined && String(body.newPassword).trim()) {
          const newPassword = String(body.newPassword).trim();
          if (newPassword.length < 6) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ error: 'A nova senha deve ter pelo menos 6 caracteres' })
            };
          }
          updates.password_hash = `demo:${newPassword}`;
        }

        const { error: updateError } = await supabase
          .from('users')
          .update(updates)
          .eq('email', email);

        if (updateError) {
          throw updateError;
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ ok: true, message: 'Dados atualizados com sucesso!' })
        };
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error updating profile:', e);
        }
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Erro ao atualizar perfil. Tente novamente.' })
        };
      }
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error in profile:', e);
      console.error('Stack:', e.stack);
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


