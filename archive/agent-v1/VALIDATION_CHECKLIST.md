# Checklist de Validação — Landing Page Factory

## Pré-Geração

- [ ] Config YAML parseia sem erros de sintaxe
- [ ] Todos os campos `required` do schema estão presentes
- [ ] Todas as referências (`_ref`) apontam para arquivos que existem
- [ ] `audience_segment` é válido (aposentados | servidores_publicos)
- [ ] `strategy_type` é válido (captura | quiz)
- [ ] Se quiz: `scoring_ref` está presente
- [ ] Número de seções está entre 5 e 12
- [ ] Seções obrigatórias estão presentes (hero, legitimidade, form, faq, footer)
- [ ] WhatsApp config NÃO contém número hardcoded (número gerenciado pelo Wolfgang)

## Pós-Geração: Copy e Assets de Copywriting

- [ ] ZERO palavras proibidas no output (grep automático)
- [ ] Aposentados: ZERO percentuais no copy (apenas reais)
- [ ] Headlines ≤ 12 palavras (aposentados) / ≤ 15 palavras (servidores)
- [ ] Frases ≤ 15 palavras (aposentados)
- [ ] Tom correto: acolhedor (aposentados) / profissional (servidores)
- [ ] CTA text presente e coerente
- [ ] FAQ respostas ≤ 3 frases
- [ ] **Copy fundamentado**: todo copy gerado tem comentário HTML com framework/fórmula usada
- [ ] **Assets de copywriting consultados**: pelo menos `psicologia/`, `headlines/`, `ctas/` foram lidos
- [ ] **Depoimentos**: vieram do `_manifest.yaml`, não foram inventados
- [ ] **Valores 75%**: todo antes/depois segue `valor_depois = valor_antes × 0.25`

## Pós-Geração: Técnico

- [ ] Astro syntax válido
- [ ] Tailwind classes válidas
- [ ] GA4 event listeners registrados
- [ ] Form validation implementada (client-side)
- [ ] **WhatsApp é o ÚNICO destino**: todo CTA leva ao formulário → WhatsApp
- [ ] WhatsApp redirect via `location.assign()` (Wolfgang intercepta)
- [ ] Countdown timer funcional (5s)
- [ ] Botão fallback "ABRIR WHATSAPP AGORA" presente
- [ ] Tela de transição menciona WhatsApp explicitamente
- [ ] ZERO CTAs apontando para links externos, downloads ou telefone
- [ ] CNPJ e endereço presentes no footer
- [ ] **3 Snippets de tracking INCLUÍDOS** no `<head>`, na ordem correta:
  - [ ] Wolfgang Tracking (`libraries/tracking/wolfgang-snippet.html`) — primeiro
  - [ ] GA4 (`libraries/tracking/ga4-snippet.html`) — segundo
  - [ ] Clarity (`libraries/tracking/clarity-snippet.html`) — terceiro
- [ ] **Snippets copiados EXATAMENTE** como estão nos arquivos, sem modificações
- [ ] **ZERO código de pixel/fbq/gtag/clarity manual** (tudo via snippets externos)
- [ ] **ZERO webhook URLs hardcoded** no código gerado
- [ ] **ZERO números de WhatsApp hardcoded** (Wolfgang gerencia o número)
- [ ] IPData integration para geolocation

## Pós-Geração: Design

- [ ] Mobile-first (breakpoints corretos)
- [ ] Fonte body ≥ 16px
- [ ] Touch targets ≥ 56px
- [ ] CTA primário acima do fold
- [ ] Cores da marca Resolvver aplicadas
- [ ] Contraste ≥ 4.5:1
- [ ] Sem scroll horizontal
- [ ] Imagens com alt text
- [ ] Loading < 2s target
- [ ] Page weight < 500KB/600KB

## Pós-Geração: Quiz (se aplicável)

- [ ] Número correto de steps
- [ ] Progress bar funcional
- [ ] Auto-advance com delay de 400ms
- [ ] Scoring logic implementada corretamente
- [ ] Economy calculation com fator fixo 0.75
- [ ] Redirect para quiz correto se audiência errada
- [ ] Disqualificação precoce se "nenhuma das anteriores"
