# Regras de Geração — Coder Agent

## Regras Hard (invioláveis)

### R1: Fidelidade total ao Copy Deck
O Copy Deck é a fonte de verdade absoluta. O Coder:
- NÃO modifica headlines, subheadlines, CTAs, depoimentos ou qualquer copy
- NÃO reordena seções
- NÃO adiciona ou remove seções
- NÃO decide gatilhos psicológicos ou frameworks de copy
- Se algo parece errado, implementa E sinaliza no relatório

### R2: 3 Snippets de Tracking são OBRIGATÓRIOS
Procedimento obrigatório (ordem de inserção no `<head>`):
1. Ler `libraries/tracking/wolfgang-snippet.html` → copiar INTEIRO (primeiro no `<head>`)
2. Ler `libraries/tracking/ga4-snippet.html` → copiar INTEIRO (após Wolfgang)
3. Ler `libraries/tracking/clarity-snippet.html` → copiar INTEIRO (após GA4)

**Regras:**
- Nenhum snippet deve ser modificado, minificado ou reescrito
- O Coder NUNCA gera código de pixel, fbq(), gtag(), ou clarity()
- ZERO código manual de tracking — tudo está nos snippets

### R3: Mobile-first obrigatório
- Toda página é mobile-first. Desktop é override via `md:` / `lg:` Tailwind.
- Fonte mínima: 16px body
- Touch targets: mínimo 56x56px
- Container max-width: 1200px
- Scroll vertical apenas

### R4: WhatsApp redirect via location.assign()
- Redirect via `location.assign()` — Wolfgang intercepta automaticamente
- NUNCA hardcodar número de WhatsApp
- Mensagem pré-preenchida (wa.me) vem do Copy Deck — é DINÂMICA (não template fixo)
- Extrair `first_name` do campo `name` (primeira palavra) para usar na mensagem
- Substituir variáveis `{first_name}`, `{cargo}`, `{valor_liquido}`, etc. com dados do form
- Countdown 5s + botão fallback sempre presentes
- Contingência sem WhatsApp: email contato@resolvver.com

### R4.1: Formulário — Regras de campos obrigatórias
O Coder DEVE consultar `libraries/components/form-fields.yaml` e seguir:

**Placeholders HTML (autocomplete) hardcoded:**
- Campo nome: `autocomplete="name"`
- Campo WhatsApp: `autocomplete="tel"`
- Campo email: `autocomplete="email"`
- Demais campos: sem autocomplete obrigatório

**Campo de telefone SEMPRE se chama "WhatsApp":**
- Label: "WhatsApp" (NUNCA "Telefone" ou "Celular")
- Erro de validação: "Informe um telefone válido que possua WhatsApp"
- Aplica a TODOS os públicos e TODAS as estratégias

**Name splitting (obrigatório):**
- Extrair `first_name` = primeira palavra do nome completo
- Extrair `last_name` = restante após first_name
- Uso: mensagem WhatsApp, personalização na tela de transição

**Campo cargo (apenas servidores):**
- Tipo: text (campo ABERTO — lead escreve livremente)
- NÃO solicitar órgão — apenas cargo
- Validação: bloquear números e caracteres especiais (permitir acentos)
- Pattern: apenas letras, espaços e acentos
- Exemplos: professor estadual, enfermeiro, auditor fiscal, policial militar

### R5: Performance targets
- Page load: < 2s
- Page weight: max 500KB (aposentados) / 600KB (servidores)
- LCP < 2.5s, FID < 100ms, CLS < 0.1
- Hero images: `loading="eager"`
- Demais imagens: `loading="lazy"`
- Output: HTML estático com islands Astro para interatividade

### R6: Acessibilidade não é opcional
- Todas imagens: alt text descritivo
- Todos campos: labels visíveis
- Headings: h1 → h2 → h3 (sem pular)
- Contraste: > 4.5:1
- aria-labels em ícones e botões interativos

### R7: Dados da empresa obrigatórios no footer
Toda página DEVE ter no footer:
- Resolvver
- CNPJ: 64.933.842/0001-89
- Endereço completo
- Email: contato@resolvver.com
- **"Atuação em todo o Brasil"** — SEMPRE presente junto ao endereço (sede no RS, mas atende o Brasil inteiro)

### R8: Depoimentos via manifest + geolocalização
O Coder implementa a lógica técnica de depoimentos:
1. IPData API (server-side) → região do visitante
2. Filtrar por audiência + região + `aprovado: true` + texto não-vazio
3. Alternância M→F→M→F
4. Exibir cidade do VISITANTE (não da foto)
5. Valores: regra 75% (`valor_depois = valor_antes × 0.25`)
6. Fallback: região vizinha → avatar CSS

### R9: Assets conforme hierarquia de resolução
- **Logos**: PNG direto, `<img>` simples
- **Fotos pessoas**: `<picture>` com WebP srcset 1x/2x + fallback JPG
- **Ícones**: Lucide como padrão, custom SVG se existir em `assets/icons/`
- **Backgrounds**: CSS gradient preferido, imagem só se necessário e existir
- **OG Images**: Endpoint dinâmico `/api/og.png` via Satori + sharp

### R10: Annotations do Strategist como comentários
Annotations do Copy Deck devem ser preservadas como comentários HTML:
```html
<!-- STRATEGIST: Visitante chega frio. Primeira impressão em 3s. -->
<!-- COPY: PAS formula + gatilho ancoragem -->
```

## Regras Soft (recomendações fortes)

### S1: Visual Intent → Tailwind
Tradução de intents comuns:
- "claro e acolhedor" → `bg-[#F4FBF8]` ou `bg-white` com gradiente suave
- "escuro e sério" → `bg-[#0D1F3C]` com `text-white`
- "vibrante" → `bg-[#1DB387]` com contraste alto
- "profissional" → `bg-white text-[#0D1F3C]` com linhas limpas

### S2: Variantes A/B como comentários
Se o Copy Deck inclui `variants`, implementar a versão primária como default e documentar variantes:
```html
<!-- A/B VARIANT: "Parcela alta demais? A gente resolve." -->
```

### S3: FAQ como accordion
FAQs sempre em accordion (click to expand). Primeiro item aberto por default.

### S4: Tela de transição
- Ícone de sucesso animado
- Mensagem de confirmação (copy do Deck)
- Countdown visual (5s)
- Botão fallback "ABRIR WHATSAPP AGORA"
- Loading artificial 2-3s no quiz para expectativa

### S5: Formulário amigável
- Validação client-side em tempo real
- Mensagens de erro gentis e específicas (copy do Deck se fornecido)
- Labels claros
- Placeholders descritivos
- Microcopy de segurança (LGPD)
