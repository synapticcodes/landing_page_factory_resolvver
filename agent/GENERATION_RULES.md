# Regras de Geração — Landing Page Factory

## Regras Hard (invioláveis)

### R1: Copy fundamentado, nunca inventado
O agente NUNCA inventa copy do zero. Todo copy deve ser:
- **Primeiramente**: extraído do config YAML (campos `headline`, `subheadline`, `body`, etc.)
- **Secundariamente**: gerado aplicando frameworks de `libraries/copywriting/` sobre o perfil da audiência
- **Em último caso**: se não há config nem framework aplicável, retorne erro listando os campos ausentes

Ao gerar copy com base nos frameworks, o agente DEVE:
- Consultar `libraries/copywriting/psicologia/` para fundamentação psicológica
- Aplicar fórmulas de `headlines/`, `ctas/`, ou `microcopy/` conforme a seção
- Respeitar TODAS as regras de `libraries/communication/` (tom, palavras proibidas, limites)
- Registrar qual framework fundamentou a decisão (campo `_fundamentacao` opcional no output)

### R2: Ordem das seções é sagrada
A ordem em `sections[]` reflete o fluxo cognitivo do usuário. NUNCA reordene seções. Se o config diz hero → legitimidade → processo, o HTML segue essa ordem.

### R3: Formulário é gateway, não obstáculo
- Aposentados: máximo 4 campos
- Servidores: máximo 6 campos
- Cada campo adicional = abandono exponencial
- Labels devem ser claros e em linguagem do público-alvo
- Erros de validação devem ser gentis e específicos

### R4: WhatsApp é o destino final
- Toda conversão termina no WhatsApp
- Mensagem pré-preenchida com tipo de público + nome apenas
- Redirect via `location.assign()` para Wolfgang interceptar
- Countdown de 5 segundos na tela de transição
- Botão fallback "ABRIR WHATSAPP AGORA" sempre visível
- Contingência para sem WhatsApp: e-mail contato@resolvver.com

### R5: Qualificação protege a operação
- Valor mínimo: R$ 2.000 (aposentados) / R$ 3.000 (servidores)
- Desqualificados recebem mensagem gentil, SEM vergonha
- "Não se encaixa AGORA" — não "você não serve"

### R6: Geolocation personaliza
- Depoimentos adaptados por UF do usuário (via IPData)
- Fallback: depoimentos genéricos se IPData falhar
- API key via env var `IPDATA_API_KEY`
- Quota: 1500 req/dia free

### R7: Design é função, não decoração
- Cada elemento visual tem função psicológica documentada
- Cores da marca Resolvver (verde #1DB387, navy #0D1F3C, mint #F4FBF8)
- Zero decoração sem propósito
- Fotos: pessoas reais com expressão de alívio/confiança, NUNCA stock genérico

### R8: Acessibilidade não é opcional
- Público de 50-59 anos com dificuldades visuais e motoras
- Fontes grandes, botões grandes, contraste alto
- Navegação ultra-linear (zero menus complexos, popups ou redirecionamentos)
- Scroll vertical apenas

## Regras Soft (recomendações fortes)

### S1: Variantes A/B
Se o config inclui `headline_variants` ou `cta_variants`, gere a versão primária como default e documente as variantes como comentários no código.

### S2: Tela de transição
A tela pós-submit deve ter: ícone de sucesso, mensagem de confirmação, countdown visual, botão fallback. Artificial loading (2-3s) no quiz para criar expectativa.

### S3: FAQ como accordion
FAQs sempre em formato accordion (click to expand). Primeiro item aberto por default.

### S4: Prova social localizada
Se geolocation disponível, mostrar primeiro os depoimentos da UF do usuário. Se não houver da UF, mostrar da região. Fallback: depoimentos genéricos.
