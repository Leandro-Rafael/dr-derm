// Helper para criar cliente Supabase
const { createClient } = require('@supabase/supabase-js');

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL e Key não configuradas. Configure as variáveis de ambiente SUPABASE_URL e SUPABASE_ANON_KEY no Netlify.');
  }

  return createClient(supabaseUrl, supabaseKey);
}

module.exports = { getSupabaseClient };

