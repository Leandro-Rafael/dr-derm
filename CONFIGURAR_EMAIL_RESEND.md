# 🚀 Guia Rápido: Configurar Email com Resend

## ✅ O que foi implementado

A função de recuperação de senha agora está configurada para usar o **Resend** (recomendado pelo Supabase). O código já está pronto, você só precisa configurar as credenciais.

## 📋 Passos para Configurar

### 1. Criar Conta no Resend (Grátis)

1. Acesse: https://resend.com
2. Clique em **"Sign Up"**
3. Crie sua conta (é grátis)
4. Verifique seu email

### 2. Obter API Key

1. No painel do Resend, vá em **"API Keys"** (menu lateral)
2. Clique em **"Create API Key"**
3. Dê um nome: `Netlify DrDerm`
4. Permissões: Selecione **"Sending access"**
5. Clique em **"Create"**
6. **IMPORTANTE**: Copie a API Key agora (ela só aparece uma vez!)
   - Formato: `re_abc123xyz456...`

### 3. Configurar Email Remetente

#### Opção A: Usar domínio do Resend (Testes Rápidos)
- Use: `onboarding@resend.dev`
- ⚠️ Limitação: Apenas para testes, não recomendado para produção

#### Opção B: Configurar domínio próprio (Recomendado)
1. No Resend, vá em **"Domains"**
2. Clique em **"Add Domain"**
3. Digite seu domínio (ex: `drderm.com`)
4. Siga as instruções para configurar DNS:
   - Adicione os registros SPF, DKIM no seu provedor de DNS
5. Aguarde a verificação (pode levar alguns minutos)
6. Use: `noreply@seudominio.com`

### 4. Configurar Variáveis no Netlify

1. Acesse: https://app.netlify.com
2. Selecione seu site (drderm)
3. Vá em **Site settings** (engrenagem no topo)
4. Clique em **Environment variables** (menu lateral)
5. Adicione as variáveis:

#### Variável 1:
- **Key**: `RESEND_API_KEY`
- **Value**: Cole a API Key que você copiou (ex: `re_abc123xyz456...`)
- Clique em **"Save"**

#### Variável 2:
- **Key**: `RESEND_FROM_EMAIL`
- **Value**: O email remetente (ex: `onboarding@resend.dev` ou `noreply@seudominio.com`)
- Clique em **"Save"**

### 5. Fazer Deploy

Após adicionar as variáveis:

1. Vá em **Deploys** (menu superior)
2. Clique nos **"..."** do último deploy
3. Selecione **"Trigger deploy"** > **"Clear cache and deploy site"**
4. Ou faça um commit/push para trigger automático

### 6. Testar

1. Acesse sua página de login
2. Clique em **"Esqueceu sua senha?"**
3. Digite um email cadastrado
4. Clique em **"Enviar Senha"**
5. Verifique o email recebido (verifique também a pasta de spam)

## 🔍 Verificar se está Funcionando

### Logs do Netlify:
1. Vá em **Site settings** > **Functions**
2. Clique em **"View logs"**
3. Procure por: `Email enviado com sucesso via Resend`

### Logs do Resend:
1. No painel do Resend, vá em **"Emails"**
2. Você verá todos os emails enviados
3. Status: "Delivered" = sucesso

## ❌ Problemas Comuns

### "Email não está sendo enviado"
- ✅ Verifique se as variáveis estão configuradas no Netlify
- ✅ Verifique se fez o deploy após adicionar as variáveis
- ✅ Verifique os logs do Netlify Functions
- ✅ Verifique se o email remetente está verificado no Resend

### "Erro de autenticação"
- ✅ Verifique se a API Key está correta
- ✅ Verifique se a API Key tem permissão "Sending access"
- ✅ Verifique se não há espaços antes/depois da API Key

### "Emails indo para spam"
- ✅ Configure um domínio próprio no Resend
- ✅ Configure os registros SPF, DKIM, DMARC
- ✅ Use um email remetente verificado
- ✅ Evite palavras como "spam", "grátis", etc.

## 📊 Limites do Plano Gratuito

- ✅ **3.000 emails por mês**
- ✅ **100 emails por dia**
- ✅ **10 requisições por segundo**

## 💰 Upgrade (Opcional)

Se precisar de mais emails:
- Acesse o Resend > **Billing**
- Escolha um plano (a partir de $20/mês)

## 📚 Documentação

- Resend Docs: https://resend.com/docs
- Resend API: https://resend.com/docs/api-reference/emails/send-email

## 🆘 Suporte

- Email do Resend: support@resend.com
- Docs do Resend: https://resend.com/docs

---

## ✅ Checklist

- [ ] Conta criada no Resend
- [ ] API Key obtida
- [ ] Email remetente configurado
- [ ] Variáveis adicionadas no Netlify (`RESEND_API_KEY` e `RESEND_FROM_EMAIL`)
- [ ] Deploy feito após adicionar variáveis
- [ ] Teste realizado com sucesso

---

**Pronto!** Após seguir estes passos, os emails de recuperação de senha serão enviados automaticamente para os usuários. 🎉

