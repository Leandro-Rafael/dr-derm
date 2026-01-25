/**
 * Sistema de Proteção contra Inspeção de Código
 * Dificulta visualização e manipulação do código-fonte
 */

(function() {
    'use strict';

    // Verificar se está em desenvolvimento
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // Desabilitar console em produção (versão segura que não quebra código)
    if (!isDev) {
        try {
            const noop = function() {};
            // Apenas silenciar, não remover completamente
            if (console && typeof console.log === 'function') {
                console.log = noop;
            }
        } catch(e) {
            // Ignorar erros silenciosamente
        }
    }

    // Detectar DevTools básico (otimizado - verificação menos frequente)
    let devtools = {open: false};
    
    // Só inicializar detecção de DevTools em produção e após DOM estar pronto
    if (!isDev) {
        // Adiar inicialização para não bloquear carregamento
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(initDevToolsDetection, 2000);
            });
        } else {
            setTimeout(initDevToolsDetection, 2000);
        }
    }
    
    function initDevToolsDetection() {
        if (isDev) return;
        
        try {
            const element = new Image();
            Object.defineProperty(element, 'id', {
                get: function() {
                    devtools.open = true;
                }
            });
            
            // Verificação muito menos frequente e mais segura (a cada 10 segundos)
            let intervalId = setInterval(function() {
                try {
                    if (isDev) {
                        clearInterval(intervalId);
                        return;
                    }
                    devtools.open = false;
                    // Acessar propriedade de forma segura
                    const test = element.id;
                    if (devtools.open && document.body) {
                        document.body.style.opacity = '0.99';
                    } else if (document.body) {
                        document.body.style.opacity = '1';
                    }
                } catch(e) {
                    // Se houver erro, parar a verificação
                    clearInterval(intervalId);
                }
            }, 10000); // Aumentado para 10 segundos para reduzir carga
        } catch(e) {
            // Se falhar na inicialização, não fazer nada
        }
    }

    // Desabilitar botão direito do mouse (básico) - apenas em produção
    if (!isDev) {
        // Adiar para não bloquear carregamento inicial
        setTimeout(function() {
            document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            }, false);
        }, 1000);
    }

    // Dificultar seleção de texto - removido para melhorar performance
    // A seleção de texto não afeta segurança crítica

    // Desabilitar atalhos de teclado - apenas em produção e após carregamento
    if (!isDev) {
        setTimeout(function() {
            document.addEventListener('keydown', function(e) {
                // F12
                if (e.keyCode === 123) {
                    e.preventDefault();
                    return false;
                }
                
                // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
                if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
                    e.preventDefault();
                    return false;
                }
                
                // Ctrl+U (view source)
                if (e.ctrlKey && e.keyCode === 85) {
                    e.preventDefault();
                    return false;
                }
            }, false);
        }, 1000);
    }

    // Proteger contra cópia de grandes blocos - apenas em produção e após carregamento
    if (!isDev) {
        setTimeout(function() {
            document.addEventListener('copy', function(e) {
                const activeElement = document.activeElement;
                if (activeElement && 
                    (activeElement.tagName === 'INPUT' || 
                     activeElement.tagName === 'TEXTAREA' || 
                     activeElement.isContentEditable)) {
                    return true;
                }
                
                const selection = window.getSelection().toString();
                if (selection.length > 500 && /[{}();=]/.test(selection)) {
                    e.clipboardData.setData('text/plain', 'Conteúdo protegido');
                    e.preventDefault();
                    return false;
                }
                return true;
            }, false);
        }, 2000);
    }

    // Ofuscar código JavaScript carregado dinamicamente - apenas em produção
    if (!isDev) {
        const originalAppendChild = Node.prototype.appendChild;
        Node.prototype.appendChild = function(child) {
            if (child && child.tagName === 'SCRIPT' && child.src) {
                child.setAttribute('crossorigin', 'anonymous');
            }
            return originalAppendChild.call(this, child);
        };
    }

    // Proteger contra iframe embedding
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }

    // Adicionar marca d'água invisível - apenas após DOM estar pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addWatermark);
    } else {
        setTimeout(addWatermark, 1000);
    }
    
    function addWatermark() {
        if (document.body) {
            const watermark = document.createElement('div');
            watermark.style.cssText = 'position:fixed;bottom:0;right:0;opacity:0.01;pointer-events:none;font-size:1px;color:transparent;';
            watermark.textContent = 'DrDerm-' + Date.now();
            document.body.appendChild(watermark);
        }
    }

    // Expor API limitada
    if (typeof window !== 'undefined') {
        window.__codeProtection = {
            enabled: !isDev
        };
    }
})();

