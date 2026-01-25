// Utilitários de criptografia para proteger credenciais sensíveis
const crypto = require('crypto');

// Algoritmo de criptografia
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // 16 bytes para AES
const SALT_LENGTH = 64; // 64 bytes para salt
const TAG_LENGTH = 16; // 16 bytes para GCM tag
const KEY_LENGTH = 32; // 32 bytes para AES-256

/**
 * Obtém a chave de criptografia a partir da variável de ambiente
 * Se não existir, gera uma chave derivada de uma string padrão (não recomendado para produção)
 */
function getEncryptionKey() {
  const envKey = process.env.ENCRYPTION_KEY;
  
  if (!envKey) {
    console.warn('ENCRYPTION_KEY não configurada. Usando chave padrão (não seguro para produção).');
    // Em produção, sempre deve ter ENCRYPTION_KEY configurada
    // Para desenvolvimento, usamos uma chave derivada
    return crypto.pbkdf2Sync('drderm-default-key-change-in-production', 'salt', 100000, KEY_LENGTH, 'sha256');
  }
  
  // Se a chave for uma string, derivamos uma chave de 32 bytes
  if (envKey.length < KEY_LENGTH) {
    return crypto.pbkdf2Sync(envKey, 'drderm-salt', 100000, KEY_LENGTH, 'sha256');
  }
  
  // Se já for uma chave hex de 64 caracteres (32 bytes), convertemos
  if (envKey.length === 64) {
    return Buffer.from(envKey, 'hex');
  }
  
  // Caso contrário, derivamos da string
  return crypto.pbkdf2Sync(envKey, 'drderm-salt', 100000, KEY_LENGTH, 'sha256');
}

/**
 * Criptografa um texto usando AES-256-GCM
 * @param {string} text - Texto a ser criptografado
 * @returns {string} - String no formato: iv:tag:encrypted (todos em base64)
 */
function encrypt(text) {
  if (!text) {
    return null;
  }

  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    const tag = cipher.getAuthTag();
    
    // Retornar no formato: iv:tag:encrypted (todos em base64)
    return `${iv.toString('base64')}:${tag.toString('base64')}:${encrypted}`;
  } catch (error) {
    console.error('Erro ao criptografar:', error);
    throw new Error('Falha ao criptografar dados');
  }
}

/**
 * Descriptografa um texto criptografado
 * @param {string} encryptedData - String no formato: iv:tag:encrypted (todos em base64)
 * @returns {string} - Texto descriptografado
 */
function decrypt(encryptedData) {
  if (!encryptedData) {
    return null;
  }

  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Formato de dados criptografados inválido');
    }

    const [ivBase64, tagBase64, encrypted] = parts;
    const iv = Buffer.from(ivBase64, 'base64');
    const tag = Buffer.from(tagBase64, 'base64');
    const key = getEncryptionKey();

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Erro ao descriptografar:', error);
    throw new Error('Falha ao descriptografar dados');
  }
}

/**
 * Valida se uma string está criptografada no formato esperado
 * @param {string} data - String a ser validada
 * @returns {boolean} - True se está no formato correto
 */
function isEncrypted(data) {
  if (!data || typeof data !== 'string') {
    return false;
  }
  
  const parts = data.split(':');
  return parts.length === 3;
}

module.exports = {
  encrypt,
  decrypt,
  isEncrypted,
  getEncryptionKey
};
