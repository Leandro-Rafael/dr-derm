# Script PowerShell para configurar Git no projeto DrDerm
# Execute: .\setup-git.ps1

Write-Host "=== Configurando Git para DrDerm ===" -ForegroundColor Cyan
Write-Host ""

# Verificar se Git está instalado
Write-Host "Verificando Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✓ Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git não encontrado!" -ForegroundColor Red
    Write-Host "Baixe em: https://git-scm.com/downloads" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Verificar se já é um repositório Git
if (Test-Path ".git") {
    Write-Host "⚠ Repositório Git já inicializado" -ForegroundColor Yellow
    $continue = Read-Host "Deseja continuar mesmo assim? (s/n)"
    if ($continue -ne "s" -and $continue -ne "S") {
        exit 0
    }
} else {
    Write-Host "Inicializando repositório Git..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Repositório inicializado" -ForegroundColor Green
}

Write-Host ""

# Verificar se .gitignore existe
if (-not (Test-Path ".gitignore")) {
    Write-Host "Criando .gitignore..." -ForegroundColor Yellow
    @"
# Dependências
node_modules/
package-lock.json

# Build
.next/
dist/
build/

# Variáveis de ambiente (NUNCA commitar!)
.env
.env.local
.env.production

# Logs
*.log
npm-debug.log*

# Sistema
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Netlify
.netlify/
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8
    Write-Host "✓ .gitignore criado" -ForegroundColor Green
} else {
    Write-Host "✓ .gitignore já existe" -ForegroundColor Green
}

Write-Host ""

# Adicionar arquivos
Write-Host "Adicionando arquivos ao Git..." -ForegroundColor Yellow
git add .
Write-Host "✓ Arquivos adicionados" -ForegroundColor Green

Write-Host ""

# Fazer commit
Write-Host "Fazendo commit inicial..." -ForegroundColor Yellow
git commit -m "Initial commit - DrDerm e-commerce"
Write-Host "✓ Commit realizado" -ForegroundColor Green

Write-Host ""
Write-Host "=== Próximos Passos ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Crie um repositório no GitHub:" -ForegroundColor Yellow
Write-Host "   https://github.com/new" -ForegroundColor White
Write-Host ""
Write-Host "2. Conecte o repositório local ao GitHub:" -ForegroundColor Yellow
Write-Host "   git remote add origin https://github.com/SEU_USUARIO/drderm.git" -ForegroundColor White
Write-Host "   git branch -M main" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "3. No Netlify, importe o repositório:" -ForegroundColor Yellow
Write-Host "   https://app.netlify.com" -ForegroundColor White
Write-Host "   Add new site → Import an existing project → GitHub" -ForegroundColor White
Write-Host ""
Write-Host "4. Configure as variáveis de ambiente no Netlify:" -ForegroundColor Yellow
Write-Host "   - SUPABASE_URL" -ForegroundColor White
Write-Host "   - SUPABASE_ANON_KEY" -ForegroundColor White
Write-Host "   - ENCRYPTION_KEY (opcional)" -ForegroundColor White
Write-Host ""
Write-Host "Consulte o arquivo GUIA_DEPLOY_COMPLETO.md para mais detalhes!" -ForegroundColor Cyan
Write-Host ""
