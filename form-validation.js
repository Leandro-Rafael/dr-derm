/**
 * Sistema de Validação em Tempo Real para Formulários
 * Fornece feedback visual imediato ao usuário
 */

// Função para adicionar validação em tempo real a um input
function addRealTimeValidation(input, validator, errorMessage) {
    if (!input) return;
    
    // Criar container de erro se não existir
    let errorContainer = input.parentElement.querySelector('.field-error');
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.className = 'field-error';
        errorContainer.style.cssText = 'color: #ef4444; font-size: 12px; margin-top: 4px; display: none;';
        input.parentElement.appendChild(errorContainer);
    }
    
    // Adicionar classes CSS se não existirem
    if (!document.querySelector('style[data-validation-styles]')) {
        const style = document.createElement('style');
        style.setAttribute('data-validation-styles', 'true');
        style.textContent = `
            .form-input.error {
                border-color: #ef4444 !important;
                background-color: #fef2f2 !important;
            }
            .form-input.valid {
                border-color: #10b981 !important;
                background-color: #f0fdf4 !important;
            }
            .form-input:focus.error {
                box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
            }
            .form-input:focus.valid {
                box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Função de validação
    function validate() {
        const value = input.value.trim();
        const isValid = validator(value);
        
        if (value === '') {
            // Campo vazio - estado neutro
            input.classList.remove('error', 'valid');
            errorContainer.style.display = 'none';
            return true; // Permitir campo vazio (required será validado no submit)
        }
        
        if (isValid) {
            input.classList.remove('error');
            input.classList.add('valid');
            errorContainer.style.display = 'none';
            return true;
        } else {
            input.classList.remove('valid');
            input.classList.add('error');
            errorContainer.style.display = 'block';
            errorContainer.textContent = errorMessage;
            return false;
        }
    }
    
    // Validar ao perder foco e ao digitar (com debounce)
    let timeout;
    input.addEventListener('blur', validate);
    input.addEventListener('input', function() {
        clearTimeout(timeout);
        timeout = setTimeout(validate, 300); // Debounce de 300ms
    });
    
    // Validar inicialmente se já tiver valor
    if (input.value) {
        validate();
    }
}

// Validadores pré-definidos
const validators = {
    email: (value) => {
        if (typeof isValidEmail !== 'undefined') {
            return isValidEmail(value);
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    },
    
    cpf: (value) => {
        if (typeof isValidCPF !== 'undefined') {
            return isValidCPF(value);
        }
        const cleanCPF = value.replace(/\D/g, '');
        return cleanCPF.length === 11;
    },
    
    phone: (value) => {
        if (typeof isValidPhone !== 'undefined') {
            return isValidPhone(value);
        }
        const cleanPhone = value.replace(/\D/g, '');
        return cleanPhone.length >= 10 && cleanPhone.length <= 11;
    },
    
    cep: (value) => {
        if (typeof isValidCEP !== 'undefined') {
            return isValidCEP(value);
        }
        const cleanCEP = value.replace(/\D/g, '');
        return cleanCEP.length === 8;
    },
    
    required: (value) => {
        return value.trim().length > 0;
    },
    
    minLength: (min) => (value) => {
        return value.length >= min;
    },
    
    maxLength: (max) => (value) => {
        return value.length <= max;
    }
};

// Função para inicializar validações em um formulário
function initFormValidation(formSelector) {
    const form = typeof formSelector === 'string' 
        ? document.querySelector(formSelector) 
        : formSelector;
    
    if (!form) return;
    
    // Validar email
    const emailInputs = form.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        addRealTimeValidation(input, validators.email, 'Por favor, insira um email válido');
    });
    
    // Validar CPF
    const cpfInputs = form.querySelectorAll('input[name*="cpf"], input[id*="cpf"], input[placeholder*="CPF" i]');
    cpfInputs.forEach(input => {
        addRealTimeValidation(input, validators.cpf, 'CPF inválido. Digite 11 números');
    });
    
    // Validar telefone
    const phoneInputs = form.querySelectorAll('input[type="tel"], input[name*="phone"], input[id*="phone"]');
    phoneInputs.forEach(input => {
        addRealTimeValidation(input, validators.phone, 'Telefone inválido. Digite DDD + número');
    });
    
    // Validar CEP
    const cepInputs = form.querySelectorAll('input[name*="cep"], input[id*="cep"], input[placeholder*="CEP" i]');
    cepInputs.forEach(input => {
        addRealTimeValidation(input, validators.cep, 'CEP inválido. Digite 8 números');
    });
    
    // Validar campos obrigatórios
    const requiredInputs = form.querySelectorAll('input[required], textarea[required]');
    requiredInputs.forEach(input => {
        addRealTimeValidation(input, validators.required, 'Este campo é obrigatório');
    });
}

// Função para validar formulário completo antes do submit
function validateForm(formSelector) {
    const form = typeof formSelector === 'string' 
        ? document.querySelector(formSelector) 
        : formSelector;
    
    if (!form) return false;
    
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        const value = input.value.trim();
        if (!value) {
            isValid = false;
            input.classList.add('error');
            
            // Mostrar erro
            let errorContainer = input.parentElement.querySelector('.field-error');
            if (!errorContainer) {
                errorContainer = document.createElement('div');
                errorContainer.className = 'field-error';
                errorContainer.style.cssText = 'color: #ef4444; font-size: 12px; margin-top: 4px;';
                input.parentElement.appendChild(errorContainer);
            }
            errorContainer.textContent = 'Este campo é obrigatório';
            errorContainer.style.display = 'block';
        }
    });
    
    return isValid;
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.addRealTimeValidation = addRealTimeValidation;
    window.validators = validators;
    window.initFormValidation = initFormValidation;
    window.validateForm = validateForm;
}


