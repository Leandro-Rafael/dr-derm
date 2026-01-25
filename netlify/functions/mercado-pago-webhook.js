const { createClient } = require('@supabase/supabase-js');
const { getActiveMercadoPagoToken } = require('./mercadopago-helper');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
    // Verificar método
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const data = JSON.parse(event.body);
        const { type, data: paymentData } = data;

        // Processar apenas notificações de pagamento
        if (type === 'payment') {
            const paymentId = paymentData.id;

            // Buscar token da conta ativa
            const accessToken = await getActiveMercadoPagoToken();
            
            if (!accessToken) {
                console.error('Token do Mercado Pago não encontrado para processar webhook');
                return {
                    statusCode: 500,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Configuração do Mercado Pago não encontrada' })
                };
            }

            // Buscar informações do pagamento no Mercado Pago
            const mercadopago = require('mercadopago');
            mercadopago.configure({
                access_token: accessToken
            });

            const payment = await mercadopago.payment.findById(paymentId);
            
            if (payment.status === 200) {
                const paymentInfo = payment.response;
                const externalReference = paymentInfo.external_reference;
                const status = paymentInfo.status; // approved, pending, rejected, cancelled, refunded, charged_back

                // Extrair informações do pedido do external_reference
                const orderMatch = externalReference.match(/order_(\w+)_(\d+)/);
                if (orderMatch) {
                    const userId = orderMatch[1];
                    const timestamp = orderMatch[2];

                    // Atualizar pedido no banco de dados
                    // Aqui você pode salvar no Supabase ou em outro banco
                    const orderData = {
                        payment_id: paymentId,
                        status: status,
                        payment_method: paymentInfo.payment_method_id,
                        payment_type: paymentInfo.payment_type_id,
                        transaction_amount: paymentInfo.transaction_amount,
                        currency: paymentInfo.currency_id,
                        date_approved: paymentInfo.date_approved,
                        date_created: paymentInfo.date_created,
                        updated_at: new Date().toISOString()
                    };

                    // Salvar no Supabase (você precisará criar uma tabela 'orders' ou 'payments')
                    // Por enquanto, vamos apenas logar
                    console.log('Payment notification received:', {
                        payment_id: paymentId,
                        status: status,
                        user_id: userId,
                        order_data: orderData
                    });

                    // TODO: Salvar no Supabase quando a tabela estiver criada
                    // const { error } = await supabase
                    //     .from('orders')
                    //     .upsert({
                    //         external_reference: externalReference,
                    //         user_id: userId,
                    //         ...orderData
                    //     });
                }
            }
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ received: true })
        };

    } catch (error) {
        console.error('Erro ao processar webhook:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                error: 'Erro ao processar webhook',
                message: error.message 
            })
        };
    }
};


