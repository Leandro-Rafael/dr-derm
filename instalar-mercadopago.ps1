# Script para instalar Mercado Pago quando a conexão estiver estável

Write-Host "Tentando instalar mercadopago..." -ForegroundColor Yellow

# Tentar com registry padrão
Write-Host "Tentativa 1: Registry padrão do npm..." -ForegroundColor Cyan
npm install mercadopago@^2.2.0

if ($LASTEXITCODE -ne 0) {
    Write-Host "Falhou. Tentando com timeout maior..." -ForegroundColor Yellow
    npm install mercadopago@^2.2.0 --timeout=120000
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "Falhou. Tentando limpar cache e reinstalar..." -ForegroundColor Yellow
    npm cache clean --force
    npm install mercadopago@^2.2.0
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "Mercado Pago instalado com sucesso!" -ForegroundColor Green
    Write-Host "Agora voce pode executar: netlify deploy --prod" -ForegroundColor Green
} else {
    Write-Host "Falha na instalacao. Verifique sua conexao com a internet." -ForegroundColor Red
    Write-Host "Tente novamente mais tarde ou use o deploy via interface web do Netlify." -ForegroundColor Yellow
}

