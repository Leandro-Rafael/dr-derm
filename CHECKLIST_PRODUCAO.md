# Checklist de Preparação para Produção - DrDerm

## ✅ Alterações Realizadas

### 1. Segurança e Logs
- ✅ Removido toggle de validação de email desabilitada (EMAIL_VALIDATION_DISABLED)
- ✅ Removidos logs excessivos e sensíveis (especialmente senhas) das funções Netlify
- ✅ Logs condicionados para aparecer apenas em desenvolvimento (NODE_ENV === 'development')
- ✅ Removidos logs que expõem informações sensíveis como senhas

### 2. Dados e Código
- ✅ Removidos dados de teste hardcoded (featuredProducts) do index.html
- ✅ Carrossel React agora carrega produtos dinamicamente da API
- ✅ Limpeza do sitemap.xml (removida URL de teste)

### 3. Tratamento de Erros
- ✅ Melhorado tratamento de erros para não expor detalhes sensíveis em produção
- ✅ Mensagens de erro genéricas para usuários finais
- ✅ Detalhes de erro apenas em desenvolvimento

### 4. Configurações
- ✅ Criado helper de CORS (cors-headers.js) para configuração flexível
- ✅ Headers HTTP padronizados

## 📋 Configurações Necessárias no Netlify

### Variáveis de Ambiente Obrigatórias

1. **SUPABASE_URL**
   - URL do projeto Supabase
   - Exemplo: `https://xxxxx.supabase.co`

2. **SUPABASE_ANON_KEY**
   - Chave pública/anônima do Supabase
   - Exemplo: `eyJ...`

3. **RESEND_API_KEY** (Obrigatório para recuperação de senha)
   - Chave API do Resend
   - Obtenha em: https://resend.com

4. **RESEND_FROM_EMAIL** (Obrigatório para recuperação de senha)
   - Email remetente verificado no Resend
   - Exemplo: `noreply@drderm.com`

### Variáveis de Ambiente Opcionais

1. **ALLOWED_ORIGIN** (Opcional - para CORS)
   - Domínios permitidos separados por vírgula
   - Exemplo: `https://drderm.com,https://www.drderm.com`
   - Padrão: `*` (permite todos)

2. **NODE_ENV** (Recomendado)
   - Defina como `production` para produção
   - Isso desabilita logs detalhados

3. **ABSTRACT_API_KEY** ou **EMAIL_VALIDATION_API_KEY** (Opcional)
   - Para validação de email mais rigorosa
   - Se não configurado, usa validação básica

4. **MAILBOXVALIDATOR_API_KEY** (Opcional)
   - Alternativa para validação de email
   - Se não configurado, usa validação básica

## 🔒 Configurações de Segurança

### 1. Configurar CORS (Recomendado)
No Netlify, adicione a variável de ambiente:
```
ALLOWED_ORIGIN=https://seudominio.com,https://www.seudominio.com
```

### 2. Configurar Domínio no Resend
1. Acesse o painel do Resend
2. Adicione seu domínio
3. Configure os registros DNS (SPF, DKIM, DMARC)
4. Aguarde verificação

### 3. Verificar Headers de Segurança
Os headers HTTP já estão configurados nas funções:
- `Content-Type: application/json`
- `Access-Control-Allow-Origin` (configurável)
- `Access-Control-Allow-Headers`
- `Access-Control-Allow-Methods`

## 🚀 Passos Finais para Deploy

1. **Verificar Variáveis de Ambiente no Netlify**
   - Acesse: Netlify → Site settings → Environment variables
   - Confirme que todas as variáveis obrigatórias estão configuradas
   - Defina `NODE_ENV=production`

2. **Fazer Deploy**
   ```powershell
   cd C:\Users\Kelly\Desktop\drderm
   netlify deploy --prod
   ```

3. **Testar Funcionalidades Críticas**
   - ✅ Login de usuário
   - ✅ Cadastro de novo usuário
   - ✅ Recuperação de senha (verificar email)
   - ✅ Listagem de produtos
   - ✅ Adicionar ao carrinho
   - ✅ Perfil do usuário

4. **Verificar Logs**
   - Acesse: Netlify → Site settings → Functions → View logs
   - Verifique se não há erros críticos
   - Confirme que logs sensíveis não aparecem

## 📝 Notas Importantes

- **Logs**: Em produção, logs detalhados são desabilitados automaticamente quando `NODE_ENV=production`
- **Emails**: Certifique-se de que RESEND_API_KEY e RESEND_FROM_EMAIL estão configurados antes do deploy
- **CORS**: Por padrão, CORS está configurado como `*` (permite todos). Configure `ALLOWED_ORIGIN` para restringir
- **Validação de Email**: O sistema funciona sem APIs externas, usando validação básica. APIs são opcionais para validação mais rigorosa

## ⚠️ Avisos

- **Nunca** commite chaves de API no código
- **Nunca** logue senhas ou informações sensíveis
- **Sempre** use variáveis de ambiente para configurações sensíveis
- **Sempre** teste em produção antes de liberar para usuários finais





