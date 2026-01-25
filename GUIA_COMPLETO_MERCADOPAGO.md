# 🚀 Guia Completo: Como Obter Credenciais do Mercado Pago do Zero

Este guia vai te ajudar desde a criação da conta até a configuração completa no Netlify.

---

## 📝 PARTE 1: Criar Conta no Mercado Pago

### Passo 1.1: Acessar o Site do Mercado Pago

1. Abra seu navegador e acesse: **https://www.mercadopago.com.br/**
2. Clique no botão **"Criar conta"** ou **"Cadastre-se"** (geralmente no canto superior direito)

### Passo 1.2: Preencher Dados de Cadastro

Você precisará fornecer:
- **E-mail** (use um e-mail que você tenha acesso)
- **Senha** (crie uma senha forte)
- **Nome completo**
- **CPF**
- **Data de nascimento**
- **Telefone** (para verificação)

### Passo 1.3: Verificar E-mail e Telefone

1. Verifique seu e-mail e clique no link de confirmação
2. Digite o código enviado por SMS no seu telefone
3. Complete o cadastro

### Passo 1.4: Completar Perfil (Opcional mas Recomendado)

Para usar em produção, você precisará:
- Adicionar dados bancários (para receber pagamentos)
- Verificar identidade (foto de documento)
- Configurar dados fiscais

**Nota**: Para testes, você pode pular esta etapa e usar o modo Sandbox.

---

## 🔧 PARTE 2: Acessar o Painel de Desenvolvedores

### Passo 2.1: Acessar Developers

1. Acesse: **https://www.mercadopago.com.br/developers**
2. Faça login com a conta que você acabou de criar
3. Você será redirecionado para o painel de desenvolvedores

### Passo 2.2: Navegar no Painel

Você verá opções como:
- **"Suas integrações"** ou **"Aplicações"**
- **"Credenciais"**
- **"Webhooks"**

---

## 🆕 PARTE 3: Criar uma Aplicação

### Passo 3.1: Criar Nova Aplicação

1. No painel, clique em **"Suas integrações"** ou **"Aplicações"**
2. Clique no botão **"Criar aplicação"** ou **"Nova aplicação"** ou **"Criar"**

### Passo 3.2: Preencher Dados da Aplicação

Preencha o formulário com:

**Nome da aplicação:**
```
DrDerm E-commerce
```

**Descrição:**
```
Sistema de e-commerce para produtos dermatológicos
```

**Tipo de integração:**
- Selecione **"Marketplace"** ou **"E-commerce"** ou **"Loja online"**

**URLs de retorno:**
- **URL de sucesso**: `https://drdermofc.netlify.app/checkout.html?status=success`
- **URL de falha**: `https://drdermofc.netlify.app/checkout.html?status=failure`
- **URL pendente**: `https://drdermofc.netlify.app/checkout.html?status=pending`

**Nota**: Se não houver campos separados, use apenas:
- **URL de retorno**: `https://drdermofc.netlify.app/checkout.html`

### Passo 3.3: Salvar Aplicação

1. Clique em **"Criar"** ou **"Salvar"**
2. Aguarde a confirmação
3. Você será redirecionado para a página da aplicação

---

## 🔑 PARTE 4: Obter as Credenciais (Access Token)

### Passo 4.1: Localizar Credenciais

1. Dentro da página da sua aplicação, procure por:
   - **"Credenciais"** ou **"Chaves"** ou **"Keys"**
   - Ou uma aba chamada **"Credenciais"**

### Passo 4.2: Escolher Tipo de Credencial

Você verá duas opções:

#### 🔵 Credenciais de TESTE (Sandbox)
- Use para **testar** sem usar dinheiro real
- Cartões de teste disponíveis
- Não processa pagamentos reais

#### 🟢 Credenciais de PRODUÇÃO
- Use para **receber pagamentos reais**
- Processa transações verdadeiras
- ⚠️ **USE ESTA PARA PRODUÇÃO**

### Passo 4.3: Copiar o Access Token

1. Na seção **"Credenciais de PRODUÇÃO"**, encontre:
   - **"Access Token"** ou **"Token de acesso"** ou **"Production Access Token"**

2. Clique no botão:
   - **"Copiar"** ou **"Revelar"** ou **"Show"** ou ícone de copiar 📋

3. **Copie o token completo** (é uma string longa que começa com `APP_USR-`)

**Exemplo de como o token se parece:**
```
APP_USR-1234567890123456-123456-abcdef1234567890abcdef1234567890abcdef12-123456789
```

⚠️ **ATENÇÃO**: 
- O token é muito longo, certifique-se de copiar tudo
- Não compartilhe este token publicamente
- Guarde em local seguro

### Passo 4.4: Guardar o Token Temporariamente

Cole o token em um arquivo de texto ou bloco de notas temporariamente. Você vai precisar dele no próximo passo.

---

## 🌐 PARTE 5: Configurar no Netlify

### Passo 5.1: Acessar Netlify

1. Acesse: **https://app.netlify.com/**
2. Faça login na sua conta
3. Selecione o projeto: **drdermofc**

### Passo 5.2: Ir para Variáveis de Ambiente

1. No menu lateral, clique em **"Site settings"** ou **"Configurações do site"**
2. Role para baixo e clique em **"Environment variables"** ou **"Variáveis de ambiente"**
3. Ou acesse diretamente: **https://app.netlify.com/projects/drdermofc/configuration/env**

### Passo 5.3: Adicionar Primeira Variável

1. Clique no botão **"Add a variable"** ou **"Adicionar variável"**

2. Preencha:
   - **Key** (Chave): `MERCADOPAGO_ACCESS_TOKEN`
   - **Value** (Valor): Cole o Access Token que você copiou no Passo 4.3
   - **Scopes** (Escopos): 
     - ✅ Marque **"Production"**
     - ✅ Marque **"Deploy previews"** (opcional, para testar)

3. Clique em **"Add"** ou **"Salvar"**

### Passo 5.4: Adicionar Segunda Variável

1. Clique novamente em **"Add a variable"**

2. Preencha:
   - **Key**: `SITE_URL`
   - **Value**: `https://drdermofc.netlify.app`
   - **Scopes**: 
     - ✅ Marque **"Production"**

3. Clique em **"Add"** ou **"Salvar"**

### Passo 5.5: Verificar Variáveis

Você deve ver duas variáveis listadas:
- ✅ `MERCADOPAGO_ACCESS_TOKEN` (com valor oculto)
- ✅ `SITE_URL` = `https://drdermofc.netlify.app`

---

## 🔔 PARTE 6: Configurar Webhook (Opcional mas Recomendado)

### Passo 6.1: Voltar ao Painel do Mercado Pago

1. Acesse: **https://www.mercadopago.com.br/developers**
2. Vá para sua aplicação
3. Procure por **"Webhooks"** ou **"Notificações"** ou **"IPN"**

### Passo 6.2: Criar Webhook

1. Clique em **"Criar webhook"** ou **"Adicionar URL"** ou **"Nova URL"**

2. Preencha:
   - **URL do webhook**: 
     ```
     https://drdermofc.netlify.app/.netlify/functions/mercado-pago-webhook
     ```
   
   - **Eventos** (marque os que deseja receber):
     - ✅ **payment** (pagamentos)
     - ✅ **payment.updated** (atualizações de pagamento)

3. Clique em **"Salvar"** ou **"Criar"**

### Passo 6.3: Verificar Webhook

O Mercado Pago pode enviar um teste. Verifique se aparece como "ativo" ou "funcionando".

---

## ✅ PARTE 7: Verificação e Teste

### Checklist de Configuração

Marque cada item conforme completar:

- [ ] Conta criada no Mercado Pago
- [ ] Aplicação criada no painel de desenvolvedores
- [ ] Access Token de produção copiado
- [ ] Variável `MERCADOPAGO_ACCESS_TOKEN` adicionada no Netlify
- [ ] Variável `SITE_URL` adicionada no Netlify
- [ ] Webhook configurado (opcional)
- [ ] Deploy realizado

### Testar a Integração

#### Modo Teste (Sandbox)

Para testar sem usar dinheiro real:

1. Use as **Credenciais de TESTE** temporariamente
2. Configure `MERCADOPAGO_ACCESS_TOKEN` no Netlify com o token de teste
3. Use cartões de teste do Mercado Pago:
   - **Cartão aprovado**: `5031 4332 1540 6351`
   - **CVV**: `123`
   - **Validade**: `11/25`
   - **Nome**: Qualquer nome
   - **CPF**: Qualquer CPF válido (ex: 12345678900)

#### Modo Produção

1. Use as **Credenciais de PRODUÇÃO**
2. Configure `MERCADOPAGO_ACCESS_TOKEN` com o token de produção
3. Teste com valores pequenos primeiro (ex: R$ 1,00)

---

## 🆘 Problemas Comuns e Soluções

### ❌ "Não consigo criar conta"

**Solução:**
- Verifique se você não já tem uma conta com esse e-mail
- Tente usar outro e-mail
- Verifique se preencheu todos os campos obrigatórios

### ❌ "Não consigo criar aplicação"

**Solução:**
- Verifique se sua conta está verificada
- Algumas contas precisam completar o perfil primeiro
- Entre em contato com o suporte: https://www.mercadopago.com.br/developers/pt/support

### ❌ "Não encontro as credenciais"

**Solução:**
- Certifique-se de estar dentro da página da sua aplicação
- Procure por abas: "Credenciais", "Chaves", "Keys", "API"
- Se não encontrar, tente criar uma nova aplicação

### ❌ "Token inválido"

**Solução:**
- Verifique se copiou o token completo (é muito longo)
- Certifique-se de não ter espaços antes ou depois
- Use o token de **PRODUÇÃO** (não o de teste)
- Verifique se não copiou caracteres extras

### ❌ "Webhook não funciona"

**Solução:**
- Verifique se a URL está correta
- Certifique-se de que o evento "payment" está marcado
- Verifique os logs do Netlify: https://app.netlify.com/projects/drdermofc/logs/functions

---

## 📞 Links Úteis

- **Criar conta**: https://www.mercadopago.com.br/
- **Painel de desenvolvedores**: https://www.mercadopago.com.br/developers
- **Documentação**: https://www.mercadopago.com.br/developers/pt/docs
- **Suporte**: https://www.mercadopago.com.br/developers/pt/support
- **Netlify - Variáveis**: https://app.netlify.com/projects/drdermofc/configuration/env
- **Netlify - Logs**: https://app.netlify.com/projects/drdermofc/logs/functions

---

## 🔒 Segurança

⚠️ **IMPORTANTE - Leia com atenção:**

- ✅ **NUNCA** compartilhe seu Access Token publicamente
- ✅ **NUNCA** commite tokens no Git/GitHub
- ✅ Use **APENAS** variáveis de ambiente no Netlify
- ✅ Se suspeitar que o token foi comprometido, **revogue imediatamente** no painel do Mercado Pago
- ✅ Use HTTPS sempre (já configurado no Netlify)
- ✅ Guarde o token em local seguro (gerenciador de senhas)

---

## 📝 Resumo Rápido (Passo a Passo)

1. ✅ **Criar conta** em https://www.mercadopago.com.br/
2. ✅ **Acessar** https://www.mercadopago.com.br/developers
3. ✅ **Criar aplicação** (nome: "DrDerm E-commerce")
4. ✅ **Copiar Access Token** de PRODUÇÃO
5. ✅ **Configurar no Netlify**:
   - `MERCADOPAGO_ACCESS_TOKEN` = seu token
   - `SITE_URL` = `https://drdermofc.netlify.app`
6. ✅ **Configurar webhook** (opcional)
7. ✅ **Pronto!** A integração está configurada

---

## 💡 Dica Final

Se você está começando agora, recomendo:

1. **Primeiro**: Teste com credenciais de TESTE (Sandbox)
2. **Depois**: Quando estiver tudo funcionando, mude para PRODUÇÃO
3. **Sempre**: Teste com valores pequenos primeiro em produção

Boa sorte! 🚀

