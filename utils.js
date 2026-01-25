/**
 * Utilitários de segurança e sanitização
 * Previne XSS e outras vulnerabilidades
 */

// Função para sanitizar HTML e prevenir XSS
function sanitizeHTML(str) {
    if (!str || typeof str !== 'string') return '';
    
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Função para sanitizar atributos HTML
function sanitizeAttribute(str) {
    if (!str || typeof str !== 'string') return '';
    return str
        .replace(/[<>"']/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '');
}

// Função para criar elementos HTML de forma segura
function createSafeElement(tag, attributes = {}, textContent = '') {
    const element = document.createElement(tag);
    
    // Adicionar atributos de forma segura
    Object.keys(attributes).forEach(key => {
        const value = sanitizeAttribute(String(attributes[key]));
        if (key === 'href' || key === 'src') {
            // Validar URLs
            if (value && !value.startsWith('javascript:') && !value.startsWith('data:')) {
                element.setAttribute(key, value);
            }
        } else if (key === 'class' || key === 'id' || key === 'style') {
            element.setAttribute(key, value);
        } else {
            element.setAttribute(key, value);
        }
    });
    
    // Adicionar conteúdo de texto de forma segura
    if (textContent) {
        element.textContent = textContent;
    }
    
    return element;
}

// Função para atualizar innerHTML de forma segura
function setSafeHTML(element, html) {
    if (!element) return;
    
    // Se for string simples sem tags HTML, usar textContent
    if (!/<[^>]+>/.test(html)) {
        element.textContent = html;
        return;
    }
    
    // Para HTML, sanitizar primeiro
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Remover scripts e event handlers
    const scripts = temp.querySelectorAll('script, iframe, object, embed');
    scripts.forEach(s => s.remove());
    
    // Remover atributos de eventos
    const allElements = temp.querySelectorAll('*');
    allElements.forEach(el => {
        Array.from(el.attributes).forEach(attr => {
            if (attr.name.startsWith('on')) {
                el.removeAttribute(attr.name);
            }
        });
    });
    
    element.innerHTML = temp.innerHTML;
}

// Função para validar email
function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    // Permitir email administrativo especial sem TLD
    if ((email || '').toLowerCase().trim() === 'drderm.adm@ofc') return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

// Função para validar senha forte
function isValidPassword(password) {
    if (!password || typeof password !== 'string') return false;
    
    // Mínimo de 8 caracteres
    if (password.length < 8) return false;
    
    // Pelo menos uma letra maiúscula
    if (!/[A-Z]/.test(password)) return false;
    
    // Pelo menos uma letra minúscula
    if (!/[a-z]/.test(password)) return false;
    
    // Pelo menos um número
    if (!/[0-9]/.test(password)) return false;
    
    // Pelo menos um caractere especial
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
    
    return true;
}

// Função para obter mensagens de erro de senha
function getPasswordErrors(password) {
    const errors = [];
    
    if (!password || password.length === 0) {
        return ['Senha é obrigatória'];
    }
    
    if (password.length < 8) {
        errors.push('Mínimo de 8 caracteres');
    }
    
    if (!/[A-Z]/.test(password)) {
        errors.push('Pelo menos uma letra maiúscula');
    }
    
    if (!/[a-z]/.test(password)) {
        errors.push('Pelo menos uma letra minúscula');
    }
    
    if (!/[0-9]/.test(password)) {
        errors.push('Pelo menos um número');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Pelo menos um caractere especial (!@#$%^&*...)');
    }
    
    return errors;
}

// Função para validar CPF
function isValidCPF(cpf) {
    if (!cpf) return false;
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) return false;
    if (/^(\d)\1+$/.test(cleanCPF)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cleanCPF.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    return digit === parseInt(cleanCPF.charAt(10));
}

// Função para validar telefone brasileiro
function isValidPhone(phone) {
    if (!phone) return false;
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
}

// Função para validar CEP
function isValidCEP(cep) {
    if (!cep) return false;
    const cleanCEP = cep.replace(/\D/g, '');
    return cleanCEP.length === 8;
}

// Função para escapar strings para uso em HTML
function escapeHTML(str) {
    if (!str) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(str).replace(/[&<>"']/g, m => map[m]);
}

// Exportar funções para uso global
if (typeof window !== 'undefined') {
    window.sanitizeHTML = sanitizeHTML;
    window.sanitizeAttribute = sanitizeAttribute;
    window.createSafeElement = createSafeElement;
    window.setSafeHTML = setSafeHTML;
    window.isValidEmail = isValidEmail;
    window.isValidPassword = isValidPassword;
    window.getPasswordErrors = getPasswordErrors;
    window.isValidCPF = isValidCPF;
    window.isValidPhone = isValidPhone;
    window.isValidCEP = isValidCEP;
    window.escapeHTML = escapeHTML;
}


