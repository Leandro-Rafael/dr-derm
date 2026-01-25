# Instalação do Mercado Pago - Resolução de Erro

## Problema
O erro ocorre porque o módulo `mercadopago` precisa estar instalado localmente antes do deploy.

## Solução

### Opção 1: Instalar localmente (Recomendado)

Execute o comando abaixo quando sua conexão estiver estável:

```powershell
npm install
```

Se houver problemas de timeout, tente:

```powershell
npm install --registry https://registry.npmjs.org/
```

Ou use um mirror:

```powershell
npm install --registry https://registry.npmmirror.com/
```

### Opção 2: Instalar apenas o mercadopago

```powershell
npm install mercadopago@^2.2.0
```

### Opção 3: Verificar se já está instalado

Verifique se a pasta `node_modules` existe e contém o módulo:

```powershell
Test-Path node_modules\mercadopago
```

## Após instalar

1. Verifique se o `package.json` contém:
```json
{
  "dependencies": {
    "mercadopago": "^2.2.0"
  }
}
```

2. Execute o deploy novamente:
```powershell
netlify deploy --prod
```

## Nota Importante

O Netlify precisa que as dependências estejam listadas no `package.json` na raiz do projeto. Durante o build, o Netlify instalará automaticamente as dependências, mas para fazer o bundle das funções localmente (antes do deploy), ele precisa que o módulo esteja instalado.

## Troubleshooting

Se continuar com problemas:

1. **Limpar cache do npm:**
```powershell
npm cache clean --force
```

2. **Deletar node_modules e package-lock.json e reinstalar:**
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

3. **Verificar conectividade:**
```powershell
Test-NetConnection registry.npmjs.org -Port 443
```

4. **Usar yarn como alternativa:**
```powershell
yarn add mercadopago@^2.2.0
```


