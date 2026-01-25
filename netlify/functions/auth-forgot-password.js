const { getSupabaseClient } = require('./supabase-client');

// Função para validar email
function isValidEmail(email) {
    // Permitir email administrativo especial sem TLD
    if ((email || '').toLowerCase() === 'drderm.adm@ofc') return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função para extrair senha do hash
function extractPasswordFromHash(passwordHash) {
    if (!passwordHash) return null;
    // O formato é "demo:senha" ou "admin:senha"
    const parts = passwordHash.split(':');
    if (parts.length >= 2) {
        return parts.slice(1).join(':'); // Pega tudo após o primeiro ":"
    }
    return null;
}

// Função para enviar email usando Resend (recomendado pelo Supabase)
async function sendPasswordEmail(email, password, userName) {
    const resendApiKey = process.env.RESEND_API_KEY;
    const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@drderm.com'; // Configure este email no Resend
    
    // Se não tiver a API key configurada, retornar erro em produção
    if (!resendApiKey) {
        if (process.env.NODE_ENV === 'development') {
            console.log('RESEND_API_KEY não configurada. Configure RESEND_API_KEY e RESEND_FROM_EMAIL nas variáveis de ambiente do Netlify.');
        }
        throw new Error('Serviço de email não configurado. Entre em contato com o suporte.');
    }
    
    try {
        // Template HTML do email
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperação de Senha - DrDerm</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #395f69 0%, #1e2723 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">DrDerm</h1>
    </div>
    <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
        <h2 style="color: #395f69; margin-top: 0;">Recuperação de Senha</h2>
        <p>Olá <strong>${userName || 'Usuário'}</strong>,</p>
        <p>Você solicitou a recuperação de sua senha na plataforma DrDerm.</p>
        <div style="background: white; border-left: 4px solid #395f69; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">Sua senha:</p>
            <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: bold; color: #1e2723; font-family: monospace;">${password}</p>
        </div>
        <p style="color: #dc2626; font-size: 14px; background: #fee2e2; padding: 12px; border-radius: 6px; border-left: 4px solid #dc2626;">
            <strong>⚠️ Importante:</strong> Por segurança, recomendamos que você altere sua senha após fazer login.
        </p>
        <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            Se você não solicitou esta recuperação de senha, ignore este email.
        </p>
        <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            Atenciosamente,<br>
            <strong>Equipe DrDerm</strong>
        </p>
    </div>
    <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
        <p>Este é um email automático, por favor não responda.</p>
    </div>
</body>
</html>
        `;
        
        // Versão texto simples do email
        const textContent = `
Recuperação de Senha - DrDerm

Olá ${userName || 'Usuário'},

Você solicitou a recuperação de sua senha na plataforma DrDerm.

Sua senha: ${password}

⚠️ IMPORTANTE: Por segurança, recomendamos que você altere sua senha após fazer login.

Se você não solicitou esta recuperação de senha, ignore este email.

Atenciosamente,
Equipe DrDerm

---
Este é um email automático, por favor não responda.
        `.trim();
        
        // Enviar email usando Resend API
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${resendApiKey}`
            },
            body: JSON.stringify({
                from: resendFromEmail,
                to: email,
                subject: 'Recuperação de Senha - DrDerm',
                html: htmlContent,
                text: textContent
            })
        });
        
        if (!response.ok) {
            // Log apenas em desenvolvimento - não expor detalhes em produção
            if (process.env.NODE_ENV === 'development') {
                const errorData = await response.json().catch(() => ({}));
                console.error('Erro ao enviar email via Resend:', errorData);
            }
            throw new Error(`Erro ao enviar email: ${response.status}`);
        }
        
        // Verificar resposta (não logar em produção)
        await response.json().catch(() => null);
        
        return true;
        
    } catch (error) {
        // Log apenas em desenvolvimento - NUNCA logar senhas
        if (process.env.NODE_ENV === 'development') {
            console.error('Erro ao enviar email:', error.message);
        }
        throw error;
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
        return { 
            statusCode: 405, 
            headers, 
            body: JSON.stringify({ error: 'Method not allowed' }) 
        };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const email = (body.email || '').toLowerCase().trim();

        // Log apenas em desenvolvimento
        if (process.env.NODE_ENV === 'development') {
            console.log('Recuperação de senha solicitada para:', email);
        }

        if (!email) {
            return { 
                statusCode: 400, 
                headers, 
                body: JSON.stringify({ error: 'Email é obrigatório' }) 
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

        const supabase = getSupabaseClient();

        // Buscar usuário no banco
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id, email, name, password_hash, is_blocked')
            .eq('email', email)
            .single();

        if (userError && userError.code !== 'PGRST116') { // PGRST116 = no rows returned
            if (process.env.NODE_ENV === 'development') {
                console.error('Erro ao buscar usuário:', userError);
            }
            throw userError;
        }

        if (!user) {
            // Por segurança, não revelamos se o email existe ou não
            return { 
                statusCode: 200, 
                headers, 
                body: JSON.stringify({ 
                    message: 'Se o email estiver cadastrado, você receberá um email com sua senha em breve.' 
                }) 
            };
        }

        // Extrair senha do hash
        const password = extractPasswordFromHash(user.password_hash);
        
        if (!password) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Erro: Não foi possível extrair a senha do hash');
            }
            return { 
                statusCode: 500, 
                headers, 
                body: JSON.stringify({ error: 'Erro ao recuperar senha. Entre em contato com o suporte.' }) 
            };
        }

        // Enviar email com a senha
        try {
            await sendPasswordEmail(email, password, user.name);
            
            return { 
                statusCode: 200, 
                headers, 
                body: JSON.stringify({ 
                    message: 'Email enviado com sucesso! Verifique sua caixa de entrada (e a pasta de spam).' 
                }) 
            };
        } catch (emailError) {
            // Log apenas em desenvolvimento - NUNCA logar senhas
            if (process.env.NODE_ENV === 'development') {
                console.error('Erro ao enviar email:', emailError.message);
            }
            // Mesmo se o email falhar, retornamos sucesso por segurança
            // (não queremos revelar se o email existe ou não)
            return { 
                statusCode: 200, 
                headers, 
                body: JSON.stringify({ 
                    message: 'Se o email estiver cadastrado, você receberá um email com sua senha em breve.' 
                }) 
            };
        }

    } catch (e) {
        // Log apenas em desenvolvimento
        if (process.env.NODE_ENV === 'development') {
            console.error('auth-forgot-password error:', e);
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

