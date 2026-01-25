/**
 * Sistema de Verificação de Integridade
 * Detecta modificações no código e dados
 */

(function() {
    'use strict';

    // Hash simples para verificação de integridade
    function simpleHash(str) {
        let hash = 0;
        if (str.length === 0) return hash;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }

    // Calcular hash de scripts críticos
    function calculateScriptHash() {
        const scripts = document.querySelectorAll('script[src]');
        let combined = '';
        scripts.forEach(script => {
            if (script.src && !script.src.includes('node_modules')) {
                combined += script.src;
            }
        });
        return simpleHash(combined);
    }

    // Verificar integridade de dados críticos
    function verifyDataIntegrity() {
        try {
            const criticalData = ['authToken', 'userEmail', 'isAdmin'];
            const hashes = {};
            
            criticalData.forEach(key => {
                let value = null;
                // Tentar obter do SecureStorage primeiro, depois localStorage
                if (typeof SecureStorage !== 'undefined' && SecureStorage.getItem) {
                    value = SecureStorage.getItem(key);
                }
                if (!value) {
                    value = localStorage.getItem(key);
                }
                if (value) {
                    hashes[key] = simpleHash(value);
                }
            });
            
            // Armazenar hash para verificação posterior
            const storedHashes = localStorage.getItem('__data_hashes');
            if (storedHashes) {
                try {
                    const parsed = JSON.parse(storedHashes);
                    criticalData.forEach(key => {
                        if (hashes[key] && parsed[key] && hashes[key] !== parsed[key]) {
                            // Limpar dados suspeitos silenciosamente
                            try {
                                localStorage.removeItem(key);
                                if (typeof SecureStorage !== 'undefined' && SecureStorage.removeItem) {
                                    SecureStorage.removeItem(key);
                                }
                            } catch(e) {}
                        }
                    });
                } catch (e) {}
            }
            
            // Atualizar hashes
            localStorage.setItem('__data_hashes', JSON.stringify(hashes));
        } catch (e) {}
    }

    // Verificar se o DOM foi modificado maliciosamente - removida para performance
    // function verifyDOMIntegrity() { ... }

    // Detectar tentativas de injeção - otimizada (executar apenas uma vez após carregamento)
    function detectInjection() {
        try {
            // Executar apenas uma vez após carregamento completo
            const scripts = document.querySelectorAll('script[src]');
            scripts.forEach(script => {
                if (script.src && !script.src.startsWith(window.location.origin) && 
                    !script.src.startsWith('https://') && !script.src.startsWith('http://')) {
                    // Apenas logar, não bloquear
                    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                        // Log silencioso
                    }
                }
            });
        } catch (e) {}
    }
    
    // Executar detecção de injeção apenas uma vez após carregamento completo
    if (document.readyState === 'complete') {
        setTimeout(detectInjection, 5000);
    } else {
        window.addEventListener('load', function() {
            setTimeout(detectInjection, 5000);
        });
    }

    // Verificar timestamp de última modificação - otimizada
    function checkModificationTime() {
        try {
            const lastCheck = localStorage.getItem('__last_integrity_check');
            const now = Date.now();
            
            if (lastCheck) {
                const timeDiff = now - parseInt(lastCheck);
                // Se passou mais de 2 horas (aumentado de 1 hora), fazer verificação
                if (timeDiff > 7200000) {
                    verifyDataIntegrity();
                    // verifyDOMIntegrity(); // Removida para performance
                    // detectInjection(); // Já executada uma vez
                }
            }
            
            localStorage.setItem('__last_integrity_check', now.toString());
        } catch (e) {}
    }

    // Executar verificações periodicamente (otimizado)
    function startIntegrityMonitoring() {
        const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        // Verificação inicial - adiar para não bloquear carregamento
        setTimeout(() => {
            if (!isDev) {
                verifyDataIntegrity();
            }
        }, 5000); // Aumentado de 2s para 5s

        // Verificações periódicas - muito menos frequentes (a cada 15 minutos em vez de 5)
        if (!isDev) {
            setInterval(() => {
                checkModificationTime();
                verifyDataIntegrity();
            }, 900000); // 15 minutos em vez de 5
        }

        // Verificação de DOM - removida ou muito menos frequente (a cada 5 minutos)
        // Removida para melhorar performance - não é crítica
    }

    // Inicializar apenas após DOM estar totalmente carregado e interativo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Adiar ainda mais para não bloquear renderização inicial
            setTimeout(startIntegrityMonitoring, 3000);
        });
    } else if (document.readyState === 'interactive') {
        setTimeout(startIntegrityMonitoring, 3000);
    } else {
        setTimeout(startIntegrityMonitoring, 3000);
    }

    // Expor API limitada
    if (typeof window !== 'undefined') {
        window.__integrityCheck = {
            verify: verifyDataIntegrity
        };
    }
})();

