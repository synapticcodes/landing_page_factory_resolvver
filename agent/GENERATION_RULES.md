# Regras de Geração — Landing Page Factory

## Regras Hard (invioláveis)

### R1: Copy gerado A PARTIR dos assets de copywriting (OBRIGATÓRIO)
O agente SEMPRE gera copy consultando os assets de `libraries/copywriting/`. O fluxo é:

1. **Se o config tem copy preenchido** → use como base, mas ENRIQUEÇA aplicando técnicas dos frameworks
2. **Se o config tem campos de copy vazios** → GERE copy original aplicando os frameworks ao perfil da audiência
3. **NUNCA** gere copy "do nada" sem consultar pelo menos 1 framework de copywriting
4. **NUNCA** invente números, valores financeiros ou claims não fundamentados

**Antes de escrever qualquer copy, o agente DEVE LER:**
- `libraries/copywriting/psicologia/niveis_consciencia.yaml` → nível de consciência do visitante
- `libraries/copywriting/psicologia/gatilhos_emocionais.yaml` → gatilhos a aplicar
- O asset específico da seção (ver tabela no SYSTEM_PROMPT.md)
- `libraries/communication/{audiencia}.yaml` → tom, palavras proibidas, limites

**Após gerar o copy, o agente DEVE:**
- Documentar qual framework/fórmula usou (comentário HTML no código)
- Verificar aderência ao tom da audiência
- Variar fórmulas entre páginas da mesma audiência (não repetir AIDA em todas)

### R2: Ordem das seções é sagrada
A ordem em `sections[]` reflete o fluxo cognitivo do usuário. NUNCA reordene seções. Se o config diz hero → legitimidade → processo, o HTML segue essa ordem.

### R3: Formulário é gateway, não obstáculo
- Aposentados: máximo 4 campos
- Servidores: máximo 6 campos
- Cada campo adicional = abandono exponencial
- Labels devem ser claros e em linguagem do público-alvo
- Erros de validação devem ser gentis e específicos

### R4: WhatsApp é o ÚNICO destino final (regra de negócio)
**Toda conversão em toda landing page termina no WhatsApp. Sem exceções.**

- **Fluxo obrigatório**: Qualquer CTA → Formulário → Tela de transição (5s countdown) → WhatsApp
- Mensagem pré-preenchida com tipo de público + nome (dados já vão via webhook ao backend)
- Redirect via `location.assign()` para Wolfgang interceptar
- **O número de WhatsApp é gerenciado pelo Wolfgang Tracking** — NUNCA hardcodar nos configs ou no código
- Botão fallback "ABRIR WHATSAPP AGORA" sempre visível na tela de transição
- Contingência: sem WhatsApp → email contato@resolvver.com

**PROIBIDO:**
- CTAs que levem a links externos, downloads, páginas de vendas, ou ligações telefônicas
- Formulários que enviem para email ou CRM direto (tudo passa pelo WhatsApp)
- Qualquer destino que não seja WhatsApp para leads qualificados
- Múltiplos destinos de conversão na mesma página
- Hardcodar número de WhatsApp nos configs ou no código (Wolfgang gerencia)

**Todo CTA textual deve comunicar que o destino é o WhatsApp:**
- Aposentados: "Quero reduzir minha parcela" → formulário → WhatsApp
- Servidores: "Simular minha economia" → formulário → WhatsApp
- A tela de transição deve dizer: "Estamos te encaminhando para nosso atendimento via WhatsApp"

### R10: 3 Snippets de Tracking são OBRIGATÓRIOS em todas as páginas
**Três snippets DEVEM ser incluídos em TODAS as landing pages geradas. Sem exceções.**

**Procedimento obrigatório (ordem de inserção no `<head>`):**
1. Ler `libraries/tracking/wolfgang-snippet.html` → copiar INTEIRO (primeiro no `<head>`)
2. Ler `libraries/tracking/ga4-snippet.html` → copiar INTEIRO (após Wolfgang)
3. Ler `libraries/tracking/clarity-snippet.html` → copiar INTEIRO (após GA4)

**Regras:**
- Nenhum snippet deve ser modificado, minificado ou reescrito — inserir EXATAMENTE como está no arquivo
- O agente NUNCA gera código de pixel, fbq(), gtag(), ou clarity() — já está nos snippets
- Wolfgang inclui: Meta Pixel base, inicialização, tracking de formulários, interceptação de WhatsApp, noscript fallback
- GA4 inclui: gtag.js loader + config `G-N152GDZNH1`
- Clarity inclui: script loader projeto `vr2yamcer9`
- Configuração centralizada em `libraries/tracking/common-events.yaml`

### R5: Qualificação protege a operação
- Valor mínimo: R$ 2.000 (aposentados) / R$ 3.000 (servidores)
- Desqualificados recebem mensagem gentil, SEM vergonha
- "Não se encaixa AGORA" — não "você não serve"

### R6: Depoimentos vêm do manifest (OBRIGATÓRIO)
O agente NUNCA inventa depoimentos. Ele DEVE buscar no `assets/pessoas/depoimentos/_manifest.yaml`.

**Fluxo obrigatório:**
1. Ler `_manifest.yaml` → filtrar por audiência (aposentados ou servidores)
2. Filtrar por `aprovado: true` e `texto` não-vazio
3. Detectar região do visitante via IPData (API key em env `IPDATA_API_KEY`, 1500 req/dia)
4. Selecionar depoimentos da **região** do visitante (NÃO da UF)
5. Aplicar alternância de gênero: M→F→M→F
6. Exibir a **cidade do visitante** no card, NÃO a cidade real da foto
7. Valores de economia seguem regra 75%
8. Fallback sem IPData: depoimentos com maior `economia_mensal`, sem localidade

**Se o manifest não tem depoimentos com texto para uma região:**
- Usar região vizinha (sudeste↔sul, nordeste↔norte, centro_oeste→qualquer)
- Se nenhuma região tem depoimentos com texto: gerar avatar CSS com iniciais

### R7: Design é função, não decoração
- Cada elemento visual tem função psicológica documentada
- Cores da marca Resolvver (verde #1DB387, navy #0D1F3C, mint #F4FBF8)
- Zero decoração sem propósito
- Fotos: pessoas reais com expressão de alívio/confiança, NUNCA stock genérico

### R8: Redução SEMPRE 75% (regra de negócio)
Todo valor "antes/depois" exibido na landing page segue fator de redução fixo de **75%**.

- **Fórmula**: `valor_depois = valor_antes × 0.25` (o cliente paga 25% do original)
- **Economia**: `economia_mensal = valor_antes × 0.75`
- Exemplo: parcela de R$ 1.000 → reduzida para R$ 250 → economia de R$ 750/mês
- Exemplo: parcela de R$ 600 → reduzida para R$ 150 → economia de R$ 450/mês

**Onde se aplica:**
- Depoimentos (antes/depois no card de prova social)
- Hero section (quando exibe simulação de economia)
- Quiz resultado (economia estimada)
- Qualquer copy que mencione valores de parcela

**NUNCA** use outro fator. Se o config YAML traz valores que não batem com 75%, o agente deve corrigir automaticamente e alertar no relatório de validação.

### R9: Acessibilidade não é opcional
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
Geolocation determina quais depoimentos do `_manifest.yaml` são exibidos. Seleção por região (não UF). Cidade do visitante é exibida no card. Ver R6 para regras detalhadas.
