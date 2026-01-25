const { getCorsHeaders } = require('./cors-headers');

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

    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Verificar se a Public Key está configurada
        const publicKey = process.env.MERCADOPAGO_PUBLIC_KEY;
        
        if (!publicKey) {
            console.error('MERCADOPAGO_PUBLIC_KEY não configurado');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Configuração do Mercado Pago não encontrada',
                    message: 'Public Key do Mercado Pago não está configurada. Verifique as variáveis de ambiente no Netlify.'
                })
            };
        }

        // Retornar a Public Key
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                publicKey: publicKey
            })
        };

    } catch (error) {
        console.error('Erro ao obter Public Key:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Erro interno do servidor',
                message: error.message || 'Erro ao processar requisição'
            })
        };
    }
};


