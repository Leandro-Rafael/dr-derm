/**
 * Sistema de Criptografia para Dados Sensíveis
 * Protege dados armazenados no localStorage e sessionStorage
 */

(function() {
    'use strict';

    // Chave de criptografia (gerada dinamicamente baseada no domínio)
    function getEncryptionKey() {
        const domain = window.location.hostname;
        const baseKey = 'DrDerm2024Secure' + domain;
        let hash = 0;
        for (let i = 0; i < baseKey.length; i++) {
            const char = baseKey.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return String(Math.abs(hash)).padStart(16, '0');
    }

    // Função de criptografia simples mas eficaz (XOR + Base64)
    function encrypt(data) {
        if (!data || typeof data !== 'string') return '';
        
        try {
            const key = getEncryptionKey();
            let encrypted = '';
            
            for (let i = 0; i < data.length; i++) {
                const keyChar = key[i % key.length];
                const encryptedChar = String.fromCharCode(
                    data.charCodeAt(i) ^ keyChar.charCodeAt(0)
                );
                encrypted += encryptedChar;
            }
            
            // Codificar em Base64
            return btoa(encrypted).replace(/[+/=]/g, function(match) {
                return {'+': '-', '/': '_', '=': ''}[match];
            });
        } catch (e) {
            return '';
        }
    }

    // Função de descriptografia
    function decrypt(encryptedData) {
        if (!encryptedData || typeof encryptedData !== 'string') return '';
        
        try {
            // Decodificar Base64
            const base64 = encryptedData.replace(/[-_]/g, function(match) {
                return {'-': '+', '_': '/'}[match];
            });
            
            let data = '';
            try {
                data = atob(base64);
            } catch (e) {
                return '';
            }
            
            const key = getEncryptionKey();
            let decrypted = '';
            
            for (let i = 0; i < data.length; i++) {
                const keyChar = key[i % key.length];
                const decryptedChar = String.fromCharCode(
                    data.charCodeAt(i) ^ keyChar.charCodeAt(0)
                );
                decrypted += decryptedChar;
            }
            
            return decrypted;
        } catch (e) {
            return '';
        }
    }

    // Wrapper seguro para localStorage
    const SecureStorage = {
        setItem: function(key, value) {
            try {
                const encrypted = encrypt(String(value));
                const prefix = '__enc__';
                localStorage.setItem(prefix + key, encrypted);
            } catch (e) {
                // Fallback silencioso
                try {
                    localStorage.setItem(key, value);
                } catch (e2) {}
            }
        },
        
        getItem: function(key) {
            try {
                const prefix = '__enc__';
                const encrypted = localStorage.getItem(prefix + key);
                
                if (encrypted) {
                    return decrypt(encrypted);
                }
                
                // Fallback para dados não criptografados (compatibilidade)
                return localStorage.getItem(key);
            } catch (e) {
                try {
                    return localStorage.getItem(key);
                } catch (e2) {
                    return null;
                }
            }
        },
        
        removeItem: function(key) {
            try {
                const prefix = '__enc__';
                localStorage.removeItem(prefix + key);
                localStorage.removeItem(key); // Remove versão não criptografada se existir
            } catch (e) {}
        },
        
        clear: function() {
            try {
                const keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key.startsWith('__enc__')) {
                        localStorage.removeItem(key);
                    }
                });
                localStorage.clear();
            } catch (e) {}
        }
    };

    // Migrar dados existentes para formato criptografado (otimizado - adiar execução)
    function migrateExistingData() {
        try {
            const sensitiveKeys = ['authToken', 'userEmail', 'userName', 'userLoggedIn', 'isAdmin'];
            sensitiveKeys.forEach(key => {
                const value = localStorage.getItem(key);
                if (value && !value.startsWith('__enc__')) {
                    SecureStorage.setItem(key, value);
                }
            });
        } catch (e) {}
    }

    // Substituir localStorage global por versão segura
    if (typeof window !== 'undefined') {
        // Expor API segura imediatamente
        window.SecureStorage = SecureStorage;
        window.encryptData = encrypt;
        window.decryptData = decrypt;
        
        // Interceptar chamadas diretas ao localStorage para dados sensíveis
        const originalSetItem = localStorage.setItem;
        const sensitiveKeys = ['authToken', 'userEmail', 'userName', 'userLoggedIn', 'isAdmin', 'cart', 'favorites'];
        
        // Cache de verificação para melhor performance
        const sensitiveKeysLower = sensitiveKeys.map(k => k.toLowerCase());
        const isSensitiveKey = function(key) {
            const keyLower = key.toLowerCase();
            return sensitiveKeysLower.some(sk => keyLower.includes(sk));
        };
        
        localStorage.setItem = function(key, value) {
            if (isSensitiveKey(key)) {
                SecureStorage.setItem(key, value);
            } else {
                originalSetItem.call(localStorage, key, value);
            }
        };
        
        const originalGetItem = localStorage.getItem;
        localStorage.getItem = function(key) {
            if (isSensitiveKey(key)) {
                return SecureStorage.getItem(key);
            } else {
                return originalGetItem.call(localStorage, key);
            }
        };
        
        // Migrar dados existentes após carregamento (não bloqueia)
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(migrateExistingData, 2000);
            });
        } else {
            setTimeout(migrateExistingData, 2000);
        }
    }
})();

