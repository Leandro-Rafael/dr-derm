# Como Obter Credenciais do Mercado Pago - Passo a Passo

## 📋 Pré-requisitos

1. Ter uma conta no Mercado Pago (se não tiver, crie em: https://www.mercadopago.com.br/)
2. Ter acesso ao painel de desenvolvedores do Mercado Pago

---

## 🔑 Passo 1: Acessar o Painel de Desenvolvedores

1. Acesse: **https://www.mercadopago.com.br/developers**
2. Faça login com sua conta do Mercado Pago
3. Você será redirecionado para o painel de desenvolvedores

---

## 🆕 Passo 2: Criar uma Aplicação (Se ainda não tiver)

### 2.1. Criar Nova Aplicação

1. No painel, clique em **"Suas integrações"** ou **"Aplicações"**
2. Clique no botão **"Criar aplicação"** ou **"Nova aplicação"**
3. Preencha os dados:
   - **Nome da aplicação**: Ex: "DrDerm E-commerce"
   - **Descrição**: Ex: "Sistema de e-commerce para produtos dermatológicos"
   - **Tipo**: Selecione **"Marketplace"** ou **"E-commerce"**
   - **URL de retorno**: `https://drdermofc.netlify.app/checkout.html`
   - **URL de cancelamento**: `https://drdermofc.netlify.app/checkout.html`
4. Clique em **"Criar"**

### 2.2. Ou Usar Aplicação Existente

Se você já tem uma aplicação criada:
1. Vá em **"Suas integrações"**
2. Clique na aplicação que deseja usar

---

## 🔐 Passo 3: Obter o Access Token (Token de Produção)

### 3.1. Localizar as Credenciais

1. Dentro da sua aplicação, procure pela seção **"Credenciais"** ou **"Chaves"**
2. Você verá duas opções:
   - **Credenciais de teste** (Sandbox) - para testes
   - **Credenciais de produção** - para uso real ⚠️ **USE ESTA**

### 3.2. Copiar o Access Token de Produção

1. Na seção **"Credenciais de produção"**, encontre o campo:
   - **"Access Token"** ou **"Token de acesso"**
2. Clique no botão **"Copiar"** ou **"Revelar"** ao lado do token
3. **IMPORTANTE**: Copie o token completo (é uma string longa)

**Exemplo de como o token se parece:**
```
APP_USR-1234567890123456-123456-abcdef1234567890abcdef1234567890abcdef12-123456789
```

⚠️ **ATENÇÃO**: 
- Nunca compartilhe este token publicamente
- Use apenas o token de **PRODUÇÃO** (não o de teste)
- Guarde este token em local seguro

---

## 🔑 Passo 4: Obter a Public Key (Opcional - para formulários de cartão)

1. Na mesma seção de **"Credenciais de produção"**
2. Encontre o campo **"Public Key"** ou **"Chave pública"**
3. Copie esta chave também (ela começa com `APP_USR-`)

**Nota**: A Public Key é necessária apenas se você quiser integrar formulários de cartão diretamente no seu site. Como estamos usando a página de checkout do Mercado Pago, ela não é obrigatória.

---

## 🌐 Passo 5: Configurar no Netlify

### 5.1. Acessar Configurações do Netlify

1. Acesse: **https://app.netlify.com/projects/drdermofc/configuration/env**
2. Ou vá em: **Site settings** > **Environment variables**

### 5.2. Adicionar Variáveis de Ambiente

Clique em **"Add a variable"** e adicione:

#### Variável 1: MERCADOPAGO_ACCESS_TOKEN
- **Key**: `MERCADOPAGO_ACCESS_TOKEN`
- **Value**: Cole o Access Token que você copiou no Passo 3
- **Scopes**: Selecione **"Production"** (e "Deploy previews" se quiser testar)

#### Variável 2: SITE_URL
- **Key**: `SITE_URL`
- **Value**: `https://drdermofc.netlify.app`
- **Scopes**: Selecione **"Production"**

### 5.3. Salvar

1. Clique em **"Save"** ou **"Add variable"**
2. Aguarde alguns segundos para as variáveis serem aplicadas

---

## 🔔 Passo 6: Configurar Webhook (Opcional mas Recomendado)

### 6.1. Acessar Configurações de Webhook

1. No painel do Mercado Pago, vá em **"Webhooks"** ou **"Notificações"**
2. Clique em **"Criar webhook"** ou **"Adicionar URL"**

### 6.2. Configurar Webhook

1. **URL do webhook**: 
   ```
   https://drdermofc.netlify.app/.netlify/functions/mercado-pago-webhook
   ```

2. **Eventos para receber notificações**:
   - ✅ Marque: **"payment"** (pagamentos)
   - ✅ Marque: **"payment.updated"** (atualizações de pagamento)

3. **Versão da API**: Selecione a versão mais recente (geralmente v1)

4. Clique em **"Salvar"** ou **"Criar"**

### 6.3. Testar Webhook (Opcional)

O Mercado Pago pode enviar um teste de webhook. Verifique os logs do Netlify para confirmar que está funcionando.

---

## ✅ Verificação Final

### Checklist de Configuração

- [ ] Access Token de produção copiado
- [ ] Variável `MERCADOPAGO_ACCESS_TOKEN` configurada no Netlify
- [ ] Variável `SITE_URL` configurada no Netlify
- [ ] Webhook configurado (opcional)
- [ ] Deploy realizado com sucesso

---

## 🧪 Testar a Integração

### Modo Sandbox (Teste)

Para testar sem usar dinheiro real:

1. Use as **Credenciais de teste** do Mercado Pago
2. Configure `MERCADOPAGO_ACCESS_TOKEN` com o token de teste temporariamente
3. Use cartões de teste:
   - **Cartão aprovado**: `5031 4332 1540 6351`
   - **CVV**: `123`
   - **Validade**: `11/25`
   - **Nome**: Qualquer nome
   - **CPF**: Qualquer CPF válido

### Modo Produção

1. Use as **Credenciais de produção**
2. Configure `MERCADOPAGO_ACCESS_TOKEN` com o token de produção
3. Teste com valores pequenos primeiro

---

## 🆘 Problemas Comuns

### "Token inválido"
- Verifique se copiou o token completo
- Certifique-se de estar usando o token de **PRODUÇÃO** (não teste)
- Verifique se não há espaços antes ou depois do token

### "Webhook não está funcionando"
- Verifique se a URL está correta
- Verifique se o evento "payment" está marcado
- Verifique os logs do Netlify em: https://app.netlify.com/projects/drdermofc/logs/functions

### "Não consigo criar aplicação"
- Verifique se sua conta do Mercado Pago está verificada
- Algumas contas precisam de verificação adicional para criar aplicações
- Entre em contato com o suporte do Mercado Pago se necessário

---

## 📞 Suporte

- **Documentação Mercado Pago**: https://www.mercadopago.com.br/developers/pt/docs
- **Suporte Mercado Pago**: https://www.mercadopago.com.br/developers/pt/support
- **Logs do Netlify**: https://app.netlify.com/projects/drdermofc/logs/functions

---

## 🔒 Segurança

⚠️ **IMPORTANTE**:
- Nunca compartilhe seu Access Token
- Não commite tokens no Git
- Use apenas variáveis de ambiente no Netlify
- Revogue tokens comprometidos imediatamente
- Use HTTPS sempre (já configurado no Netlify)

---

## 📝 Resumo Rápido

1. **Acesse**: https://www.mercadopago.com.br/developers
2. **Crie/Selecione** uma aplicação
3. **Copie** o Access Token de **PRODUÇÃO**
4. **Configure** no Netlify: `MERCADOPAGO_ACCESS_TOKEN` = seu token
5. **Configure** no Netlify: `SITE_URL` = `https://drdermofc.netlify.app`
6. **Pronto!** A integração está configurada


