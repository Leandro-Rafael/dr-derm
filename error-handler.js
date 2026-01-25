/**
 * Sistema Centralizado de Tratamento de Erros
 * Fornece feedback consistente e profissional ao usuário
 */

// Tipos de erros e suas mensagens amigáveis
const errorMessages = {
    network: {
        title: 'Erro de Conexão',
        message: 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.',
        icon: '📡'
    },
    server: {
        title: 'Erro no Servidor',
        message: 'Ocorreu um erro no servidor. Nossa equipe foi notificada e está trabalhando para resolver o problema.',
        icon: '⚠️'
    },
    validation: {
        title: 'Dados Inválidos',
        message: 'Por favor, verifique os campos preenchidos e tente novamente.',
        icon: '✏️'
    },
    auth: {
        title: 'Não Autorizado',
        message: 'Você precisa estar logado para realizar esta ação.',
        icon: '🔒'
    },
    notFound: {
        title: 'Não Encontrado',
        message: 'O recurso solicitado não foi encontrado.',
        icon: '🔍'
    },
    payment: {
        title: 'Erro no Pagamento',
        message: 'Não foi possível processar o pagamento. Verifique os dados e tente novamente.',
        icon: '💳'
    },
    generic: {
        title: 'Ops! Algo deu errado',
        message: 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.',
        icon: '❌'
    }
};

// Função para exibir erro de forma profissional
function showError(error, type = 'generic', options = {}) {
    const errorConfig = errorMessages[type] || errorMessages.generic;
    const {
        title = errorConfig.title,
        message = errorConfig.message,
        icon = errorConfig.icon,
        duration = 5000,
        dismissible = true,
        onDismiss = null
    } = options;

    // Criar ou obter container de erros
    let errorContainer = document.getElementById('globalErrorContainer');
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.id = 'globalErrorContainer';
        errorContainer.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10001;
            max-width: 400px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        document.body.appendChild(errorContainer);
    }

    // Criar elemento de erro
    const errorElement = document.createElement('div');
    errorElement.className = 'error-notification';
    errorElement.style.cssText = `
        background: linear-gradient(135deg, #fee2e2 0%, #fef2f2 100%);
        border-left: 4px solid #ef4444;
        border-radius: 12px;
        padding: 16px 20px;
        margin-bottom: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: flex-start;
        gap: 12px;
        animation: slideInRight 0.3s ease-out;
        position: relative;
    `;

    const safeTitle = typeof escapeHTML !== 'undefined' ? escapeHTML(title) : title;
    const safeMessage = typeof escapeHTML !== 'undefined' ? escapeHTML(message) : message;
    const safeError = error && error.message ? (typeof escapeHTML !== 'undefined' ? escapeHTML(error.message) : error.message) : '';

    errorElement.innerHTML = `
        <div style="font-size: 24px; flex-shrink: 0;">${icon}</div>
        <div style="flex: 1;">
            <div style="font-weight: 600; color: #1e2723; margin-bottom: 4px; font-size: 15px;">${safeTitle}</div>
            <div style="color: #6b7280; font-size: 14px; line-height: 1.5;">${safeMessage}</div>
            ${safeError && process.env.NODE_ENV === 'development' ? `<div style="color: #9ca3af; font-size: 12px; margin-top: 8px; font-family: monospace;">${safeError}</div>` : ''}
        </div>
        ${dismissible ? `<button onclick="this.parentElement.remove()" style="background: none; border: none; color: #6b7280; cursor: pointer; font-size: 20px; padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">×</button>` : ''}
    `;

    errorContainer.appendChild(errorElement);

    // Auto-remover após duração especificada
    if (duration > 0) {
        setTimeout(() => {
            if (errorElement.parentElement) {
                errorElement.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => {
                    if (errorElement.parentElement) {
                        errorElement.remove();
                    }
                    if (onDismiss) onDismiss();
                }, 300);
            }
        }, duration);
    }

    // Adicionar animações CSS se não existirem
    if (!document.querySelector('style[data-error-animations]')) {
        const style = document.createElement('style');
        style.setAttribute('data-error-animations', 'true');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Log para desenvolvimento
    if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
        console.error('Error:', error);
    }
}

// Função para exibir sucesso
function showSuccess(message, duration = 3000) {
    let successContainer = document.getElementById('globalSuccessContainer');
    if (!successContainer) {
        successContainer = document.createElement('div');
        successContainer.id = 'globalSuccessContainer';
        successContainer.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10001;
            max-width: 400px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        document.body.appendChild(successContainer);
    }

    const successElement = document.createElement('div');
    successElement.className = 'success-notification';
    successElement.style.cssText = `
        background: linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%);
        border-left: 4px solid #10b981;
        border-radius: 12px;
        padding: 16px 20px;
        margin-bottom: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        animation: slideInRight 0.3s ease-out;
    `;

    const safeMessage = typeof escapeHTML !== 'undefined' ? escapeHTML(message) : message;

    successElement.innerHTML = `
        <div style="font-size: 24px; flex-shrink: 0;">✅</div>
        <div style="flex: 1; color: #065f46; font-weight: 500; font-size: 14px;">${safeMessage}</div>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: #6b7280; cursor: pointer; font-size: 20px; padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">×</button>
    `;

    successContainer.appendChild(successElement);

    setTimeout(() => {
        if (successElement.parentElement) {
            successElement.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (successElement.parentElement) {
                    successElement.remove();
                }
            }, 300);
        }
    }, duration);
}

// Função para tratar erros de fetch/API
function handleApiError(error, response) {
    if (!response) {
        showError(error, 'network');
        return;
    }

    const status = response.status;
    let errorType = 'generic';
    let customMessage = null;

    switch (status) {
        case 400:
            errorType = 'validation';
            break;
        case 401:
        case 403:
            errorType = 'auth';
            break;
        case 404:
            errorType = 'notFound';
            break;
        case 500:
        case 502:
        case 503:
            errorType = 'server';
            break;
        default:
            errorType = 'generic';
    }

    // Tentar obter mensagem do servidor
    if (response.headers && response.headers.get('content-type')?.includes('application/json')) {
        response.json().then(data => {
            customMessage = data.message || data.error || null;
        }).catch(() => {
            // Ignorar erro de parse
        });
    }

    showError(error, errorType, {
        message: customMessage || errorMessages[errorType].message
    });
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.showError = showError;
    window.showSuccess = showSuccess;
    window.handleApiError = handleApiError;
    window.errorMessages = errorMessages;
}


