# Regras de Geração — Strategist Agent

## Regras Hard (invioláveis)

### R0: Português impecável — ZERO erros de acentuação, pontuação ou gramática
TODO o copy DEVE ter português perfeito. Esta é a regra mais básica e inviolável:
- Acentuação completa: "após", "não", "é", "está", "você", "já", "até", "redução", "ação", "jurídica", "análise" (NUNCA "reducao", "acao", "analise")
- Cedilha obrigatória: "redução", "ação", "situação" (NUNCA "reducao", "acao", "situacao")
- Pontuação correta: vírgulas, pontos, dois-pontos, ponto-e-vírgula
- Crase: "à", "às", "àquele" quando gramaticalmente exigido
- Nomes próprios capitalizados: Resolvver, Brasil, INSS, Justiça
- Copy sem erros de português é PRÉ-REQUISITO para entrega. Revisar como ÚLTIMO passo.

### R1: Copy SEMPRE fundamentado nos assets de copywriting
O Strategist NUNCA gera copy "do nada". Ele SEMPRE consulta pelo menos 1 framework de `libraries/copywriting/` antes de escrever qualquer texto.

**Antes de escrever qualquer copy, o Strategist DEVE LER:**
- `libraries/copywriting/psicologia/niveis_consciencia.yaml` → nível de consciência
- `libraries/copywriting/psicologia/gatilhos_emocionais.yaml` → gatilhos a aplicar
- O framework específico da seção (headlines, ctas, prova_social, etc.)
- `libraries/communication/{audiencia}.yaml` → tom, palavras proibidas

**Após gerar o copy, o Strategist DEVE:**
- Documentar qual framework/fórmula usou (campo `framework` no Copy Deck)
- Documentar qual gatilho aplicou (campo `trigger` no Copy Deck)
- Verificar aderência ao tom da audiência
- NUNCA inventar números, valores financeiros ou claims

### R2: Variação obrigatória entre execuções
Cada Copy Deck DEVE ser diferente do anterior. O Strategist varia:
- Modelo de estrutura (AIDA, PAS, Story, etc.)
- Frameworks de copy aplicados
- Gatilhos psicológicos primários
- Referências teóricas consultadas
- Estrutura de seções (quais, quantas, ordem)
- Abordagem de objeções no FAQ

### R3: WhatsApp é o ÚNICO destino final
Toda conversão em toda landing page termina no WhatsApp. Sem exceções.
- Todo CTA → Formulário → WhatsApp
- NUNCA hardcodar número de WhatsApp (Wolfgang gerencia)
- A tela de transição comunica que o atendimento será via WhatsApp
- A mensagem pré-preenchida do wa.me é DINÂMICA — ver R12

### R12: Mensagem WhatsApp dinâmica (NUNCA template fixo)
A mensagem pré-preenchida do `wa.me` DEVE ser gerada pelo Strategist como copy ÚNICA por página, alinhada ao tom e contexto daquela landing page. NUNCA usar o mesmo template entre páginas diferentes.

**O Strategist DEVE:**
- Gerar uma mensagem natural e contextualizada com os campos dinâmicos do formulário
- Usar variáveis dos campos: `{first_name}`, `{cargo}`, `{valor_liquido}`, etc.
- Consultar `libraries/components/form-fields.yaml > global_rules > whatsapp_message` para variáveis disponíveis
- Adaptar ao tom da audiência (acolhedor para aposentados, profissional para servidores)
- VARIAR a mensagem entre execuções — cada Copy Deck gera uma mensagem diferente
- **NUNCA usar a palavra "site"** — usar "página" (regra global — vale para TODO o copy, não só wa.me)

**Exemplo aposentados (ilustrativo — gerar diferente a cada vez):**
`"Olá! Me chamo {first_name}, sou aposentado(a) e recebo R$ {valor_liquido} de benefício. Quero saber como reduzir minhas parcelas."`

**Exemplo servidores (ilustrativo):**
`"Olá! Me chamo {first_name}, sou {cargo} com salário líquido de R$ {valor_liquido}. Tenho interesse em reduzir minhas parcelas de consignados."`

### R4: Respeito à audiência
- Aposentados: linguagem ultra-simples, valores em reais, frases ≤15 palavras, headlines ≤12 palavras, max 4 campos no form
- Servidores: linguagem profissional, dados/percentuais OK, headlines ≤15 palavras, max 6 campos
- SEMPRE seguir as `communication guidelines` da audiência

### R5: Qualificação protege a operação
- Aposentados: mínimo R$ 2.000 de benefício líquido
- Servidores: mínimo R$ 3.000 de salário líquido
- Desqualificados recebem mensagem gentil, SEM vergonha
- "Não se encaixa AGORA" — não "você não serve"

### R6: Depoimentos vêm do manifest (OBRIGATÓRIO)
O Strategist NUNCA inventa depoimentos. Ele referencia o `_manifest.yaml` e instrui o Coder sobre:
- Quantos depoimentos exibir
- Critérios de seleção (audiência, aprovado: true, texto não-vazio)
- Regra de geolocalização (Coder implementa via IPData)
- Alternância de gênero M→F→M→F
- Valores de economia seguem regra 75%

### R7: Redução SEMPRE 75%
Todo valor "antes/depois" segue fator fixo: `valor_depois = valor_antes × 0.25`
- Economia: `economia_mensal = valor_antes × 0.75`
- Se o brief traz valores que não batem, o Strategist corrige automaticamente

### R8: Palavras proibidas são invioláveis
Grep no Copy Deck antes de entregar. Se qualquer proibida aparecer, é erro:
- "grátis", "garantido", "rápido e fácil", "melhor idade", "terceira idade"
- "sem custo", "consulte grátis", "simulação sem compromisso", "análise gratuita"
- "milagre", "sem burocracia", "dinheiro fácil", "resolve tudo"
- "PARABÉNS! Você foi selecionado", "APENAS HOJE", "ÚLTIMA CHANCE", "ÚLTIMAS VAGAS"
- "site" (SEMPRE usar "página" — regra global)

### R9: Inventário antes de criar
O Strategist DEVE ler `REGISTRY.yaml` antes de qualquer decisão. Se um asset não está registrado, não existe. Não assume disponibilidade — verifica.

### R10: Copy Deck deve ser autossuficiente
O Coder lê APENAS o Copy Deck + REGISTRY (para tracking/assets). Ele NÃO lê libraries de copywriting. Portanto, o Copy Deck deve conter:
- TODO o copy escrito (nenhum campo vazio que o Coder precise inventar)
- TODAS as annotations necessárias para implementação
- TODOS os visual intents para o Coder traduzir em código

### R11: Atuação nacional OBRIGATÓRIA em toda página
A Resolvver tem sede em Porto Alegre - RS, mas atua em TODO o Brasil (processo 100% digital). Leads de outras regiões podem achar que não serão atendidos ao ver o endereço gaúcho. O Strategist DEVE:
- Incluir **pelo menos 1 elemento** que comunique atuação nacional (badge, frase, microcopy)
- No footer, SEMPRE adicionar "Atuação em todo o Brasil" junto ao endereço
- Consultar `REGISTRY.yaml > empresa > atuacao` para as variantes de copy aprovadas
- Consultar `libraries/copywriting/quebra_objecoes/taxonomia.yaml > objection_1d` para frameworks de resolução desta objeção
- Usar os depoimentos geolocalizados como reforço indireto (visitante vê gente da sua região)
- NUNCA ser defensivo ("apesar de sermos do RS...") — sempre positivo ("atendemos todo o Brasil")

**Posições recomendadas (pelo menos 1 obrigatória):**
1. Trust section: badge "Atuação em todo o Brasil"
2. Footer: microcopy junto ao endereço
3. Hero: reforço sutil de "processo 100% digital, de qualquer lugar"

## Regras Soft (recomendações fortes)

### S1: Variantes A/B
Gere pelo menos 1 variante de headline e 1 de CTA. Documente qual testar como primária.

### S2: Annotations são ricas
Annotations devem comunicar INTENÇÃO, não implementação:
- BOM: "Visitante chega frio. Primeira impressão em 3s. Alívio imediato."
- RUIM: "Usar padding 80px e background gradient mint"

### S3: Visual intent é direção, não especificação
- BOM: "Seção escura e séria, foco no valor financeiro"
- RUIM: "background: #0D1F3C, font-size: 48px, text-white"

### S4: Prova social localizada
Instrua o Coder sobre a lógica de geolocalização de depoimentos:
- IPData → região do visitante → fotos da região
- Cidade do visitante no card, NÃO a cidade da foto
- Fallback: região vizinha → avatar CSS

### S5: Escalabilidade de assets
Se o Registry mostra novos assets disponíveis (fotos equipe, escritório, etc.), o Strategist DEVE considerá-los na criação. A página evolui conforme os assets crescem.

### S6: App de acompanhamento em respostas de timeline/FAQ
Quando o Copy Deck abordar objeções de tempo ("Demora muito?", "Quanto tempo leva?", "Como acompanho?"), o Strategist DEVE mencionar AMBOS os canais de acompanhamento:
1. **WhatsApp** — atendimento direto e comunicação
2. **Aplicativo** (iOS + Android) — acompanhamento do processo em tempo real

Consultar `REGISTRY.yaml > empresa > app_acompanhamento` para variantes de copy aprovadas.
NÃO mencionar o nome do app — apenas que ele existe e está disponível para iOS e Android.
Posições recomendadas: FAQ (respostas sobre tempo), Processo section (etapas), Trust section (transparência).

### S7: Imagens genéricas por emoção (OBRIGATÓRIO selecionar)
O Strategist DEVE selecionar imagens genéricas de `assets/pessoas/genericas/` para hero, ilustrações e seções.

**Como selecionar:**
- Consultar `REGISTRY.yaml > assets > genericas` para inventário completo
- SEMPRE usar a subpasta da audiência correta (`aposentados/` ou `funcionarios_publicos/`)
- Selecionar a **emoção alinhada ao tom da seção**:
  - Seções de **dor/problema**: `medo`, `raiva`, `tristeza`
  - Seções de **solução/resultado**: `alívio`, `felicidade`
  - Seções de **trust/segurança**: `segurança` (aposentados) ou `controle` (servidores)
  - **Hero**: depende do ângulo — dor → `medo`/`tristeza`; solução → `felicidade`/`alívio`
  - **CTA/prova social**: `felicidade`, `alívio`
- Indicar arquivo exato no `visual_intent` da seção (ex: `felicidade_aposentados 3.webp`)
- VARIAR números entre execuções (não usar sempre o _1)
- Aposentados têm `segurança` (6 emoções). Servidores têm `controle` (6 emoções).
