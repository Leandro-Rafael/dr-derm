const { getSupabaseClient } = require('./supabase-client');
const { getActiveMercadoPagoToken } = require('./mercadopago-helper');

// Helper para headers CORS
function getCorsHeaders(event) {
    const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
    const origin = event?.headers?.origin || event?.headers?.Origin || '';
    
    let corsOrigin = '*';
    if (allowedOrigin !== '*') {
        const allowedOrigins = allowedOrigin.split(',').map(o => o.trim());
        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            corsOrigin = origin || '*';
        }
    }
    
    return {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Credentials': 'true'
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

// Mercado Pago SDK
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

exports.handler = async (event, context) => {
    // CORS headers
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
            bodyData = JSON.parse(event.body);
        } catch (parseError) {
            console.error('Erro ao fazer parse do body:', parseError);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Dados inválidos', message: parseError.message })
            };
        }

        const { 
            items, 
            payer, 
            paymentMethodId,
            backUrls,
            autoReturn = 'approved'
        } = bodyData;

        // Validar dados obrigatórios
        if (!items || !Array.isArray(items) || items.length === 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Itens do pedido são obrigatórios' })
            };
        }

        if (!payer || !payer.email) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Dados do pagador são obrigatórios' })
            };
        }

        // Validar email básico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(payer.email)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Email inválido' })
            };
        }

        // Validar CPF se for PIX
        if (paymentMethodId === 'pix' && (!payer.identification || !payer.identification.number)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'CPF é obrigatório para pagamento PIX' })
            };
        }

        // Verificar autenticação
        const email = getEmailFromAuth(event.headers.authorization || event.headers.Authorization);
        if (!email) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Unauthorized' })
            };
        }

        // Buscar usuário no banco de dados
        const supabase = getSupabaseClient();
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id, email, name, is_blocked')
            .eq('email', email)
            .single();

        if (userError || !user) {
            console.error('Erro ao buscar usuário:', userError);
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Invalid token' })
            };
        }

        // Verificar se usuário está bloqueado
        if (user.is_blocked) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'Usuário bloqueado' })
            };
        }

        // Configurar credenciais do Mercado Pago
        const client = new MercadoPagoConfig({
            accessToken: accessToken
        });
        
        const preferenceClient = new Preference(client);

        // Calcular total
        const total = items.reduce((sum, item) => sum + (parseFloat(item.unit_price) * item.quantity), 0);

        // Criar preferência de pagamento
        const preferenceData = {
            items: items.map(item => ({
                id: String(item.id || ''),
                title: String(item.title || ''),
                description: String(item.description || item.title || ''),
                quantity: parseInt(item.quantity) || 1,
                currency_id: 'BRL',
                unit_price: parseFloat(item.unit_price) || 0
            })),
            payer: (() => {
                const payerData = {
                    name: payer.name,
                    surname: payer.surname || '',
                    email: payer.email
                };

                // Adicionar telefone apenas se existir e tiver dados válidos
                if (payer.phone && payer.phone.area_code && payer.phone.number) {
                    payerData.phone = {
                        area_code: payer.phone.area_code,
                        number: payer.phone.number
                    };
                }

                // Adicionar identificação (CPF) - obrigatório para PIX
                // SEMPRE incluir se existir, mesmo que não seja PIX
                if (payer.identification && payer.identification.number) {
                    const cpfNumber = String(payer.identification.number).replace(/\D/g, '');
                    if (cpfNumber.length === 11) {
                        payerData.identification = {
                            type: payer.identification.type || 'CPF',
                            number: cpfNumber
                        };
                    }
                }

                // Adicionar endereço apenas se existir e tiver dados válidos
                if (payer.address && payer.address.zip_code && payer.address.street_name) {
                    payerData.address = {
                        zip_code: String(payer.address.zip_code).replace(/\D/g, ''),
                        street_name: payer.address.street_name,
                        street_number: parseInt(payer.address.street_number) || 0,
                        neighborhood: payer.address.neighborhood || '',
                        city: payer.address.city || '',
                        federal_unit: payer.address.federal_unit || ''
                    };
                }

                return payerData;
            })(),
            payment_methods: {
                excluded_payment_methods: [],
                excluded_payment_types: [],
                installments: 12 // Máximo de parcelas
            },
            back_urls: backUrls || {
                success: `${process.env.SITE_URL || 'https://drdermofc.netlify.app'}/checkout.html?status=success`,
                failure: `${process.env.SITE_URL || 'https://drdermofc.netlify.app'}/checkout.html?status=failure`,
                pending: `${process.env.SITE_URL || 'https://drdermofc.netlify.app'}/checkout.html?status=pending`
            },
            auto_return: autoReturn,
            external_reference: `order_${user.id}_${Date.now()}`,
            notification_url: `${process.env.SITE_URL || 'https://drdermofc.netlify.app'}/.netlify/functions/mercado-pago-webhook`,
            statement_descriptor: 'DR DERM',
            metadata: {
                user_id: user.id,
                user_email: user.email
            }
        };

        // Se for PIX, criar pagamento direto para obter QR code
        if (paymentMethodId === 'pix') {
            try {
                const paymentClient = new Payment(client);
                
                // Calcular total (incluindo frete se necessário)
                const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.unit_price) * item.quantity), 0);
                const shipping = 15.90; // Frete fixo
                const total = subtotal + shipping;
                
                // Criar pagamento PIX direto
                const paymentData = {
                    transaction_amount: parseFloat(total.toFixed(2)),
                    description: items.map(item => `${item.title} (${item.quantity}x)`).join(', ') || 'Compra',
                    payment_method_id: 'pix',
                    payer: {
                        email: payer.email,
                        first_name: payer.name,
                        last_name: payer.surname || '',
                        identification: payer.identification ? {
                            type: payer.identification.type || 'CPF',
                            number: payer.identification.number
                        } : undefined
                    },
                    external_reference: `order_${user.id}_${Date.now()}`,
                    notification_url: `${process.env.SITE_URL || 'https://drdermofc.netlify.app'}/.netlify/functions/mercado-pago-webhook`,
                    metadata: {
                        user_id: user.id,
                        user_email: user.email
                    }
                };

                console.log('Criando pagamento PIX direto:', JSON.stringify({
                    transaction_amount: paymentData.transaction_amount,
                    payer_email: paymentData.payer.email,
                    has_identification: !!paymentData.payer.identification
                }, null, 2));

                const pixPayment = await paymentClient.create({ body: paymentData });

                if (pixPayment && pixPayment.id) {
                    // Extrair QR code do pagamento PIX
                    let qrCode = null;
                    let qrCodeBase64 = null;
                    
                    if (pixPayment.point_of_interaction && 
                        pixPayment.point_of_interaction.transaction_data) {
                        qrCode = pixPayment.point_of_interaction.transaction_data.qr_code || null;
                        qrCodeBase64 = pixPayment.point_of_interaction.transaction_data.qr_code_base64 || null;
                    }

                    if (qrCode && qrCodeBase64) {
                        return {
                            statusCode: 200,
                            headers,
                            body: JSON.stringify({
                                payment_id: pixPayment.id,
                                preference_id: null,
                                init_point: null,
                                qr_code: qrCode,
                                qr_code_base64: qrCodeBase64,
                                status: pixPayment.status,
                                status_detail: pixPayment.status_detail
                            })
                        };
                    } else {
                        // Se não tiver QR code, criar preferência como fallback
                        console.log('QR code não disponível no pagamento direto, usando preferência como fallback');
                    }
                }
            } catch (pixError) {
                console.error('Erro ao criar pagamento PIX direto:', pixError);
                // Se falhar, continuar com preferência como fallback
                console.log('Continuando com preferência como fallback');
            }

            // Fallback: criar preferência se pagamento direto falhar
            preferenceData.payment_methods.excluded_payment_types = [
                { id: 'credit_card' },
                { id: 'debit_card' },
                { id: 'ticket' },
                { id: 'bank_transfer' }
            ];
            preferenceData.payment_methods.excluded_payment_methods = [];
        }

        // Se for cartão de crédito, garantir que apenas cartão está disponível
        if (paymentMethodId === 'credit') {
            preferenceData.payment_methods.excluded_payment_types = [
                { id: 'ticket' }, // Boleto
                { id: 'atm' }, // PIX
                { id: 'bank_transfer' }
            ];
            preferenceData.payment_methods.excluded_payment_methods = [];
        }

        // Se for boleto, adicionar configurações específicas
        if (paymentMethodId === 'boleto') {
            // NOTA: account_money não pode ser excluído segundo a API do Mercado Pago
            preferenceData.payment_methods.excluded_payment_types = [
                { id: 'credit_card' },
                { id: 'debit_card' },
                { id: 'atm' }, // PIX
                { id: 'bank_transfer' }
            ];
        }

        // Log para debug detalhado
        console.log('=== DADOS DA PREFERÊNCIA ===');
        console.log('Método de pagamento:', paymentMethodId);
        console.log('Itens:', preferenceData.items.length);
        console.log('Payer - Nome:', preferenceData.payer.name);
        console.log('Payer - Email:', preferenceData.payer.email);
        console.log('Payer - Tem CPF:', !!preferenceData.payer.identification);
        console.log('Payer - CPF tipo:', preferenceData.payer.identification?.type);
        console.log('Payer - Tem endereço:', !!preferenceData.payer.address);
        console.log('Payer - Tem telefone:', !!preferenceData.payer.phone);
        console.log('Payment methods:', JSON.stringify(preferenceData.payment_methods, null, 2));

        // Criar preferência no Mercado Pago
        let response;
        try {
            console.log('Criando preferência com paymentMethodId:', paymentMethodId);
            console.log('Excluded payment types:', JSON.stringify(preferenceData.payment_methods.excluded_payment_types, null, 2));
            response = await preferenceClient.create({ body: preferenceData });
            console.log('Preferência criada com sucesso:', response.id);
            console.log('Init point:', response.init_point);
        } catch (mpError) {
            console.error('Erro ao criar preferência no Mercado Pago:', mpError);
            console.error('Detalhes do erro:', mpError.message, mpError.cause);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Erro ao criar preferência no Mercado Pago',
                    message: mpError.message || 'Erro desconhecido',
                    details: mpError.cause || null
                })
            };
        }

        // Na versão 2.x, a resposta já vem como objeto, não precisa verificar status
        if (response && response.id) {
            // Extrair QR code para PIX se disponível (só se for PIX)
            let qrCode = null;
            let qrCodeBase64 = null;
            
            // QR code só deve existir se for PIX
            if (paymentMethodId === 'pix' && response.point_of_interaction && 
                response.point_of_interaction.transaction_data) {
                qrCode = response.point_of_interaction.transaction_data.qr_code || null;
                qrCodeBase64 = response.point_of_interaction.transaction_data.qr_code_base64 || null;
            }
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    preference_id: response.id,
                    init_point: response.init_point || response.sandbox_init_point,
                    sandbox_init_point: response.sandbox_init_point || null,
                    qr_code: qrCode,
                    qr_code_base64: qrCodeBase64,
                    payment_method_id: paymentMethodId
                })
            };
        } else {
            console.error('Resposta inesperada do Mercado Pago:', response);
            console.error('Response:', JSON.stringify(response, null, 2));
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Erro ao criar preferência no Mercado Pago',
                    message: 'Resposta inválida do Mercado Pago',
                    response: response || null
                })
            };
        }

    } catch (error) {
        console.error('Erro ao processar pagamento:', error);
        console.error('Stack:', error.stack);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Erro ao processar pagamento',
                message: error.message || 'Erro desconhecido',
                details: error.stack || null
            })
        };
    }
};
