// Script para carregar o header e menu hamburger dinamicamente em todas as páginas
(async function() {
    // Função para determinar qual página está ativa
    function getCurrentPage() {
        // Obtém o caminho atual
        let filename = '';
        
        // Tenta obter do pathname
        if (window.location.pathname) {
            const pathParts = window.location.pathname.split('/').filter(p => p);
            filename = pathParts[pathParts.length - 1] || '';
        }
        
        // Se não encontrou, tenta do href completo
        if (!filename || filename === '') {
            const href = window.location.href;
            const match = href.match(/\/([^\/?#]+\.html)/);
            if (match) {
                filename = match[1];
            } else {
                // Tenta sem .html (pode ser index ou outra página)
                const pathParts = window.location.pathname.split('/').filter(p => p);
                if (pathParts.length > 0 && pathParts[pathParts.length - 1]) {
                    filename = pathParts[pathParts.length - 1] + '.html';
                }
            }
        }
        
        // Normaliza: remove query strings e hash, converte para lowercase
        filename = filename.split('?')[0].split('#')[0].toLowerCase();
        
        console.log('Detectando página ativa. Filename:', filename, 'Pathname:', window.location.pathname);
        
        // Verifica cada página
        if (!filename || filename === '' || filename === 'index.html' || filename === '/' || filename === 'index') {
            return 'inicio';
        }
        if (filename === 'produtos.html' || filename === 'produtos') {
            return 'produtos';
        }
        if (filename === 'carrinho.html' || filename === 'carrinho') {
            return 'carrinho';
        }
        if (filename === 'pedidos.html' || filename === 'pedidos') {
            return 'pedidos';
        }
        if (filename === 'favoritos.html' || filename === 'favoritos') {
            return 'favoritos';
        }
        if (filename === 'perfil.html' || filename === 'perfil') {
            return 'perfil';
        }
        if (filename === 'produto.html' || filename === 'produto') {
            return 'produtos';
        }
        
        return 'inicio';
    }

    // Função para marcar página ativa no menu
    function markActivePage() {
        const currentPage = getCurrentPage();
        console.log('Marcando página ativa como:', currentPage);
        
        const navItems = document.querySelectorAll('.mobile-nav-menu .nav-item');
        if (navItems.length === 0) {
            console.log('Menu items não encontrados ainda, tentando novamente...');
            return false;
        }
        
        navItems.forEach(item => {
            item.classList.remove('active');
            const pageAttr = item.getAttribute('data-page') || item.dataset.page;
            console.log('Comparando:', pageAttr, 'com', currentPage);
            if (pageAttr === currentPage) {
                item.classList.add('active');
                console.log('✓ Página marcada como ativa:', item.textContent.trim());
            }
        });
        return true;
    }

    // Carregar header
    try {
        const headerResponse = await fetch('header.html');
        if (headerResponse.ok) {
            const headerHTML = await headerResponse.text();
            
            // Remover qualquer barra de pesquisa mobile duplicada antes de inserir o header
            const existingMobileSearch = document.querySelectorAll('.mobile-search-container');
            existingMobileSearch.forEach(el => el.remove());
            
            // Procurar por header existente e substituir
            const existingHeader = document.querySelector('header.header');
            const headerPlaceholder = document.getElementById('header-placeholder');
            
            if (existingHeader) {
                // Substituir header existente
                existingHeader.outerHTML = headerHTML;
            } else if (headerPlaceholder) {
                // Substituir placeholder pelo conteúdo do header
                headerPlaceholder.outerHTML = headerHTML;
            } else {
                // Inserir no início do body
                document.body.insertAdjacentHTML('afterbegin', headerHTML);
            }
            
            // Garantir que apenas uma barra de pesquisa mobile existe após inserir o header
            setTimeout(() => {
                const allMobileSearch = document.querySelectorAll('.mobile-search-container');
                if (allMobileSearch.length > 1) {
                    // Manter apenas a primeira e remover as outras
                    for (let i = 1; i < allMobileSearch.length; i++) {
                        allMobileSearch[i].remove();
                    }
                }
            }, 100);
        }
    } catch (error) {
        console.error('Erro ao carregar header:', error);
    }

    // Carregar menu mobile
    try {
        const navResponse = await fetch('mobile-nav.html');
        if (navResponse.ok) {
            const navHTML = await navResponse.text();
            
            // Procurar por menu mobile existente e substituir
            const existingNav = document.getElementById('mobileNav');
            const existingOverlay = document.getElementById('mobileOverlay');
            const navPlaceholder = document.getElementById('mobile-nav-placeholder');
            
            if (existingNav || existingOverlay) {
                // Remover elementos existentes
                if (existingOverlay) existingOverlay.remove();
                if (existingNav) existingNav.remove();
            }
            
            if (navPlaceholder) {
                // Substituir placeholder pelo conteúdo do menu
                navPlaceholder.outerHTML = navHTML;
            } else {
                // Inserir antes do fechamento do body
                document.body.insertAdjacentHTML('beforeend', navHTML);
            }
            
            // Marcar página ativa e configurar event listeners após inserir o menu
            setTimeout(() => {
                if (!markActivePage()) {
                    // Se não conseguiu marcar, tenta novamente
                    setTimeout(markActivePage, 300);
                }
                
                // Adicionar event listeners para fechar o menu ao clicar nos links
                // Usar delegação de eventos para evitar problemas com elementos dinâmicos
                const mobileNavMenu = document.querySelector('.mobile-nav-menu');
                if (mobileNavMenu) {
                    mobileNavMenu.addEventListener('click', function(e) {
                        const navItem = e.target.closest('.nav-item');
                        if (navItem) {
                            // Fechar o menu antes de navegar
                            if (typeof closeMobileNav === 'function') {
                                closeMobileNav();
                            }
                            // O navegador seguirá o link normalmente (comportamento padrão)
                        }
                    });
                }
            }, 100);
        }
    } catch (error) {
        console.error('Erro ao carregar menu mobile:', error);
    }
    
    // Tenta marcar a página ativa várias vezes para garantir que funcione
    setTimeout(markActivePage, 300);
    setTimeout(markActivePage, 600);
    setTimeout(markActivePage, 1200);
    
    // Também marca quando o DOM estiver totalmente carregado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(markActivePage, 200);
        });
    } else {
        setTimeout(markActivePage, 200);
    }

    // Inicializar badges e status do usuário após carregar o header
    setTimeout(() => {
        if (typeof updateCartBadge === 'function') {
            updateCartBadge();
        }
        if (typeof updateFavoritesBadge === 'function') {
            updateFavoritesBadge();
        }
        if (typeof updateUserStatus === 'function') {
            updateUserStatus();
        }
    }, 300);
})();
