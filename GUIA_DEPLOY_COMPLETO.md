# Guia Completo: Conectar ao Git e Deploy no Netlify

## 📋 Pré-requisitos
- Conta no GitHub (gratuita): https://github.com
- Conta no Netlify (gratuita): https://app.netlify.com
- Git instalado no seu computador

---

## 🔧 PARTE 1: Preparar o Projeto Local

### Passo 1: Verificar se Git está instalado
Abra o terminal/PowerShell na pasta do projeto e execute:
```bash
git --version
```
Se não estiver instalado, baixe em: https://git-scm.com/downloads

### Passo 2: Inicializar Git no Projeto
No terminal, dentro da pasta do projeto (`C:\Users\Kelly\Desktop\drderm`):

```bash
# Inicializar repositório Git
git init

# Adicionar todos os arquivos
git add .

# Fazer primeiro commit
git commit -m "Initial commit - DrDerm e-commerce"
```

### Passo 3: Criar arquivo .gitignore
Crie um arquivo chamado `.gitignore` na raiz do projeto com este conteúdo:

```
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
```

Depois execute:
```bash
git add .gitignore
git commit -m "Add .gitignore"
```

---

## 🔧 PARTE 2: Criar Repositório no GitHub

### Passo 1: Criar Repositório no GitHub
1. Acesse: https://github.com
2. Faça login
3. Clique no botão **"+"** no canto superior direito
4. Selecione **"New repository"**
5. Preencha:
   - **Repository name**: `drderm` (ou outro nome)
   - **Description**: "E-commerce DrDerm"
   - **Visibility**: Escolha **Private** (recomendado) ou **Public**
   - **NÃO marque** "Initialize with README" (já temos arquivos)
6. Clique em **"Create repository"**

### Passo 2: Conectar Projeto Local ao GitHub
No terminal, execute os comandos que o GitHub mostrará (substitua `SEU_USUARIO` pelo seu username):

```bash
# Adicionar remote do GitHub
git remote add origin https://github.com/SEU_USUARIO/drderm.git

# Renomear branch principal para main (se necessário)
git branch -M main

# Enviar código para o GitHub
git push -u origin main
```

Se pedir autenticação:
- Use um **Personal Access Token** (não a senha)
- Para criar: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token
- Permissões: marque `repo`

---

## 🔧 PARTE 3: Conectar ao Netlify

### Passo 1: Importar Site no Netlify
1. Acesse: https://app.netlify.com
2. Clique em **"Add new site"** → **"Import an existing project"**
3. Clique em **"Deploy with GitHub"** (ou GitLab, se preferir)
4. Autorize o Netlify a acessar seu GitHub
5. Selecione o repositório **drderm**
6. Clique em **"Connect"**

### Passo 2: Configurar Build Settings
O Netlify detectará automaticamente, mas verifique:

**Build command**: (deixe vazio ou `npm run build` se tiver)
**Publish directory**: (deixe vazio ou `dist` se tiver)

**IMPORTANTE**: Como é um site estático HTML, você pode deixar tudo vazio.

### Passo 3: Configurar Variáveis de Ambiente
**ANTES de clicar em "Deploy"**, configure as variáveis:

1. Clique em **"Show advanced"** ou **"Environment variables"**
2. Adicione as variáveis:

```
SUPABASE_URL = https://seu-projeto.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ENCRYPTION_KEY = (chave de 64 caracteres - opcional)
MERCADOPAGO_ACCESS_TOKEN = (se já tiver configurado)
SITE_URL = https://seu-site.netlify.app
```

3. Para cada variável:
   - Clique em **"Add variable"**
   - Digite o nome (ex: `SUPABASE_URL`)
   - Cole o valor
   - Selecione **"Production"** em Scopes
   - Clique em **"Add"**

### Passo 4: Fazer Primeiro Deploy
1. Clique em **"Deploy site"**
2. Aguarde o deploy terminar (pode levar 1-2 minutos)
3. Quando terminar, você verá um link: `https://seu-site-aleatorio.netlify.app`

---

## 🔧 PARTE 4: Configurar Domínio Personalizado (Opcional)

Se você já tem um domínio (ex: drdermofc.netlify.app):

1. No Netlify, vá em **Site settings** → **Domain management**
2. Clique em **"Add custom domain"**
3. Digite seu domínio
4. Siga as instruções para configurar DNS

---

## 🔧 PARTE 5: Configurar Deploy Automático

O Netlify já configura automaticamente! Toda vez que você fizer `git push`, o site será atualizado automaticamente.

### Para fazer atualizações:
```bash
# Fazer alterações nos arquivos
# ...

# Adicionar alterações
git add .

# Fazer commit
git commit -m "Descrição das alterações"

# Enviar para GitHub (e Netlify fará deploy automaticamente)
git push
```

---

## 🔧 PARTE 6: Configurar netlify.toml (Opcional mas Recomendado)

Crie/edite o arquivo `netlify.toml` na raiz do projeto:

```toml
[build]
  # Comando de build (deixe vazio se não tiver)
  command = ""
  # Diretório de publicação
  publish = ""

[build.environment]
  NODE_VERSION = "18"

# Redirecionamentos para SPA (se necessário)
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Headers de segurança
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

Depois:
```bash
git add netlify.toml
git commit -m "Add netlify.toml configuration"
git push
```

---

## ✅ Checklist Final

Antes de considerar tudo pronto, verifique:

- [ ] ✅ Git inicializado no projeto
- [ ] ✅ Repositório criado no GitHub
- [ ] ✅ Código enviado para GitHub
- [ ] ✅ Site conectado no Netlify
- [ ] ✅ Variáveis de ambiente configuradas:
  - [ ] SUPABASE_URL
  - [ ] SUPABASE_ANON_KEY
  - [ ] ENCRYPTION_KEY (opcional)
- [ ] ✅ Primeiro deploy realizado com sucesso
- [ ] ✅ Site acessível e funcionando
- [ ] ✅ Login do admin funcionando

---

## 🆘 Problemas Comuns

### "Erro ao fazer push para GitHub"
- Verifique se está autenticado (use Personal Access Token)
- Verifique se o repositório existe no GitHub

### "Deploy falhou no Netlify"
- Verifique os logs em **Deploys** → clique no deploy que falhou
- Verifique se as variáveis de ambiente estão configuradas
- Verifique se não há erros de sintaxe no código

### "Site não carrega"
- Aguarde alguns minutos (DNS pode levar tempo)
- Limpe o cache do navegador (Ctrl+F5)
- Verifique os logs do Netlify

### "Login não funciona"
- Verifique se as variáveis SUPABASE_URL e SUPABASE_ANON_KEY estão configuradas
- Verifique os logs das funções no Netlify
- Certifique-se de que o banco de dados foi criado no Supabase

---

## 📞 Próximos Passos

Após tudo configurado:

1. **Teste o login do admin**:
   - Email: `drderm.adm@ofc`
   - Senha: `Bruno`

2. **Configure a primeira conta do MercadoPago**:
   - Acesse o admin
   - Vá em "Configurações de Pagamento"
   - Adicione uma conta

3. **Faça commits regulares**:
   - Sempre que fizer alterações, faça commit e push
   - O Netlify atualizará automaticamente

---

## 🎉 Pronto!

Agora seu projeto está conectado ao Git e fazendo deploy automático no Netlify!
