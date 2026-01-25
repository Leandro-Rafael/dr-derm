# 🚀 Configurar Domínio para Produção no Resend

## ✅ Status Atual

- ✅ Email funcionando com `rafaelgzzzz1@gmail.com`
- ✅ Variáveis configuradas no Netlify
- ✅ Resend funcionando corretamente
- 🎯 Próximo passo: Configurar domínio próprio para enviar para qualquer email

---

## 📋 Passo a Passo Completo

### Passo 1: Verificar se Você Tem um Domínio

#### Se você JÁ TEM um domínio:
- Pule para o **Passo 2**

#### Se você NÃO TEM um domínio:
- Siga o **Passo 1.1** para comprar

---

### Passo 1.1: Comprar Domínio (se necessário)

#### Opções de Provedores:

##### Opção A: Registro.br (Brasil - Recomendado)
1. Acesse: https://registro.br
2. Pesquise o domínio desejado (ex: `drderm.com.br`)
3. Adicione ao carrinho e finalize a compra
4. **Custo**: A partir de R$ 40/ano
5. **Vantagem**: Domínio brasileiro (.com.br)

##### Opção B: Namecheap (Internacional)
1. Acesse: https://namecheap.com
2. Pesquise o domínio desejado (ex: `drderm.com`)
3. Adicione ao carrinho e finalize a compra
4. **Custo**: A partir de $10/ano
5. **Vantagem**: Domínio internacional (.com)

##### Opção C: Cloudflare (Internacional)
1. Acesse: https://cloudflare.com
2. Registre um domínio
3. **Custo**: Preços justos
5. **Vantagem**: Integração fácil com outros serviços

#### Após Comprar:
- Aguarde a ativação (geralmente instantâneo)
- Você receberá acesso ao painel de DNS

---

### Passo 2: Adicionar Domínio no Resend

#### 2.1. Acessar Resend
1. Acesse: https://resend.com
2. Faça login na sua conta

#### 2.2. Acessar Domains
1. No menu lateral esquerdo, clique em **"Domains"** (Domínios)
2. Você verá uma lista de domínios (provavelmente vazia)

#### 2.3. Adicionar Novo Domínio
1. Clique no botão **"Add Domain"** (Adicionar Domínio)
2. Digite seu domínio (ex: `drderm.com.br`)
   - ⚠️ **IMPORTANTE**: 
     - ❌ NÃO coloque `www.`
     - ❌ NÃO coloque `http://` ou `https://`
     - ✅ Use apenas: `drderm.com.br` ou `drderm.com`
3. Clique em **"Add"** (Adicionar)

#### 2.4. Ver Registros DNS
Após adicionar, o Resend mostrará uma página com os registros DNS que você precisa configurar.

**Você verá algo assim:**

```
┌─────────────────────────────────────────┐
│ Domain: drderm.com.br                   │
│ Status: Pending                         │
├─────────────────────────────────────────┤
│ Registros DNS necessários:              │
│                                         │
│ Tipo: TXT                               │
│ Nome: @                                 │
│ Valor: v=spf1 include:resend.com ~all   │
│                                         │
│ Tipo: CNAME                             │
│ Nome: resend._domainkey                 │
│ Valor: resend._domainkey.resend.com     │
│                                         │
│ Tipo: TXT (Opcional)                    │
│ Nome: _dmarc                            │
│ Valor: v=DMARC1; p=none;                │
└─────────────────────────────────────────┘
```

**IMPORTANTE**: Anote ou copie esses registros! Você vai precisar deles no próximo passo.

---

### Passo 3: Configurar Registros DNS

#### 3.1. Acessar Provedor de DNS

##### Se você comprou no Registro.br:
1. Acesse: https://registro.br
2. Faça login
3. Vá em **"Meus Domínios"**
4. Clique no seu domínio
5. Vá em **"DNS"** ou **"Zona DNS"**

##### Se você comprou no Namecheap:
1. Acesse: https://namecheap.com
2. Faça login
3. Vá em **"Domain List"**
4. Clique em **"Manage"** ao lado do domínio
5. Vá em **"Advanced DNS"**

##### Se você comprou no Cloudflare:
1. Acesse: https://dash.cloudflare.com
2. Faça login
3. Selecione seu domínio
4. Vá em **"DNS"** > **"Records"**

##### Se você usa outro provedor:
1. Acesse o painel do seu provedor
2. Encontre a seção de **"DNS"** ou **"Zona DNS"**
3. Selecione seu domínio

#### 3.2. Adicionar Registro SPF (TXT)

1. Clique em **"Add Record"** ou **"Adicionar Registro"**
2. Configure:
   - **Tipo**: `TXT`
   - **Nome/Host**: `@` (ou deixe em branco, dependendo do provedor)
   - **Valor**: `v=spf1 include:resend.com ~all`
   - **TTL**: `3600` (ou padrão)
3. Clique em **"Save"** ou **"Salvar"**

#### 3.3. Adicionar Registro DKIM (CNAME)

1. Clique em **"Add Record"** ou **"Adicionar Registro"**
2. Configure:
   - **Tipo**: `CNAME`
   - **Nome/Host**: `resend._domainkey` (ou `resend._domainkey.drderm.com.br`)
   - **Valor**: `resend._domainkey.resend.com`
   - **TTL**: `3600` (ou padrão)
3. Clique em **"Save"** ou **"Salvar"**

#### 3.4. Adicionar Registro DMARC (TXT) - Opcional mas Recomendado

1. Clique em **"Add Record"** ou **"Adicionar Registro"**
2. Configure:
   - **Tipo**: `TXT`
   - **Nome/Host**: `_dmarc` (ou `_dmarc.drderm.com.br`)
   - **Valor**: `v=DMARC1; p=none;`
   - **TTL**: `3600` (ou padrão)
3. Clique em **"Save"** ou **"Salvar"**

#### 3.5. Verificar Registros Adicionados

Você deve ver 3 registros (ou 2, se não adicionou DMARC):
- ✅ TXT para SPF
- ✅ CNAME para DKIM
- ✅ TXT para DMARC (opcional)

---

### Passo 4: Aguardar Propagação DNS

#### 4.1. Entender Propagação DNS
- Após adicionar os registros DNS, eles precisam **propagar** pela internet
- Isso pode levar de **alguns minutos a 24 horas**
- Geralmente leva **15-30 minutos**

#### 4.2. Verificar Propagação (Opcional)
Você pode verificar se os registros foram propagados usando:

1. **MXToolbox**: https://mxtoolbox.com
   - Digite seu domínio
   - Selecione "TXT Lookup" ou "CNAME Lookup"
   - Verifique se os registros aparecem

2. **DNS Checker**: https://dnschecker.org
   - Digite seu domínio
   - Selecione o tipo de registro (TXT, CNAME)
   - Verifique se aparece globalmente

---

### Passo 5: Verificar Domínio no Resend

#### 5.1. Acessar Resend
1. Acesse: https://resend.com
2. Faça login
3. Vá em **"Domains"**

#### 5.2. Verificar Status
1. Você verá seu domínio na lista
2. O status pode ser:
   - **"Pending"** (Pendente) = Aguardando verificação
   - **"Verified"** (Verificado) = Pronto para usar ✅

#### 5.3. Aguardar Verificação
1. O Resend verifica automaticamente os registros DNS
2. Aguarde até o status mudar para **"Verified"**
3. Pode levar alguns minutos após a propagação DNS

#### 5.4. Se Não Verificar
1. Verifique se os registros DNS estão corretos
2. Verifique se a propagação DNS terminou
3. Aguarde mais alguns minutos
4. Se ainda não verificar, verifique os registros novamente

---

### Passo 6: Atualizar Variável no Netlify

#### 6.1. Acessar Netlify
1. Acesse: https://app.netlify.com
2. Faça login
3. Selecione seu site

#### 6.2. Acessar Environment Variables
1. Vá em: **Site settings** > **Environment variables**
2. Você verá as variáveis existentes

#### 6.3. Atualizar RESEND_FROM_EMAIL
1. Encontre a variável `RESEND_FROM_EMAIL`
2. Clique em **"Edit"** (Editar) ou no ícone de lápis
3. Altere o valor de:
   ```
   onboarding@resend.dev
   ```
   Para:
   ```
   noreply@drderm.com.br
   ```
   - ⚠️ **IMPORTANTE**: 
     - Use o domínio que você verificou no Resend
     - Pode ser: `noreply@`, `contato@`, `suporte@`, etc.
     - Exemplos:
       - `noreply@drderm.com.br`
       - `contato@drderm.com.br`
       - `suporte@drderm.com.br`
4. Clique em **"Save"** ou **"Salvar"**

#### 6.4. Verificar Variável Atualizada
Você deve ver:
- ✅ `RESEND_FROM_EMAIL` = `noreply@drderm.com.br` (ou seu domínio)

---

### Passo 7: Fazer Deploy

#### 7.1. Por Que Fazer Deploy?
- As variáveis de ambiente só são aplicadas após um novo deploy
- O código atual ainda está usando `onboarding@resend.dev`

#### 7.2. Como Fazer Deploy

##### Opção A: Deploy Automático (se usar Git)
1. Faça um commit e push no seu repositório
2. O Netlify fará o deploy automaticamente

##### Opção B: Deploy Manual
1. No Netlify, vá em **"Deploys"** (menu superior)
2. Clique nos **3 pontos** (...) do último deploy
3. Selecione **"Trigger deploy"** > **"Clear cache and deploy site"**
4. Aguarde o deploy terminar (pode levar 1-2 minutos)

---

### Passo 8: Testar

#### 8.1. Testar com Qualquer Email
1. Acesse sua página de login
2. Clique em **"Esqueceu sua senha?"**
3. Digite qualquer email cadastrado (não precisa ser o seu)
   - Exemplo: `leandro.101.rafael@gmail.com`
4. Clique em **"Enviar Senha"**

#### 8.2. Verificar Logs
1. No Netlify: **Logs** > **Functions** > `auth-forgot-password`
2. Deve aparecer:
   - ✅ `RESEND_FROM_EMAIL: noreply@drderm.com.br` (seu domínio)
   - ✅ `Email enviado com sucesso via Resend`
   - ✅ Sem erros 403

#### 8.3. Verificar Email
1. Verifique a caixa de entrada do email que você usou
2. Verifique a pasta de spam
3. O email deve chegar!
4. O remetente deve ser: `noreply@drderm.com.br` (seu domínio)

---

## ✅ Checklist Completo

### Configuração do Domínio:
- [ ] Domínio comprado (se necessário)
- [ ] Domínio adicionado no Resend
- [ ] Registro SPF (TXT) configurado no DNS
- [ ] Registro DKIM (CNAME) configurado no DNS
- [ ] Registro DMARC (TXT) configurado no DNS (opcional)
- [ ] Aguardou propagação DNS (15-30 minutos)
- [ ] Domínio verificado no Resend (status: "Verified")

### Configuração no Netlify:
- [ ] Variável `RESEND_FROM_EMAIL` atualizada
- [ ] Deploy feito após atualizar variável
- [ ] Teste realizado com sucesso
- [ ] Email recebido
- [ ] Remetente correto (seu domínio)

---

## 🐛 Troubleshooting

### Problema 1: "Domínio não verifica no Resend"
**Soluções:**
- Verifique se os registros DNS estão corretos
- Verifique se a propagação DNS terminou (aguarde mais tempo)
- Use ferramentas como MXToolbox para verificar os registros
- Verifique se não há erros de digitação nos registros

### Problema 2: "Ainda aparece erro 403"
**Soluções:**
- Verifique se o domínio está **"Verified"** no Resend
- Verifique se a variável `RESEND_FROM_EMAIL` está atualizada
- Verifique se fez o **deploy** após atualizar a variável
- Verifique se está usando o domínio correto no `from`

### Problema 3: "Email não chega"
**Soluções:**
- Verifique a pasta de spam
- Verifique se o email está cadastrado no banco de dados
- Verifique os logs do Netlify
- Verifique os logs do Resend (emails enviados)
- Aguarde alguns minutos (pode demorar)

---

## 📊 Comparação: Antes vs Depois

### Antes (Teste):
- ✅ Funciona apenas para `rafaelgzzzz1@gmail.com`
- ❌ Não funciona para outros emails
- ❌ Usa `onboarding@resend.dev`

### Depois (Produção):
- ✅ Funciona para qualquer email
- ✅ Usa seu domínio próprio
- ✅ Mais profissional
- ✅ Melhor entrega (menos spam)

---

## 🎯 Próximos Passos

1. **Comprar domínio** (se necessário)
2. **Adicionar domínio no Resend**
3. **Configurar registros DNS**
4. **Aguardar verificação**
5. **Atualizar variável no Netlify**
6. **Fazer deploy**
7. **Testar**

---

## 💡 Dicas

### Email Remetente Recomendado:
- `noreply@drderm.com.br` - Para emails automáticos (recomendado)
- `contato@drderm.com.br` - Para contato
- `suporte@drderm.com.br` - Para suporte

### Segurança:
- Não use `admin@` ou `administrador@` (pode receber spam)
- Use `noreply@` para emails automáticos
- Configure DMARC para melhor segurança

---

## 🆘 Precisa de Ajuda?

### Me Diga:
1. **Qual provedor de domínio você usa?** (Registro.br, Namecheap, etc.)
2. **Conseguiu adicionar o domínio no Resend?**
3. **Conseguiu configurar os registros DNS?**
4. **O domínio está verificado?** (status: "Verified")

Com essas informações, consigo ajudar melhor! 🚀

---

**Pronto!** Siga estes passos e você terá emails funcionando em produção! 🎉

