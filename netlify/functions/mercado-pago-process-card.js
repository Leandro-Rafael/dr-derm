const { getSupabaseClient } = require('./supabase-client');
const { getCorsHeaders } = require('./cors-headers');
const { getActiveMercadoPagoToken } = require('./mercadopago-helper');

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

// Mercado Pago SDK
const { MercadoPagoConfig, Payment } = require('mercadopago');

exports.handler = async (event, context) => {
    const headers = getCorsHeaders(event);

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Verificar autenticação
        const authHeader = event.headers?.authorization || event.headers?.Authorization;
        const userEmail = getEmailFromAuth(authHeader);

        if (!userEmail) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Não autorizado', message: 'Token de autenticação inválido ou ausente' })
            };
        }

        // Buscar token da conta ativa ou usar variável de ambiente como fallback
        const accessToken = await getActiveMercadoPagoToken();
        
        if (!accessToken) {
            console.error('Token do Mercado Pago não encontrado');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Configuração do Mercado Pago não encontrada',
                    message: 'Token de acesso do Mercado Pago não está configurado. Configure uma conta ativa no painel administrativo ou defina a variável de ambiente MERCADOPAGO_ACCESS_TOKEN.'
                })
            };
        }

        let bodyData;
        try {
            bodyData = JSON.parse(event.body || '{}');
        } catch (parseError) {
            console.error('Erro ao fazer parse do body:', parseError);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Dados inválidos', message: parseError.message })
            };
        }

        const {
            token,
            issuer_id,
            payment_method_id = 'credit_card',
            transaction_amount,
            installments = 1,
            description = 'Compra DrDerm',
            payer
        } = bodyData;

        // Validações
        if (!token) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Token do cartão é obrigatório' })
            };
        }

        if (!transaction_amount || transaction_amount <= 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Valor da transação inválido' })
            };
        }

        if (!payer || !payer.email) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Dados do pagador são obrigatórios' })
            };
        }

        if (!payer.identification || !payer.identification.number) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'CPF/CNPJ do pagador é obrigatório' })
            };
        }

        // Configurar Mercado Pago
        const client = new MercadoPagoConfig({ 
            accessToken: accessToken,
            options: { timeout: 5000 }
        });
        const payment = new Payment(client);

        // Criar pagamento
        const paymentData = {
            transaction_amount: parseFloat(transaction_amount),
            token: token,
            description: description,
            installments: parseInt(installments) || 1,
            payment_method_id: payment_method_id,
            issuer_id: issuer_id || undefined,
            payer: {
                email: payer.email.toLowerCase().trim(),
                identification: {
                    type: payer.identification.type || 'CPF',
                    number: String(payer.identification.number).replace(/\D/g, '')
                }
            }
        };

        console.log('Processando pagamento:', {
            amount: paymentData.transaction_amount,
            installments: paymentData.installments,
            payment_method: paymentData.payment_method_id,
            payer_email: paymentData.payer.email
        });

        const { data: paymentResult, error: paymentError } = await payment.create({ body: paymentData });

        if (paymentError) {
            console.error('Erro ao processar pagamento:', paymentError);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Erro ao processar pagamento',
                    message: paymentError.message || 'Não foi possível processar o pagamento',
                    details: process.env.NODE_ENV === 'development' ? paymentError : undefined
                })
            };
        }

        // Salvar informações do pagamento no banco (opcional)
        try {
            const supabase = getSupabaseClient();
            // Aqui você pode salvar o pagamento na tabela de pedidos/pagamentos
            // Por enquanto, apenas logamos
            console.log('Pagamento processado:', {
                id: paymentResult.id,
                status: paymentResult.status,
                status_detail: paymentResult.status_detail
            });
        } catch (dbError) {
            console.error('Erro ao salvar pagamento no banco:', dbError);
            // Não falhar o pagamento por causa disso
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                id: paymentResult.id,
                status: paymentResult.status,
                status_detail: paymentResult.status_detail,
                transaction_amount: paymentResult.transaction_amount,
                installments: paymentResult.installments,
                payment_method_id: paymentResult.payment_method_id,
                date_created: paymentResult.date_created
            })
        };

    } catch (error) {
        console.error('Erro ao processar pagamento com cartão:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Erro interno do servidor',
                message: error.message || 'Erro ao processar pagamento. Tente novamente mais tarde.'
            })
        };
    }
};


