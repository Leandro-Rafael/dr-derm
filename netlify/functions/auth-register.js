const { getSupabaseClient } = require('./supabase-client');

// Função para validar email
function isValidEmail(email) {
    // NÃO permitir email administrativo no registro por segurança
    if ((email || '').toLowerCase() === 'drderm.adm@ofc') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função para verificar se é Gmail
function isGmail(email) {
    const gmailRegex = /^[^\s@]+@gmail\.com$/i;
    return gmailRegex.test(email);
}

// Função para validar senha forte
function validatePassword(password) {
    const errors = [];
    
    if (!password || typeof password !== 'string') {
        return ['Senha é obrigatória'];
    }
    
    // Mínimo de 8 caracteres
    if (password.length < 8) {
        errors.push('Mínimo de 8 caracteres');
    }
    
    // Pelo menos uma letra maiúscula
    if (!/[A-Z]/.test(password)) {
        errors.push('Pelo menos uma letra maiúscula');
    }
    
    // Pelo menos uma letra minúscula
    if (!/[a-z]/.test(password)) {
        errors.push('Pelo menos uma letra minúscula');
    }
    
    // Pelo menos um número
    if (!/[0-9]/.test(password)) {
        errors.push('Pelo menos um número');
    }
    
    // Pelo menos um caractere especial
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Pelo menos um caractere especial (!@#$%^&*...)');
    }
    
    return errors;
}

// Toggle temporário para testes: definir como true para desabilitar toda verificação externa
const EMAIL_VALIDATION_DISABLED = true; // TODO: coloque false para reativar validação externa

// Função para verificar se email existe usando API de validação
// Suporta: MailboxValidator (recomendado, mais simples) e Abstract API (fallback)
async function verifyEmailExists(email) {
    try {
        // Desabilitado para testes (aceita email após checagem de formato feita antes)
        if (EMAIL_VALIDATION_DISABLED) {
            return { valid: true, reason: 'validation_disabled_for_tests' };
        }
        // Prioridade: Abstract API > MailboxValidator > Verificação básica
        const abstractKey = process.env.ABSTRACT_API_KEY || process.env.EMAIL_VALIDATION_API_KEY;
        const mailboxKey = process.env.MAILBOXVALIDATOR_API_KEY;
        
        // Tentar Abstract API primeiro (prioridade do usuário)
        if (abstractKey) {
            console.log('Using Abstract API (user preference)');
            return await verifyWithAbstractAPI(email, abstractKey);
        }
        
        // Tentar MailboxValidator como fallback
        if (mailboxKey) {
            console.log('Verifying email with MailboxValidator:', email);
            
            const apiUrl = `https://api.mailboxvalidator.com/v1/validation/single?email=${encodeURIComponent(email)}&key=${mailboxKey}`;
            const response = await fetch(apiUrl);
            
            if (response.ok) {
                const data = await response.json();
                console.log('MailboxValidator response:', JSON.stringify(data, null, 2));
                
                // MailboxValidator retorna: status (true/false), error_code, error_message
                if (data.status === 'true' || data.status === true) {
                    // Verificar se não é email descartável
                    if (data.is_disposable === 'True' || data.is_disposable === true) {
                        return {
                            valid: false,
                            reason: 'Email temporário/descartável não permitido',
                            details: data
                        };
                    }
                    
                    // Verificar se é válido
                    if (data.is_verified === 'True' || data.is_verified === true) {
                        console.log('Email accepted by MailboxValidator');
                        return { valid: true, details: data };
                    }
                    
                    // Se não está verificado mas status é true, aceitar
                    console.log('Email accepted by MailboxValidator (status true)');
                    return { valid: true, details: data };
                } else {
                    // Status false ou erro
                    const errorMsg = data.error_message || 'Email inválido ou não existe';
                    return {
                        valid: false,
                        reason: errorMsg,
                        details: data
                    };
                }
            } else {
                const errorText = await response.text();
                console.error('MailboxValidator API error:', response.status, errorText);
                
                if (response.status === 401 || response.status === 403) {
                    return {
                        valid: false,
                        reason: 'Chave de API MailboxValidator inválida. Verifique a variável MAILBOXVALIDATOR_API_KEY.',
                        details: { status: response.status, error: errorText }
                    };
                }
                
                // Se falhar, tentar Abstract API como fallback
                if (abstractKey) {
                    console.log('MailboxValidator failed, trying Abstract API...');
                    return await verifyWithAbstractAPI(email, abstractKey);
                }
            }
        }
        
        
        // Se nenhuma API configurada, usar verificação básica
        console.log('No API configured, using basic validation');
        return await verifyEmailBasic(email);
        
    } catch (error) {
        console.error('Error verifying email:', error);
        return {
            valid: false,
            reason: 'Erro ao verificar email: ' + error.message,
            details: { error: error.message }
        };
    }
}

// Função para verificar com Abstract API (fallback)
async function verifyWithAbstractAPI(email, apiKey) {
    try {
        const apiUrl = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email)}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Abstract API error:', response.status, errorText);
            
            if (response.status === 401) {
                return {
                    valid: false,
                    reason: 'Chave de API Abstract inválida. Verifique as variáveis ABSTRACT_API_KEY ou EMAIL_VALIDATION_API_KEY.',
                    details: { status: response.status, error: errorText }
                };
            }
            
            // Em caso de erro, fazer fallback para verificação básica
            console.log('Abstract API failed, using basic validation');
            return await verifyEmailBasic(email);
        }
        
        const data = await response.json();
        
        // Lógica da Abstract API (mantida do código anterior)
        const isValidFormat = data.is_valid_format?.value === true;
        if (!isValidFormat) {
            return {
                valid: false,
                reason: 'Formato de email inválido',
                details: data
            };
        }
        
        const deliverability = data.deliverability;
        const isSMTPValid = data.is_smtp_valid?.value !== false;
        const isSMTPRejected = data.is_smtp_valid?.value === false;
        const isDisposable = data.is_disposable_email?.value === true;
        
        if (isDisposable || deliverability === 'UNDELIVERABLE' || isSMTPRejected) {
            return {
                valid: false,
                reason: 'Email inválido ou não pode ser entregue',
                details: { deliverability, isSMTPValid, isDisposable }
            };
        }
        
        if (deliverability === 'DELIVERABLE' || (isSMTPValid && deliverability !== 'UNDELIVERABLE')) {
            return { valid: true, details: data };
        }
        
        return {
            valid: false,
            reason: `Email não verificado (${deliverability})`,
            details: { deliverability, isSMTPValid }
        };
    } catch (error) {
        console.error('Error with Abstract API:', error);
        return await verifyEmailBasic(email);
    }
}

// Verificação básica sem API (fallback)
async function verifyEmailBasic(email) {
    try {
        const domain = email.split('@')[1];
        if (!domain) {
            return {
                valid: false,
                reason: 'Formato de email inválido',
                details: { domain: null }
            };
        }
        
        // Lista de domínios válidos conhecidos
        const validDomains = [
            'gmail.com', 'googlemail.com',
            'yahoo.com', 'yahoo.com.br', 'ymail.com', 'rocketmail.com',
            'hotmail.com', 'hotmail.com.br', 'outlook.com', 'outlook.com.br', 'live.com', 'msn.com',
            'icloud.com', 'me.com', 'mac.com',
            'protonmail.com', 'proton.me',
            'aol.com',
            'mail.com',
            'zoho.com', 'zoho.com.br',
            'gmx.com'
        ];
        
        const domainLower = domain.toLowerCase();
        
        // Verificar se é domínio conhecido
        if (validDomains.includes(domainLower)) {
            console.log('Email aceito: domínio conhecido');
            return { valid: true, reason: 'Domínio válido conhecido' };
        }
        
        // Verificar formato básico (deve ter ponto no domínio)
        if (domainLower.includes('.') && domainLower.length > 4) {
            // Rejeitar domínios obviamente inválidos
            const invalidPatterns = ['test.com', 'example.com', 'invalid.com', 'fake.com', 'temp.com'];
            if (invalidPatterns.includes(domainLower)) {
                return {
                    valid: false,
                    reason: 'Domínio não permitido',
                    details: { domain: domainLower }
                };
            }
            
            // Aceitar outros domínios com formato válido
            console.log('Email aceito: formato válido (sem verificação API)');
            return { valid: true, reason: 'Formato válido' };
        }
        
        return {
            valid: false,
            reason: 'Formato de domínio inválido',
            details: { domain: domainLower }
        };
    } catch (error) {
        console.error('Error in basic email verification:', error);
        return {
            valid: false,
            reason: 'Erro na verificação: ' + error.message,
            details: { error: error.message }
        };
    }
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
    const councilNumber = (body.councilNumber || '').trim();
    const diplomaImageBase64 = body.diplomaImageBase64 || '';
    const councilCardImageBase64 = body.councilCardImageBase64 || '';

    // Validação de campos obrigatórios
    if (!email || !password || !name) {
      return { 
        statusCode: 400, 
        headers, 
        body: JSON.stringify({ error: 'Email, senha e nome são obrigatórios' }) 
      };
    }

    // BLOQUEAR explicitamente o email do admin no registro por segurança
    if (email === 'drderm.adm@ofc') {
      return { 
        statusCode: 403, 
        headers, 
        body: JSON.stringify({ error: 'Este email não pode ser usado para registro.' }) 
      };
    }

    // Validação de email
    if (!isValidEmail(email)) {
      return { 
        statusCode: 400, 
        headers, 
        body: JSON.stringify({ error: 'Email inválido. Por favor, insira um email válido.' }) 
      };
    }

    // Verificar se email existe e é entregável
    const emailVerificationResult = await verifyEmailExists(email);
    if (!emailVerificationResult.valid) {
      // Retornar informações detalhadas do erro para debug
      const errorMessage = emailVerificationResult.reason 
        ? `Email inválido: ${emailVerificationResult.reason}`
        : 'Este email não existe ou não é válido. Por favor, use um email válido e existente.';
      
      return { 
        statusCode: 400, 
        headers, 
        body: JSON.stringify({ 
          error: errorMessage,
          debug: process.env.NODE_ENV === 'development' ? emailVerificationResult.details : undefined
        }) 
      };
    }

    // Validação de senha forte
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return { 
        statusCode: 400, 
        headers, 
        body: JSON.stringify({ 
          error: 'A senha não atende aos requisitos de segurança',
          details: passwordErrors,
          requirements: [
            'Mínimo de 8 caracteres',
            'Pelo menos uma letra maiúscula',
            'Pelo menos uma letra minúscula',
            'Pelo menos um número',
            'Pelo menos um caractere especial (!@#$%^&*...)'
          ]
        }) 
      };
    }

    // Validação mínima de documentos
    if (!councilNumber || councilNumber.length < 4 || councilNumber.length > 32) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Informe um número de conselho válido' })
      };
    }
    function isValidDataUrlImage(s) {
      return typeof s === 'string' && /^data:image\/(png|jpe?g|webp);base64,/.test(s);
    }
    function approxSizeFromBase64(dataUrl) {
      try { const b64 = dataUrl.split(',')[1] || ''; return Math.ceil((b64.length * 3) / 4); } catch { return 0; }
    }
    if (!isValidDataUrlImage(diplomaImageBase64) || !isValidDataUrlImage(councilCardImageBase64)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Envie imagens válidas do diploma e carteira (PNG/JPG/WebP)' }) };
    }
    const maxBytes = 5 * 1024 * 1024; // 5MB
    if (approxSizeFromBase64(diplomaImageBase64) > maxBytes || approxSizeFromBase64(councilCardImageBase64) > maxBytes) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Imagens devem ter no máximo 5MB' }) };
    }

    const supabase = getSupabaseClient();

    // Verificar se o email já existe
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('id, email, is_blocked')
      .eq('email', email)
      .single();

    if (userError && userError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking user:', userError);
      throw userError;
    }

    if (existingUser) {
      return { 
        statusCode: 409, 
        headers, 
        body: JSON.stringify({ error: 'Este email já está cadastrado. Use outro email ou faça login.' }) 
      };
    }

    // Verificar se o telefone já existe (se fornecido e não vazio)
    if (phone && phone.trim()) {
      const { data: existingPhone, error: phoneError } = await supabase
        .from('users')
        .select('id, email, phone')
        .eq('phone', phone.trim())
        .single();

      if (phoneError && phoneError.code !== 'PGRST116') {
        console.error('Error checking phone:', phoneError);
        throw phoneError;
      }

      if (existingPhone) {
        return { 
          statusCode: 409, 
          headers, 
          body: JSON.stringify({ error: 'Este número de telefone já está cadastrado. Use outro número ou faça login.' }) 
        };
      }
    }

    // Criar novo usuário (sempre bloqueado até aprovação do admin)
    const passwordHash = `demo:${password}`;
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email,
        name: name || email.split('@')[0],
        phone: phone || '',
        password_hash: passwordHash,
        is_blocked: true,
        is_admin: false,
        diploma_image: diplomaImageBase64 || null,
        council_card_image: councilCardImageBase64 || null,
        council_number: councilNumber || null
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating user:', insertError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Erro ao cadastrar usuário. Tente novamente.' })
      };
    }

    // Armazenar documentos no Netlify Blobs e metadados
    try {
      const { getStore } = require('@netlify/blobs');
      const store = getStore({ name: 'user-docs' });
      const safeEmail = email.replace(/[^a-z0-9_.-]/gi, '_');
      const now = Date.now();
      const diplomaKey = `docs/${safeEmail}/diploma_${now}.txt`;
      const councilKey = `docs/${safeEmail}/council_${now}.txt`;
      await store.set(diplomaKey, diplomaImageBase64, { metadata: { email, type: 'diploma' } });
      await store.set(councilKey, councilCardImageBase64, { metadata: { email, type: 'council_card' } });
      const metaKey = `meta/${safeEmail}.json`;
      const meta = {
        email,
        name: name || '',
        phone: phone || '',
        councilNumber,
        diplomaKey,
        councilKey,
        uploadedAt: new Date(now).toISOString(),
        basicValidation: {
          councilNumberLength: councilNumber.length,
          diplomaOk: true,
          councilOk: true
        }
      };
      await store.set(metaKey, JSON.stringify(meta), { metadata: { email, type: 'meta' } });
    } catch (e) {
      console.error('Error saving blobs:', e);
      // Continuar, admin ainda pode ver mensagem de pendência
    }

    // Não efetuar login automático. Informar que aguarda aprovação do admin
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        pendingApproval: true,
        email: newUser.email,
        name: newUser.name || name || email.split('@')[0],
        phone: newUser.phone || phone || '',
        councilNumber,
        message: 'Cadastro recebido. Aguarde o administrador desbloquear sua conta.'
      })
    };
  } catch (e) {
    console.error('auth-register error:', e);
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
