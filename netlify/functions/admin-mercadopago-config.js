const { getSupabaseClient } = require('./supabase-client');
const { encrypt, decrypt } = require('./encryption-utils');
const { MercadoPagoConfig } = require('mercadopago');

// Helper para headers CORS
function getCorsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  };
}

// Função para extrair email do token customizado
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

/**
 * Valida as credenciais do MercadoPago fazendo uma requisição de teste
 * @param {string} accessToken - Token de acesso do MercadoPago
 * @returns {Promise<{valid: boolean, error?: string, accountInfo?: object}>}
 */
async function validateMercadoPagoCredentials(accessToken) {
  try {
    const client = new MercadoPagoConfig({
      accessToken: accessToken
    });

    // Fazer uma requisição simples para validar o token
    // Usamos a API de usuário que é pública e não requer dados sensíveis
    const response = await fetch('https://api.mercadopago.com/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { valid: false, error: 'Token de acesso inválido ou expirado' };
      }
      return { valid: false, error: `Erro ao validar credenciais: ${response.status}` };
    }

    const accountInfo = await response.json();
    return { 
      valid: true, 
      accountInfo: {
        id: accountInfo.id,
        nickname: accountInfo.nickname,
        email: accountInfo.email
      }
    };
  } catch (error) {
    console.error('Erro ao validar credenciais:', error);
    return { valid: false, error: error.message || 'Erro ao conectar com MercadoPago' };
  }
}

exports.handler = async (event, context) => {
  const headers = getCorsHeaders();

  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Verificar autenticação de admin
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

    // GET - Listar todas as contas
    if (event.httpMethod === 'GET') {
      const { data: accounts, error } = await supabase
        .from('mercadopago_accounts')
        .select('id, name, is_active, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar contas:', error);
        throw error;
      }

      // Não retornar tokens criptografados, apenas metadados
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          accounts: accounts || [],
          total: (accounts || []).length
        })
      };
    }

    // POST - Criar nova conta
    if (event.httpMethod === 'POST') {
      let bodyData;
      try {
        bodyData = JSON.parse(event.body);
      } catch (parseError) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Dados inválidos', message: parseError.message })
        };
      }

      const { name, access_token, public_key, is_active } = bodyData;

      // Validações
      if (!name || !access_token) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Nome e Access Token são obrigatórios' })
        };
      }

      // Validar credenciais antes de salvar
      const validation = await validateMercadoPagoCredentials(access_token);
      if (!validation.valid) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Credenciais inválidas', 
            message: validation.error 
          })
        };
      }

      // Criptografar credenciais
      const accessTokenEncrypted = encrypt(access_token);
      const publicKeyEncrypted = public_key ? encrypt(public_key) : null;

      // Se esta conta será ativa, desativar todas as outras
      if (is_active) {
        await supabase
          .from('mercadopago_accounts')
          .update({ is_active: false })
          .neq('is_active', false); // Atualizar todas que estão ativas
      }

      // Inserir nova conta
      const { data: newAccount, error: insertError } = await supabase
        .from('mercadopago_accounts')
        .insert({
          name,
          access_token_encrypted: accessTokenEncrypted,
          public_key_encrypted: publicKeyEncrypted,
          is_active: is_active || false
        })
        .select('id, name, is_active, created_at, updated_at')
        .single();

      if (insertError) {
        console.error('Erro ao criar conta:', insertError);
        throw insertError;
      }

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          message: 'Conta criada com sucesso',
          account: newAccount,
          accountInfo: validation.accountInfo
        })
      };
    }

    // PUT - Atualizar conta
    if (event.httpMethod === 'PUT') {
      let bodyData;
      try {
        bodyData = JSON.parse(event.body);
      } catch (parseError) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Dados inválidos', message: parseError.message })
        };
      }

      const { id, name, access_token, public_key, is_active } = bodyData;

      if (!id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'ID da conta é obrigatório' })
        };
      }

      // Buscar conta existente
      const { data: existingAccount, error: fetchError } = await supabase
        .from('mercadopago_accounts')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !existingAccount) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Conta não encontrada' })
        };
      }

      // Se access_token foi fornecido, validar e criptografar
      let accessTokenEncrypted = existingAccount.access_token_encrypted;
      if (access_token) {
        const validation = await validateMercadoPagoCredentials(access_token);
        if (!validation.valid) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ 
              error: 'Credenciais inválidas', 
              message: validation.error 
            })
          };
        }
        accessTokenEncrypted = encrypt(access_token);
      }

      // Se public_key foi fornecido, criptografar
      let publicKeyEncrypted = existingAccount.public_key_encrypted;
      if (public_key !== undefined) {
        publicKeyEncrypted = public_key ? encrypt(public_key) : null;
      }

      // Se esta conta será ativada, desativar todas as outras
      if (is_active === true) {
        await supabase
          .from('mercadopago_accounts')
          .update({ is_active: false })
          .neq('id', id);
      }

      // Atualizar conta
      const updateData = {};
      if (name) updateData.name = name;
      if (access_token) updateData.access_token_encrypted = accessTokenEncrypted;
      if (public_key !== undefined) updateData.public_key_encrypted = publicKeyEncrypted;
      if (is_active !== undefined) updateData.is_active = is_active;

      const { data: updatedAccount, error: updateError } = await supabase
        .from('mercadopago_accounts')
        .update(updateData)
        .eq('id', id)
        .select('id, name, is_active, created_at, updated_at')
        .single();

      if (updateError) {
        console.error('Erro ao atualizar conta:', updateError);
        throw updateError;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Conta atualizada com sucesso',
          account: updatedAccount
        })
      };
    }

    // PATCH - Ativar/desativar conta
    if (event.httpMethod === 'PATCH') {
      let bodyData;
      try {
        bodyData = JSON.parse(event.body);
      } catch (parseError) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Dados inválidos', message: parseError.message })
        };
      }

      const { id, is_active } = bodyData;

      if (!id || is_active === undefined) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'ID e is_active são obrigatórios' })
        };
      }

      // Se ativando, desativar todas as outras
      if (is_active === true) {
        await supabase
          .from('mercadopago_accounts')
          .update({ is_active: false })
          .neq('id', id);
      }

      // Atualizar conta
      const { data: updatedAccount, error: updateError } = await supabase
        .from('mercadopago_accounts')
        .update({ is_active })
        .eq('id', id)
        .select('id, name, is_active, created_at, updated_at')
        .single();

      if (updateError) {
        console.error('Erro ao atualizar status da conta:', updateError);
        throw updateError;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: is_active ? 'Conta ativada com sucesso' : 'Conta desativada com sucesso',
          account: updatedAccount
        })
      };
    }

    // DELETE - Remover conta
    if (event.httpMethod === 'DELETE') {
      const { id } = event.queryStringParameters || {};

      if (!id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'ID da conta é obrigatório' })
        };
      }

      // Verificar se existe
      const { data: existingAccount, error: fetchError } = await supabase
        .from('mercadopago_accounts')
        .select('id, is_active')
        .eq('id', id)
        .single();

      if (fetchError || !existingAccount) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Conta não encontrada' })
        };
      }

      // Não permitir deletar conta ativa
      if (existingAccount.is_active) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Não é possível remover a conta ativa. Desative-a primeiro.' })
        };
      }

      // Deletar conta
      const { error: deleteError } = await supabase
        .from('mercadopago_accounts')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Erro ao deletar conta:', deleteError);
        throw deleteError;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Conta removida com sucesso'
        })
      };
    }

    // Método não suportado
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método não permitido' })
    };

  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Erro no servidor',
        message: error.message || 'Erro desconhecido'
      })
    };
  }
};
