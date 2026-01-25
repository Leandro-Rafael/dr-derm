# Guia Simples: MailboxValidator API

## Por que MailboxValidator?
- ✅ **Mais simples** que Abstract API
- ✅ **Plano gratuito**: 100 verificações/mês
- ✅ **Fácil de obter chave**
- ✅ **Documentação clara**

## Passo 1: Criar Conta
1. Acesse: **https://www.mailboxvalidator.com/**
2. Clique em **"Sign Up Free"** ou **"Get Started"**
3. Preencha:
   - Email
   - Senha
   - Confirme senha
4. Clique em **"Sign Up"**

## Passo 2: Verificar Email
- Verifique sua caixa de entrada
- Clique no link de confirmação

## Passo 3: Obter API Key
1. Faça login em: https://www.mailboxvalidator.com/plans
2. Você verá sua **API Key** logo no topo da página
   - É uma string tipo: `XXXXXXXXXXXXXX`
   - Copie essa chave

## Passo 4: Testar a Chave
Teste no navegador (substitua SUA_CHAVE):
```
https://api.mailboxvalidator.com/v1/validation/single?email=test@gmail.com&key=SUA_CHAVE
```

Se retornar JSON com `status=true`, está funcionando! ✅

## Passo 5: Adicionar no Netlify
1. Netlify → Seu Projeto → Site settings → Environment variables
2. Adicione:
   - **Key:** `MAILBOXVALIDATOR_API_KEY`
   - **Value:** Sua chave copiada
3. Salve

## Passo 6: Fazer Deploy
```powershell
netlify deploy --prod
```

## Pronto! 🎉

A verificação de email vai usar MailboxValidator agora!

