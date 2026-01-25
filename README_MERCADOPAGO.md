# Integração Mercado Pago - DrDerm

## Configuração

### 1. Variáveis de Ambiente Necessárias

Configure as seguintes variáveis de ambiente no Netlify:

```
MERCADOPAGO_ACCESS_TOKEN=seu_access_token_de_producao
MERCADOPAGO_PUBLIC_KEY=sua_public_key_de_producao
SITE_URL=https://drdermofc.netlify.app
```

### 2. Obter Credenciais do Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers
2. Faça login na sua conta
3. Vá em "Suas integrações" > "Criar aplicação"
4. Copie o **Access Token** (produção) e a **Public Key**
5. Configure no Netlify: Site settings > Environment variables

### 3. Instalar Dependências

```bash
npm install
```

### 4. Configurar Webhook (Opcional mas Recomendado)

1. No painel do Mercado Pago, vá em "Webhooks"
2. Configure a URL: `https://drdermofc.netlify.app/.netlify/functions/mercado-pago-webhook`
3. Selecione os eventos: `payment`

## Funcionalidades Implementadas

### ✅ Cartão de Crédito
- Formulário seguro integrado
- Suporte a parcelamento (até 12x)
- Validação em tempo real

### ✅ PIX
- Geração de QR Code
- Código PIX copiável
- Aprovação instantânea

### ✅ Boleto Bancário
- Geração automática
- Vencimento em 3 dias úteis
- Link para impressão

## Fluxo de Pagamento

1. **Cliente seleciona método de pagamento**
2. **Sistema cria preferência no Mercado Pago**
3. **Cliente completa pagamento**
4. **Mercado Pago processa pagamento**
5. **Webhook notifica sistema sobre status**
6. **Sistema atualiza estoque e finaliza pedido**

## Estrutura de Arquivos

```
netlify/functions/
├── mercado-pago-preference.js  # Cria preferências de pagamento
└── mercado-pago-webhook.js    # Processa notificações

checkout.html                   # Interface de checkout integrada
```

## Segurança

- ✅ Tokens armazenados em variáveis de ambiente
- ✅ Autenticação via Supabase
- ✅ Validação de dados no backend
- ✅ HTTPS obrigatório
- ✅ CSP configurado

## Testes

### Modo Sandbox (Desenvolvimento)
Use as credenciais de teste do Mercado Pago:
- Cartão de teste: 5031 4332 1540 6351
- CVV: 123
- Validade: 11/25

### Modo Produção
Use credenciais reais após aprovação da conta Mercado Pago.

## Suporte

Para dúvidas sobre a integração:
- Documentação: https://www.mercadopago.com.br/developers/pt/docs
- Suporte Mercado Pago: https://www.mercadopago.com.br/developers/pt/support


