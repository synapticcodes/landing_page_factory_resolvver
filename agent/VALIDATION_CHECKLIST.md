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
- [ ] WhatsApp number tem formato válido (55 + 10-11 dígitos)

## Pós-Geração: Copy

- [ ] ZERO palavras proibidas no output (grep automático)
- [ ] Aposentados: ZERO percentuais no copy (apenas reais)
- [ ] Headlines ≤ 12 palavras (aposentados) / ≤ 15 palavras (servidores)
- [ ] Frases ≤ 15 palavras (aposentados)
- [ ] Tom correto: acolhedor (aposentados) / profissional (servidores)
- [ ] CTA text presente e coerente
- [ ] FAQ respostas ≤ 3 frases

## Pós-Geração: Técnico

- [ ] Astro syntax válido
- [ ] Tailwind classes válidas
- [ ] Todos os event listeners registrados
- [ ] Form validation implementada (client-side)
- [ ] Webhook payload completo
- [ ] WhatsApp redirect via `location.assign()`
- [ ] Countdown timer funcional
- [ ] Botão fallback presente
- [ ] CSP headers configurados
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
- [ ] Economy calculation com floor/ceiling
- [ ] Redirect para quiz correto se audiência errada
- [ ] Disqualificação precoce se "nenhuma das anteriores"
