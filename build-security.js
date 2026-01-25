/**
 * Script de Build para Minificação e Ofuscação
 * Executa minificação e ofuscação de código para produção
 */

const fs = require('fs');
const path = require('path');

// Função para minificar JavaScript (versão básica)
function minifyJS(code) {
    if (!code || typeof code !== 'string') return code;
    
    // Remover comentários
    code = code.replace(/\/\*[\s\S]*?\*\//g, '');
    code = code.replace(/\/\/.*$/gm, '');
    
    // Remover espaços em branco desnecessários
    code = code.replace(/\s+/g, ' ');
    code = code.replace(/\s*([{}();,=+\-*\/])\s*/g, '$1');
    code = code.replace(/;\s*}/g, '}');
    code = code.trim();
    
    return code;
}

// Função para minificar CSS (versão básica)
function minifyCSS(code) {
    if (!code || typeof code !== 'string') return code;
    
    // Remover comentários
    code = code.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remover espaços em branco
    code = code.replace(/\s+/g, ' ');
    code = code.replace(/\s*([{}:;,])\s*/g, '$1');
    code = code.replace(/;\s*}/g, '}');
    code = code.trim();
    
    return code;
}

// Função para minificar HTML (versão básica)
function minifyHTML(code) {
    if (!code || typeof code !== 'string') return code;
    
    // Remover comentários HTML (exceto condicionais)
    code = code.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');
    
    // Remover espaços em branco entre tags
    code = code.replace(/>\s+</g, '><');
    
    // Remover espaços em branco no início e fim de linhas
    code = code.replace(/^\s+|\s+$/gm, '');
    
    return code;
}

// Processar arquivos JavaScript
function processJSFiles() {
    const jsFiles = [
        'utils.js',
        'security.js',
        'error-handler.js',
        'form-validation.js',
        'load-header.js',
        'crypto-utils.js',
        'code-protection.js',
        'integrity-check.js'
    ];
    
    console.log('Processando arquivos JavaScript...');
    
    jsFiles.forEach(file => {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const minified = minifyJS(content);
                
                // Criar versão minificada
                const minPath = path.join(__dirname, 'dist', file.replace('.js', '.min.js'));
                
                // Criar diretório dist se não existir
                const distDir = path.join(__dirname, 'dist');
                if (!fs.existsSync(distDir)) {
                    fs.mkdirSync(distDir, { recursive: true });
                }
                
                fs.writeFileSync(minPath, minified, 'utf8');
                console.log(`✓ Minificado: ${file} -> dist/${path.basename(minPath)}`);
            } catch (error) {
                console.error(`Erro ao processar ${file}:`, error.message);
            }
        }
    });
}

// Processar arquivos HTML
function processHTMLFiles() {
    const htmlFiles = [
        'index.html',
        'login.html',
        'admin.html',
        'produtos.html',
        'carrinho.html',
        'checkout.html',
        'perfil.html',
        'pedidos.html',
        'favoritos.html',
        'produto.html'
    ];
    
    console.log('Processando arquivos HTML...');
    
    htmlFiles.forEach(file => {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const minified = minifyHTML(content);
                
                const minPath = path.join(__dirname, 'dist', file);
                
                const distDir = path.join(__dirname, 'dist');
                if (!fs.existsSync(distDir)) {
                    fs.mkdirSync(distDir, { recursive: true });
                }
                
                fs.writeFileSync(minPath, minified, 'utf8');
                console.log(`✓ Minificado: ${file} -> dist/${file}`);
            } catch (error) {
                console.error(`Erro ao processar ${file}:`, error.message);
            }
        }
    });
}

// Função principal
function build() {
    console.log('Iniciando build de segurança...\n');
    
    processJSFiles();
    console.log('');
    processHTMLFiles();
    
    console.log('\n✓ Build concluído!');
    console.log('Arquivos minificados estão em: dist/');
    console.log('\nNota: Para ofuscação completa, considere usar ferramentas como:');
    console.log('- javascript-obfuscator (npm install -g javascript-obfuscator)');
    console.log('- terser (npm install -g terser)');
    console.log('- html-minifier (npm install -g html-minifier)');
}

// Executar se chamado diretamente
if (require.main === module) {
    build();
}

module.exports = { build, minifyJS, minifyCSS, minifyHTML };


















