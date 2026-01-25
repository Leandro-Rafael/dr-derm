# Como Fazer Deploy pelo Terminal - Netlify CLI

## Pré-requisitos

1. **Instalar Netlify CLI** (se ainda não tiver):
```powershell
npm install -g netlify-cli
```

2. **Verificar se está instalado:**
```powershell
netlify --version
```

## Passo a Passo

### 1. Verificar Login

```powershell
netlify status
```

Se não estiver logado, faça login:
```powershell
netlify login
```
- Vai abrir o navegador para autorizar
- Clique em "Authorize"

### 2. Verificar se o Projeto Está Linkado

```powershell
netlify status
```

Se não estiver linkado, linke o projeto:
```powershell
netlify link
```
- Vai perguntar qual site
- Selecione seu site "drdermofc" ou o nome do seu projeto

### 3. Fazer Deploy

**Opção A - Deploy de Produção (Recomendado):**
```powershell
cd C:\Users\Kelly\Desktop\drderm
netlify deploy --prod
```

**Opção B - Deploy Específico (se a opção A não funcionar):**
```powershell
netlify deploy --prod --dir . --functions netlify/functions
```

**Opção C - Deploy Direto sem especificar paths (mais simples):**
```powershell
netlify deploy --prod
```

O Netlify CLI vai usar o `netlify.toml` automaticamente.

### 4. Verificar o Deploy

O terminal vai mostrar:
- URL do deploy
- Link para ver o site
- Status (sucesso ou erro)

## Comandos Úteis

### Ver Status
```powershell
netlify status
```

### Ver Logs
```powershell
netlify logs
```

### Listar Sites
```powershell
netlify sites:list
```

### Desfazer Link (se necessário)
```powershell
netlify unlink
```

## Troubleshooting

### Erro: "not logged in"
```powershell
netlify login
```

### Erro: "not linked"
```powershell
netlify link
```

### Erro: "functions not found"
- Verifique se a pasta `netlify/functions` existe
- Verifique o `netlify.toml` está correto

### Erro: "site not found"
- Use `netlify link` para vincular o projeto
- Ou use `netlify deploy --prod --site SEU_SITE_ID`

## Comando Simplificado (Recomendado)

Depois de configurado, você só precisa:
```powershell
netlify deploy --prod
```

O Netlify CLI vai:
- ✅ Ler o `netlify.toml`
- ✅ Encontrar as functions automaticamente
- ✅ Fazer deploy de tudo

