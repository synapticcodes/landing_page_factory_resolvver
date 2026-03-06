# Validation Checklist — Strategist Agent

> Execute TODOS estes checks antes de entregar o Copy Deck ao pipeline.

## Pre-Geração (antes de escrever copy)

- [ ] REGISTRY.yaml lido e inventário atualizado
- [ ] Brief interpretado e registrado em `brief.raw_input` + `brief.interpreted_objective`
- [ ] Audiência identificada corretamente (aposentados ou servidores)
- [ ] Modelo de estrutura selecionado com rationale documentado
- [ ] Psicologia fundamentada: awareness_level, triggers, biases, emotional_journey
- [ ] Frameworks de copy selecionados e listados em `assets_selected`
- [ ] Communication guidelines da audiência lidas

## Copy — Qualidade

- [ ] TODAS as seções têm `copy.headline.text` preenchido (NENHUM campo vazio)
- [ ] TODAS as headlines têm `framework` e `trigger` documentados
- [ ] Headlines respeitam limite de palavras (12 aposentados / 15 servidores)
- [ ] Frases respeitam limite (≤15 palavras para aposentados)
- [ ] Valores financeiros APENAS em reais para aposentados (ZERO percentuais)
- [ ] Todos os CTAs têm `text`, `action`, `style`
- [ ] Pelo menos 1 variante A/B por headline principal
- [ ] Pelo menos 1 variante A/B por CTA principal

## Copy — Português Impecável (R0)

- [ ] ZERO erros de acentuação em todo o Copy Deck (após, não, é, está, você, redução, ação, análise)
- [ ] ZERO cedilhas faltando (redução, ação, situação — NUNCA "reducao", "acao")
- [ ] Pontuação correta em todas as frases (vírgulas, pontos, dois-pontos)
- [ ] Crase aplicada onde gramaticalmente necessário
- [ ] Nomes próprios capitalizados (Resolvver, Brasil, INSS, Justiça)
- [ ] ZERO abreviações informais no copy final ("pra"→"para", "tá"→"está")

## Copy — Proibições

- [ ] ZERO palavras proibidas no Copy Deck inteiro:
  - [ ] "grátis", "garantido", "rápido e fácil"
  - [ ] "melhor idade", "terceira idade"
  - [ ] "sem custo", "consulte grátis", "simulação sem compromisso", "análise gratuita"
  - [ ] "milagre", "sem burocracia", "dinheiro fácil", "resolve tudo"
  - [ ] "PARABÉNS! Você foi selecionado"
  - [ ] "APENAS HOJE", "ÚLTIMA CHANCE", "ÚLTIMAS VAGAS"
  - [ ] "site" (SEMPRE usar "página" — regra global, vale para TODO o copy)
- [ ] ZERO valores financeiros inventados (todos calculados pela regra 75% ou vindos do manifest)
- [ ] ZERO claims não fundamentados

## Valores Financeiros (R7)

- [ ] TODO valor "antes/depois" segue fator fixo: `valor_depois = valor_antes × 0.25` (redução 75%)
- [ ] Economia calculada como `economia_mensal = valor_antes × 0.75`
- [ ] NENHUM valor financeiro inventado — todos calculados ou vindos do manifest

## Depoimentos (R6)

- [ ] Depoimentos vêm EXCLUSIVAMENTE do `_manifest.yaml` (NUNCA inventados)
- [ ] Geolocalizados corretamente (estado corresponde ao manifest)
- [ ] Aprovados (`aprovado: true`) e com texto não-vazio

## Estrutura

- [ ] Seções na ordem correta conforme o modelo escolhido
- [ ] Cada seção tem `purpose` (função psicológica) definido
- [ ] Annotations presentes em seções-chave (hero, form, prova_social)
- [ ] Visual intent definido em linguagem de alto nível (NÃO código)
- [ ] Tracking events listados para seções interativas

## Conversão

- [ ] Formulário tem campos definidos com labels, tipos, placeholders
- [ ] Campo de telefone usa label "WhatsApp" (NUNCA "Telefone")
- [ ] Servidores: campo "cargo" é texto aberto (NÃO solicitar órgão)
- [ ] Qualificação configurada com valor mínimo correto
- [ ] Copy de desqualificação é gentil e sem vergonha
- [ ] Mensagem WhatsApp é DINÂMICA e ÚNICA para esta página (R12) — NÃO é template fixo
- [ ] Mensagem usa variáveis dos campos: {first_name}, {valor_liquido}, {cargo} etc.
- [ ] Tela de transição tem copy completo (headline, subheadline, countdown, fallback)
- [ ] ZERO número de WhatsApp hardcoded (Wolfgang gerencia)

## Variação

- [ ] Modelo de estrutura é DIFERENTE da última execução (quando possível)
- [ ] Frameworks de copy são DIFERENTES da última execução
- [ ] Gatilhos psicológicos primários são DIFERENTES da última execução
- [ ] A página NÃO é uma cópia de nenhuma anterior

## Atuação Nacional (R11)

- [ ] Pelo menos 1 elemento comunica atuação nacional (badge, frase, microcopy)
- [ ] Footer inclui "Atuação em todo o Brasil" junto ao endereço
- [ ] Tom é POSITIVO ("atendemos todo o Brasil"), NUNCA defensivo ("apesar de sermos do RS...")
- [ ] Depoimentos geolocalizados reforçam indiretamente (visitante vê pessoas da sua região)

## Imagens Genéricas (S7)

- [ ] Pelo menos 1 imagem genérica selecionada para hero e/ou seções-chave
- [ ] Imagens são da subpasta da audiência correta (`aposentados/` ou `funcionarios_publicos/`)
- [ ] Emoção da imagem está alinhada ao tom da seção (dor→medo/raiva/tristeza, solução→alívio/felicidade)
- [ ] Arquivo exato indicado no `visual_intent` (ex: `felicidade_aposentados 3.webp`)
- [ ] Números variados entre execuções (não usar sempre o _1)
- [ ] Imagens existem no inventário (`REGISTRY.yaml > assets > genericas`)

## App de Acompanhamento (S6)

- [ ] Respostas de FAQ sobre tempo/prazo mencionam AMBOS canais: WhatsApp + aplicativo
- [ ] Processo section menciona app como ferramenta de acompanhamento em tempo real
- [ ] NÃO menciona nome do app — apenas que existe e está disponível (iOS + Android)

## Completude

- [ ] metadata preenchido (deck_id, created_date, audience, objective, strategy_type, structure_model)
- [ ] brief preenchido (raw_input, interpreted_objective)
- [ ] strategy_selection preenchido (model, rationale, psychological_approach, assets_selected)
- [ ] sections preenchido (todos os campos obrigatórios por seção)
- [ ] conversion preenchido (form, qualification, whatsapp)
- [ ] footer preenchido (incluindo atuação nacional)
- [ ] seo preenchido (title, description)
- [ ] Copy Deck valida contra `schemas/copy-deck.schema.json`
