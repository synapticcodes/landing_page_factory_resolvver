# Landing Page Factory — Resolvver

Sistema de geração de landing pages de alta conversão para a Resolvver, operado por **2 agentes especializados** (Strategist + Coder) com contrato via **Copy Deck** (YAML).

## Objetivo

**FILTRAR E CONVERTER O LEAD MQL** — cada landing page qualifica o visitante e o direciona ao WhatsApp. O sistema garante consistência de copy, UX, tracking e qualificação sem decisões ad hoc.

## Arquitetura de 2 Agentes

```
Brief (verbal) → Strategist → Copy Deck (YAML) → [Review Humano] → Coder → Página Astro 5.x
```

| Agente | Função | Input | Output |
|---|---|---|---|
| **Strategist** | Estrutura + Copy + Estratégia criativa | Brief + REGISTRY | Copy Deck (YAML) |
| **Coder** | Implementação técnica fiel | Copy Deck + REGISTRY | Página Astro 5.x |

O **Copy Deck** é o contrato entre os agentes — contém toda a estrutura, copy, intenções visuais e configuração de conversão.

## Estrutura do repositório

```text
landing_page_factory/
├── REGISTRY.yaml                    # Inventário dinâmico de tudo disponível
├── PLAN.md                          # Plano de arquitetura
├── README.md                        # Este arquivo
│
├── agent/
│   ├── strategist/                  # Agente criativo (estrutura + copy)
│   │   ├── SYSTEM_PROMPT.md
│   │   ├── GENERATION_RULES.md
│   │   ├── VALIDATION_CHECKLIST.md
│   │   └── creative-matrix.yaml
│   ├── coder/                       # Agente implementador (código fiel)
│   │   ├── SYSTEM_PROMPT.md
│   │   ├── GENERATION_RULES.md
│   │   └── VALIDATION_CHECKLIST.md
│   └── pipeline/
│       ├── orchestrator.md          # Fluxo de execução completo
│       └── copy-deck-template.yaml  # Template vazio do Copy Deck
│
├── schemas/
│   ├── copy-deck.schema.json        # Schema do Copy Deck (contrato entre agentes)
│   └── page-config.schema.json      # [LEGACY] Schema v1 — apenas referência histórica
│
├── libraries/
│   ├── audiences/                   # Perfis de público-alvo
│   ├── communication/               # Guidelines de comunicação por audiência
│   ├── copywriting/                 # Base de conhecimento de copy e persuasão
│   ├── components/                  # Templates estruturais de seções
│   ├── design-tokens/               # Cores, tipografia, espaçamento
│   ├── globals/                     # Variáveis de ambiente globais (env.yaml)
│   └── tracking/                    # Snippets de tracking (Wolfgang, GA4, Clarity)
│
├── strategies/                      # Regras por tipo de página
│   ├── captura/
│   └── quiz/
│
├── assets/                          # Mídia (logos, fotos, ícones)
│   ├── _INDEX.yaml
│   ├── brand/
│   └── pessoas/depoimentos/
│
├── validation/
│   ├── validate-copy-deck.js        # Validator de Copy Decks
│   ├── validate-config.js           # [LEGACY] Validator de configs v1
│   └── README.md
│
├── output/
│   └── copy-decks/                  # Copy Decks gerados pelo Strategist
│
└── archive/
    ├── configs/                     # Configs YAML v1 (referência histórica)
    └── agent-v1/                    # Prompts do agente único v1
```

## Fluxo recomendado

1. Fornecer um **brief verbal** ao Strategist (audiência, objetivo, contexto).
2. O Strategist lê o `REGISTRY.yaml`, seleciona estratégia, gera o **Copy Deck**.
3. Validar o Copy Deck: `node validation/validate-copy-deck.js output/copy-decks/<deck>.yaml`
4. Revisar e aprovar o Copy Deck (review humano).
5. Entregar o Copy Deck ao Coder para implementação.
6. O Coder gera a página Astro 5.x completa, fiel ao Copy Deck.

## Audiências suportadas

- **Aposentados/Pensionistas INSS**: 50-70 anos, linguagem ultra-simples, valores em R$
- **Servidores Públicos**: 30-55 anos, linguagem profissional, dados/percentuais OK

## Stack técnico (output do Coder)

- Astro 5.x + Tailwind CSS 4.x + TypeScript
- IPData para geolocalização de depoimentos (server-side)
- Wolfgang Tracking + GA4 + Clarity (3 snippets obrigatórios)
- WhatsApp como destino final (via `location.assign`)

## Validação

- **Copy Deck**: `node validation/validate-copy-deck.js <path>`
- **Config legado (v1)**: `node validation/validate-config.js <path>` (apenas para referência)

## Regras de negócio invariáveis

- Redução de 75%: `valor_depois = valor_antes × 0.25`
- WhatsApp é o ÚNICO destino final
- Qualificação: R$ 2.000 (aposentados) / R$ 3.000 (servidores)
- Número WhatsApp gerenciado pelo Wolfgang (nunca hardcoded)
- Palavras proibidas: grátis, garantido, melhor idade, etc.

## Arquivos-chave

- `REGISTRY.yaml`: inventário de tudo disponível (ambos agentes leem primeiro)
- `agent/strategist/SYSTEM_PROMPT.md`: prompt do agente criativo
- `agent/coder/SYSTEM_PROMPT.md`: prompt do agente implementador
- `schemas/copy-deck.schema.json`: schema do contrato entre agentes
- `libraries/copywriting/_INDEX.yaml`: índice da base de copy
- `libraries/globals/env.yaml`: variáveis de ambiente globais
