// Helper compartilhado para funções do MercadoPago
const { getSupabaseClient } = require('./supabase-client');
const { decrypt } = require('./encryption-utils');

/**
 * Busca a conta ativa do MercadoPago e retorna o access token descriptografado
 * @returns {Promise<string|null>} - Access token ou null se não encontrar
 */
async function getActiveMercadoPagoToken() {
    try {
        const supabase = getSupabaseClient();
        
        // Buscar conta ativa
        const { data: activeAccount, error } = await supabase
            .from('mercadopago_accounts')
            .select('access_token_encrypted')
            .eq('is_active', true)
            .single();
        
        if (error || !activeAccount) {
            // Fallback para variável de ambiente se não houver conta ativa
            console.log('Nenhuma conta ativa encontrada, usando variável de ambiente');
            return process.env.MERCADOPAGO_ACCESS_TOKEN || null;
        }
        
        // Descriptografar token
        try {
            const decryptedToken = decrypt(activeAccount.access_token_encrypted);
            return decryptedToken;
        } catch (decryptError) {
            console.error('Erro ao descriptografar token:', decryptError);
            // Fallback para variável de ambiente
            return process.env.MERCADOPAGO_ACCESS_TOKEN || null;
        }
    } catch (error) {
        console.error('Erro ao buscar conta ativa:', error);
        // Fallback para variável de ambiente
        return process.env.MERCADOPAGO_ACCESS_TOKEN || null;
    }
}

module.exports = {
    getActiveMercadoPagoToken
};
