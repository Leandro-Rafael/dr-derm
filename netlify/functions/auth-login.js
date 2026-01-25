const { getSupabaseClient } = require('./supabase-client');

// Função para validar email
function isValidEmail(email) {
    // Permitir email administrativo especial sem TLD
    if ((email || '').toLowerCase() === 'drderm.adm@ofc') return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

exports.handler = async function (event) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const email = (body.email || '').toLowerCase().trim();
    const password = String(body.password || '');
    const name = (body.name || '').trim();
    const phone = (body.phone || '').trim();

    if (!email || !password) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email e senha são obrigatórios' }) };
    }

    // Validação de email
    if (!isValidEmail(email)) {
      return { 
        statusCode: 400, 
        headers, 
        body: JSON.stringify({ error: 'Email inválido. Por favor, insira um email válido.' }) 
      };
    }

    const supabase = getSupabaseClient();

    // Se for tentativa de login admin, garantir que o usuário existe
    if (email === 'drderm.adm@ofc') {
      // Buscar ou criar usuário admin
      let { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

      // Se não existir, criar o admin
      if (userError && userError.code === 'PGRST116') {
        const { data: newAdmin, error: createError } = await supabase
          .from('users')
          .insert({
            email: 'drderm.adm@ofc',
            name: 'Administrador',
            password_hash: 'demo:Bruno',
            is_admin: true,
            is_blocked: false
          })
          .select()
          .single();

        if (createError) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error creating admin:', createError);
          }
          throw createError;
        }
        user = newAdmin;
      } else if (userError) {
      if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching admin:', userError);
      }
      throw userError;
    }

      // Verificar senha do admin
      // A senha está armazenada como 'demo:Bruno'
      const expectedPassword = 'Bruno';
      const expectedHash = 'demo:Bruno';
      
      // Verificar se a senha fornecida corresponde
      const passwordMatch = password === expectedPassword && 
                           (user.password_hash === expectedHash || 
                            user.password_hash.endsWith(expectedPassword) ||
                            user.password_hash.includes(expectedPassword));

      if (!passwordMatch) {
        return { 
          statusCode: 401, 
          headers, 
          body: JSON.stringify({ error: 'Credenciais inválidas' }) 
        };
      }
      
      // Garantir que admin está desbloqueado e é admin
      if (user.is_blocked || !user.is_admin) {
        await supabase
          .from('users')
          .update({ is_blocked: false, is_admin: true })
          .eq('id', user.id);
        user.is_blocked = false;
        user.is_admin = true;
      }
      
      const token = Buffer.from(`admin|${user.email}`).toString('base64');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          token,
          email: user.email,
          name: user.name || 'Administrador',
          phone: user.phone || '',
          isAdmin: true
        })
      };
    }

    // Buscar usuário no banco (usuários normais)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError && userError.code !== 'PGRST116') { // PGRST116 = no rows returned
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching user:', userError);
      }
      throw userError;
    }

    if (user) {
      // Verificar se usuário está bloqueado
      if (user.is_blocked) {
        return { 
          statusCode: 403, 
          headers, 
          body: JSON.stringify({ error: 'Seu acesso foi bloqueado pelo administrador' }) 
        };
      }
      
      // Verificar senha
      if (!user.password_hash.endsWith(password)) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Credenciais inválidas' }) };
      }

      // Atualizar nome/telefone se fornecidos
      if (name || phone) {
        const updates = {};
        if (name) updates.name = name;
        if (phone) updates.phone = phone;
        
        await supabase
          .from('users')
          .update(updates)
          .eq('id', user.id);
      }

      const token = Buffer.from(`demo|${user.email}`).toString('base64');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          token,
          email: user.email,
          name: user.name || email.split('@')[0],
          phone: user.phone || '',
          isAdmin: user.is_admin || false
        })
      };
    } else {
      // Usuário não encontrado - não criar automaticamente
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          error: 'Usuário não encontrado. Por favor, cadastre-se primeiro.' 
        })
      };
    }
  } catch (e) {
    console.error('auth-login error:', e);
    
    // Verificar se é erro de configuração do Supabase
    if (e.message && e.message.includes('Supabase URL e Key não configuradas')) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Configuração do banco de dados não encontrada',
          message: 'As variáveis de ambiente SUPABASE_URL e SUPABASE_ANON_KEY não estão configuradas no Netlify. Configure-as em Site settings > Environment variables.'
        })
      };
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Erro no servidor. Tente novamente mais tarde.',
        message: process.env.NODE_ENV === 'development' ? e.message : undefined
      })
    };
  }
};


