const { getStore } = require('@netlify/blobs');
const { getSupabaseClient } = require('./supabase-client');

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

exports.handler = async function (event) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // Verificar admin
  const email = getEmailFromAuth(event.headers.authorization || event.headers.Authorization);
  if (!email || email !== 'drderm.adm@ofc') {
    return { statusCode: 403, headers, body: JSON.stringify({ error: 'Acesso negado' }) };
  }

  try {
    const supabase = getSupabaseClient();
    const { data: users } = await supabase
      .from('users')
      .select('id, email, name, phone, is_blocked')
      .order('created_at', { ascending: false });

    const store = getStore({ name: 'user-docs' });

    const results = [];
    for (const user of users || []) {
      const safeEmail = (user.email || '').replace(/[^a-z0-9_.-]/gi, '_');
      const metaKey = `meta/${safeEmail}.json`;
      let meta = null;
      try {
        const metaStr = await store.get(metaKey, { type: 'text' });
        if (metaStr) meta = JSON.parse(metaStr);
      } catch (_) {}
      results.push({
        id: user.id,
        email: user.email,
        name: user.name || '',
        phone: user.phone || '',
        isBlocked: !!user.is_blocked,
        councilNumber: meta?.councilNumber || '',
        diplomaKey: meta?.diplomaKey || '',
        councilKey: meta?.councilKey || '',
        uploadedAt: meta?.uploadedAt || '',
        basicValidation: meta?.basicValidation || null
      });
    }

    return { statusCode: 200, headers, body: JSON.stringify({ docs: results }) };
  } catch (e) {
    console.error('admin-docs error:', e);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Erro no servidor', details: e.message }) };
  }
}


