# Template de Personalização - DrDerm

## 📝 Informações para Personalizar

Use este template para preencher as informações da sua empresa antes do deploy.

### 1. Informações da Empresa

```
Nome da Empresa: [SEU NOME AQUI]
CNPJ: [SEU CNPJ AQUI] (opcional)
Slogan: [SEU SLOGAN AQUI]
```

### 2. Informações de Contato

```
Email de Suporte: [seu-email@dominio.com]
Email Comercial: [comercial@dominio.com]
Telefone: [(XX) XXXX-XXXX]
WhatsApp: [(XX) XXXX-XXXX]
Endereço: [Seu endereço completo] (opcional)
```

### 3. Horários de Atendimento

```
Segunda a Sexta: [XXh às XXh]
Sábado: [XXh às XXh]
Domingo: [Fechado ou XXh às XXh]
```

### 4. Redes Sociais

```
Instagram: https://instagram.com/[seu-perfil]
Facebook: https://facebook.com/[seu-perfil]
WhatsApp Business: https://wa.me/[seu-numero]
LinkedIn: https://linkedin.com/company/[sua-empresa]
```

### 5. Textos do Site

#### Hero Banner
```
Título: [Seu título atrativo]
Descrição: [Descrição breve e impactante]
Botão: [Texto do botão]
```

#### Sobre a Empresa (Footer)
```
[Descrição da sua empresa, missão, valores]
```

### 6. Cores da Marca (Opcional)

Se quiser personalizar as cores, substitua no CSS:

```
Cor Principal: #395f69 (verde-azulado escuro)
Cor Secundária: #748d8c (verde-azulado claro)
Cor de Destaque: #dcbb92 (bege/dourado)
Cor de Fundo Escuro: #1e2723 (preto)
```

### 7. Logo

```
Caminho: imagems/logo_dr_derm_cropped.png
Tamanho recomendado: Mínimo 200x60px
Formato: PNG com fundo transparente
```

## 🔧 Arquivos a Atualizar

### 1. index.html
- [ ] Título da página (linha 6)
- [ ] Meta description (linha 9)
- [ ] Hero banner (linhas 2843-2845)
- [ ] Footer - informações de contato
- [ ] Footer - redes sociais (links)

### 2. manifest.json
- [ ] Nome da aplicação
- [ ] Cores do tema (se necessário)

### 3. Todas as páginas HTML
- [ ] Footer (se houver)
- [ ] Informações de contato

### 4. netlify/functions/auth-forgot-password.js
- [ ] RESEND_FROM_EMAIL (variável de ambiente)

## 📋 Checklist de Personalização

### Informações Básicas
- [ ] Nome da empresa
- [ ] CNPJ (se aplicável)
- [ ] Email de contato
- [ ] Telefone/WhatsApp
- [ ] Endereço (se houver)

### Visual
- [ ] Logo atualizado
- [ ] Favicon criado
- [ ] Cores personalizadas (se necessário)
- [ ] Imagens de produtos

### Conteúdo
- [ ] Textos revisados
- [ ] Descrições atualizadas
- [ ] Links de redes sociais
- [ ] Políticas legais

### Técnico
- [ ] Domínio configurado
- [ ] Variáveis de ambiente
- [ ] Emails configurados
- [ ] Testes realizados

## 🎨 Sugestões de Textos

### Hero Banner (Alternativas)
1. "Produtos Dermatológicos Premium para Profissionais"
2. "Sua fonte confiável de produtos estéticos de alta qualidade"
3. "Excelência em produtos dermatológicos para medicina estética"

### Footer - Sobre a Empresa (Alternativas)
1. "Especializada em produtos dermatológicos premium para profissionais da área médica e estética. Comprometida em oferecer qualidade, segurança e excelência."
2. "Distribuidora autorizada de produtos estéticos e dermatológicos. Parceira de profissionais da área médica há [X] anos."
3. "Sua parceira de confiança em produtos dermatológicos. Qualidade, segurança e resultados comprovados."

## 📞 Exemplo de Preenchimento

### Informações da Empresa
```
Nome: DermProdutos Brasil
CNPJ: 12.345.678/0001-90
Slogan: Qualidade e Excelência em Produtos Dermatológicos
```

### Informações de Contato
```
Email: contato@dermprodutos.com.br
Telefone: (11) 3456-7890
WhatsApp: (11) 98765-4321
Endereço: Rua Exemplo, 123 - São Paulo, SP - CEP 01234-567
```

### Horários
```
Segunda a Sexta: 8h às 18h
Sábado: 9h às 13h
Domingo: Fechado
```

### Redes Sociais
```
Instagram: https://instagram.com/dermprodutos
Facebook: https://facebook.com/dermprodutos
WhatsApp: https://wa.me/5511987654321
```

## ⚠️ Importante

1. **Não commitar informações sensíveis** - Use variáveis de ambiente
2. **Testar todos os links** - Verificar se estão funcionando
3. **Validar emails** - Confirmar que os emails estão corretos
4. **Revisar textos** - Verificar ortografia e gramática
5. **Testar em diferentes dispositivos** - Mobile, tablet, desktop

## 🚀 Após Personalizar

1. Revisar todas as informações
2. Testar funcionalidades
3. Verificar links e emails
4. Fazer deploy de teste
5. Validar em produção





