# Solução: Erro de Deploy - Plugin Next.js

## 🔴 Problema

O Netlify está detectando automaticamente o Next.js e tentando fazer build, mas este projeto é um site estático HTML.

**Erro:**
```
Error: Your publish directory cannot be the same as the base directory of your site
Plugin "@netlify/plugin-nextjs" failed
```

## ✅ Solução Aplicada

1. **Adicionei configuração no `netlify.toml`** para desabilitar o plugin Next.js
2. **Criei arquivo `.netlifyignore`** para ignorar arquivos do Next.js no build

## 🔧 Se Ainda Não Funcionar

### Opção 1: Desabilitar Plugin no Netlify Dashboard

1. Acesse: https://app.netlify.com
2. Seu site → **Site settings** → **Build & deploy** → **Plugins**
3. Procure por **"@netlify/plugin-nextjs"**
4. Clique em **"Disable"** ou **"Remove"**

### Opção 2: Configurar Build Settings Manualmente

1. Acesse: https://app.netlify.com
2. Seu site → **Site settings** → **Build & deploy** → **Build settings**
3. Configure:
   - **Build command**: (deixe vazio)
   - **Publish directory**: (deixe vazio ou coloque `.`)
4. Salve

### Opção 3: Remover Arquivos do Next.js (Se Não Usar)

Se você não usa os arquivos do Next.js (`app/`, `next.config.js`, etc.), pode removê-los:

```bash
# Cuidado: só faça isso se não usar Next.js
rm -rf app/
rm next.config.js
rm tsconfig.json
rm postcss.config.js
rm tailwind.config.js
rm -rf components/
```

Mas **NÃO faça isso** se planeja usar Next.js no futuro.

## ✅ Verificar se Funcionou

Após fazer as alterações:

1. Faça commit e push:
```bash
git add .
git commit -m "Fix: desabilitar plugin Next.js"
git push
```

2. Aguarde o deploy no Netlify
3. Verifique se o deploy foi bem-sucedido

## 📝 Arquivos Modificados

- ✅ `netlify.toml` - Adicionada configuração para desabilitar Next.js
- ✅ `.netlifyignore` - Criado para ignorar arquivos do Next.js
