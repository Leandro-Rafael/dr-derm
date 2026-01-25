# Guia Completo: Como Obter Chave Gratuita da Abstract API

## Passo a Passo

### 1. Acesse o Site da Abstract API
- Vá para: **https://www.abstractapi.com/**
- Ou diretamente para Email Validation: **https://www.abstractapi.com/api/email-validation**

### 2. Criar Conta (Gratuita)
- Clique no botão **"Get Started"** ou **"Sign Up"** (canto superior direito)
- Você pode se registrar com:
  - **Email**
  - **Google** (conta Google)
  - **GitHub** (conta GitHub)

### 3. Preencher o Cadastro
- **Nome completo**
- **Email** (para receber confirmação)
- **Senha** (mínimo 8 caracteres)
- Aceite os termos de serviço
- Clique em **"Create Account"** ou **"Sign Up"**

### 4. Verificar Email (se necessário)
- Verifique sua caixa de entrada
- Clique no link de confirmação enviado pela Abstract API

### 5. Acessar o Dashboard
- Após login, você será redirecionado para o Dashboard
- No menu lateral, procure por **"APIs"** ou **"Email Validation"**

### 6. Encontrar sua API Key
- No dashboard, você verá a lista de APIs disponíveis
- Clique em **"Email Validation API"**
- Ou procure na seção **"API Keys"** ou **"Credentials"**
- Você verá sua **API Key** (uma string longa de caracteres)

### 7. Copiar a API Key
- Clique no ícone de **copiar** ao lado da chave
- Ou selecione e copie manualmente (Ctrl+C)
- **IMPORTANTE:** Guarde essa chave com segurança!

## Como Adicionar no Netlify

### 1. Acesse seu Projeto no Netlify
- Vá para: **https://app.netlify.com**
- Clique no nome do seu **projeto** (não em Team settings)

### 2. Vá em Site Settings
- No menu do projeto, clique em **"Site settings"**
- No menu lateral esquerdo, procure **"Environment variables"**
- (Pode estar em **"Build & deploy"** > **"Environment variables"**)

### 3. Adicionar Variável
- Clique no botão **"Add a variable"** ou **"Add environment variable"**
- **Key:** `ABSTRACT_API_KEY`
- **Value:** Cole a chave que você copiou da Abstract API
- Selecione os ambientes:
  - ✅ **Production**
  - ✅ **Deploy previews** (opcional)
  - ✅ **Branch deploys** (opcional)
- Clique em **"Save"**

### 4. Fazer Novo Deploy
- Para a variável funcionar, você precisa fazer um novo deploy
- Você pode:
  - Fazer um commit/push qualquer
  - Ou clicar em **"Trigger deploy"** > **"Deploy site"**

## Limites do Plano Gratuito

✅ **100 requisições por mês** (gratuito)
✅ **Verificação de formato de email**
✅ **Verificação de domínio**
✅ **Verificação SMTP** (se o email realmente existe)
✅ **Verificação de deliverability**

⚠️ **Se exceder 100 requisições/mês**, precisará:
- Aguardar o próximo mês, OU
- Fazer upgrade para plano pago

## Testar se Está Funcionando

Após configurar, teste cadastrando um email:
- ✅ **Email válido:** Deve aceitar normalmente
- ❌ **Email inválido/fake:** Deve rejeitar

## Troubleshooting

### A chave não funciona?
1. Verifique se copiou a chave completa (sem espaços extras)
2. Confirme que adicionou como `ABSTRACT_API_KEY` (nome exato)
3. Faça um novo deploy após adicionar a variável
4. Verifique os logs do Netlify para erros

### Não encontrou a API Key no dashboard?
- Procure na barra superior por **"API Keys"**
- Ou vá em **"Account"** > **"API Keys"**
- Algumas vezes aparece como **"Credentials"** ou **"Keys"**

### Esqueceu a senha?
- Vá para: https://www.abstractapi.com/users/password-reset
- Digite seu email
- Siga as instruções enviadas

## Links Úteis

- **Site da Abstract API:** https://www.abstractapi.com/
- **Email Validation API:** https://www.abstractapi.com/api/email-validation
- **Dashboard:** https://app.abstractapi.com/
- **Documentação:** https://www.abstractapi.com/api/email-validation/documentation

## Suporte

Se tiver problemas:
- **Abstract API Support:** https://www.abstractapi.com/support
- **Documentação completa:** https://docs.abstractapi.com/

---

**Dica:** A Abstract API é uma das mais confiáveis e fáceis de usar. O plano gratuito de 100 requisições/mês é perfeito para sites com tráfego baixo/médio.

