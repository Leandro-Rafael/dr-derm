# Diferença Entre Email Validation e Email Reputation API

## ❌ NÃO SÃO A MESMA COISA!

### Email Validation API ✅ (A QUE VOCÊ PRECISA)
- **O que faz:** Verifica se um email é válido e pode receber mensagens
- **Verifica:**
  - Formato do email
  - Se o domínio existe
  - Se o servidor SMTP aceita o email
  - Se é email descartável/temporário
  - Deliverability (pode ser entregue?)
  
- **URL da API:** `https://emailvalidation.abstractapi.com/v1/`
- **Uso:** Para validar emails no cadastro

### Email Reputation API ❌ (NÃO É ISSO)
- **O que faz:** Verifica a reputação/reputação de spam de um domínio
- **Verifica:**
  - Score de spam
  - Blacklist
  - Reputação do domínio
  
- **URL da API:** `https://emailreputation.abstractapi.com/v1/`
- **Uso:** Para verificar se um domínio está em listas negras

## Como Encontrar a API Correta

### 1. Via Dashboard da Abstract API
1. Acesse: https://app.abstractapi.com/
2. Faça login
3. No menu lateral, procure por **"Email Validation"** (não Reputation)
4. Clique em **"Email Validation API"**

### 2. Via URL Direta
- Email Validation: https://www.abstractapi.com/api/email-validation
- Dashboard Email Validation: https://app.abstractapi.com/api/email-validation

### 3. Como Saber se É a Certa
- ✅ **Email Validation API** = API certa
- ❌ **Email Reputation API** = API errada
- ✅ URL contém `emailvalidation` = Certa
- ❌ URL contém `emailreputation` = Errada

## Sua Chave da API

Quando você estiver na página **Email Validation API**, você verá:
- Sua **API Key** (32 caracteres)
- Status: Ativa/Inativa
- Usage: Quantas requisições usou no mês

**Essa é a chave que você precisa usar!**

## Teste da Chave

Para testar se está usando a chave correta:

✅ **Email Validation API:**
```
https://emailvalidation.abstractapi.com/v1/?api_key=SUA_CHAVE&email=test@gmail.com
```
Deve retornar JSON com informações de validação.

❌ **Email Reputation API (não funciona):**
```
https://emailreputation.abstractapi.com/v1/?api_key=SUA_CHAVE&email=test@gmail.com
```
Isso não vai funcionar para validação de email!

## Resumo

- **Use:** Email Validation API ✅
- **Não use:** Email Reputation API ❌
- **Seu código já está configurado para:** Email Validation API ✅

