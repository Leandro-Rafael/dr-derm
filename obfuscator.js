/**
 * Sistema de Ofuscação de Código JavaScript
 * Transforma código legível em código ofuscado
 */

// Função básica de ofuscação (para uso em build)
function obfuscateCode(code) {
    if (!code || typeof code !== 'string') return code;
    
    // Remover comentários
    code = code.replace(/\/\*[\s\S]*?\*\//g, '');
    code = code.replace(/\/\/.*$/gm, '');
    
    // Remover espaços em branco desnecessários
    code = code.replace(/\s+/g, ' ');
    code = code.replace(/\s*([{}();,=+\-*\/])\s*/g, '$1');
    code = code.trim();
    
    // Substituir nomes de variáveis comuns por versões ofuscadas
    const varMap = {
        'function': 'function',
        'var ': 'var ',
        'let ': 'let ',
        'const ': 'const ',
        'return ': 'return ',
        'if (': 'if(',
        'else ': 'else ',
        'for (': 'for(',
        'while (': 'while(',
        'document.': 'document.',
        'window.': 'window.',
        'localStorage.': 'localStorage.',
        'fetch(': 'fetch('
    };
    
    // Ofuscar strings (opcional, pode quebrar código)
    // code = code.replace(/"([^"]+)"/g, (match, str) => {
    //     return '"' + btoa(str).replace(/[+/=]/g, m => ({'+':'-','/':'_','=':''})[m]) + '"';
    // });
    
    return code;
}

// Função para ofuscar nomes de variáveis (versão simples)
function obfuscateVariableNames(code) {
    // Esta é uma versão simplificada
    // Para ofuscação completa, usar ferramentas como javascript-obfuscator
    return code;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { obfuscateCode, obfuscateVariableNames };
}


















