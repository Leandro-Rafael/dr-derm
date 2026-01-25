# Instruções para Configurar Envio de Email com Resend

## Por que Resend?

O Resend é o serviço de email recomendado pelo Supabase e é fácil de integrar. Ele oferece:
- 3.000 emails gratuitos por mês
- API simples e rápida
- Boa taxa de entrega
- Integração fácil com Netlify

## Passo 1: Criar Conta no Resend

1. Acesse https://resend.com
2. Crie uma conta gratuita
3. Verifique seu email

## Passo 2: Configurar Domínio (Opcional mas Recomendado)

### Opção A: Usar domínio próprio (Recomendado para produção)
1. No painel do Resend, vá em "Domains"
2. Clique em "Add Domain"
3. Adicione seu domínio (ex: `drderm.com`)
4. Siga as instruções para configurar os registros DNS:
   - SPF
   - DKIM
   - DMARC (opcional)
5. Aguarde a verificação do domínio

### Opção B: Usar domínio do Resend (Para testes)
- Você pode usar `onboarding@resend.dev` temporariamente
- **Limitação**: Apenas para testes, não recomendado para produção

## Passo 3: Obter API Key

1. No painel do Resend, vá em "API Keys"
2. Clique em "Create API Key"
3. Dê um nome (ex: "Netlify DrDerm")
4. Selecione as permissões: "Sending access"
5. Copie a API Key (ela só aparece uma vez!)

## Passo 4: Configurar Variáveis de Ambiente no Netlify

1. Acesse o painel do Netlify: https://app.netlify.com
2. Selecione seu projeto (drderm)
3. Vá em **Site settings** > **Environment variables**
4. Adicione as seguintes variáveis:

### Variáveis Obrigatórias:
- `RESEND_API_KEY`: Cole a API Key que você copiou do Resend
- `RESEND_FROM_EMAIL`: O email remetente (ex: `noreply@drderm.com` ou `noreply@seudominio.com`)

### Como adicionar:
1. Clique em "Add a variable"
2. **Key**: `RESEND_API_KEY`
3. **Value**: Cole sua API Key do Resend
4. Clique em "Save"
5. Repita para `RESEND_FROM_EMAIL`

### Exemplo:
```
RESEND_API_KEY = re_abc123xyz456...
RESEND_FROM_EMAIL = noreply@drderm.com
```

## Passo 5: Fazer Deploy

1. Após adicionar as variáveis de ambiente, faça um novo deploy
2. Ou force um redeploy nas configurações do Netlify

## Passo 6: Testar

1. Acesse a página de login
2. Clique em "Esqueceu sua senha?"
3. Digite um email cadastrado
4. Verifique se o email foi recebido (verifique também a pasta de spam)

## Troubleshooting

### Email não está sendo enviado
1. Verifique se as variáveis de ambiente estão configuradas corretamente
2. Verifique os logs do Netlify Functions (Site settings > Functions > View logs)
3. Verifique se o email remetente está verificado no Resend
4. Verifique a pasta de spam

### Erro de autenticação
- Verifique se a API Key está correta
- Verifique se a API Key não expirou
- Verifique se a API Key tem permissões de "Sending access"

### Emails indo para spam
- Configure um domínio próprio no Resend
- Configure os registros SPF, DKIM e DMARC
- Use um email remetente verificado
- Evite palavras-chave que podem ser consideradas spam

## Limites do Plano Gratuito

- 3.000 emails por mês
- 100 emails por dia
- API rate limit: 10 requisições por segundo

## Atualizar para Plano Pago (Opcional)

Se precisar de mais emails:
1. Acesse o painel do Resend
2. Vá em "Billing"
3. Escolha um plano que atenda suas necessidades

## Alternativas ao Resend

Se preferir usar outro serviço, você pode modificar a função `sendPasswordEmail` em `netlify/functions/auth-forgot-password.js` para usar:

- **SendGrid**: https://sendgrid.com
- **Mailgun**: https://www.mailgun.com
- **AWS SES**: https://aws.amazon.com/ses/
- **Postmark**: https://postmarkapp.com

## Suporte

- Documentação do Resend: https://resend.com/docs
- Suporte do Resend: support@resend.com

