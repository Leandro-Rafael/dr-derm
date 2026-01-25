// Helper para headers CORS configuráveis
// Permite configurar domínios permitidos via variável de ambiente
function getCorsHeaders(event) {
  // Obter domínio permitido da variável de ambiente ou usar wildcard como fallback
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
  
  // Se estiver em desenvolvimento, permitir localhost
  const isDevelopment = process.env.NODE_ENV === 'development';
  const origin = event.headers?.origin || event.headers?.Origin || '';
  
  // Em produção, verificar se o origin está na lista permitida
  let corsOrigin = '*';
  if (allowedOrigin !== '*') {
    const allowedOrigins = allowedOrigin.split(',').map(o => o.trim());
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      corsOrigin = origin || '*';
    } else if (isDevelopment && origin.includes('localhost')) {
      corsOrigin = origin;
    }
  } else if (isDevelopment && origin.includes('localhost')) {
    corsOrigin = origin;
  }
  
  // Headers de segurança
  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  };

  // CSP básico (pode ser ajustado conforme necessário)
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.mercadopago.com https://sdk.mercadopago.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.mercadopago.com https://www.mercadopago.com https://api.mercadolibre.com",
    "frame-src https://www.mercadopago.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');

  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    ...securityHeaders,
    'Content-Security-Policy': csp
  };
}

module.exports = { getCorsHeaders };





