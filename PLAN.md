# Landing Page Factory — Plano de Arquitetura v2.0

## Visão Geral

A Landing Page Factory é um sistema de geração de landing pages para a Resolvver,
uma fintech que reduz parcelas de empréstimos consignados via medidas judiciais.

### Arquitetura de 2 Agentes

```
Brief (verbal) → Strategist → Copy Deck → [Review Humano] → Coder → Página Final
```

| Agente | Função | Input | Output |
|---|---|---|---|
| **Strategist** | Estrutura + Copy + Estratégia criativa | Brief + REGISTRY | Copy Deck (YAML) |
| **Coder** | Implementação técnica fiel | Copy Deck + REGISTRY | Página Astro 5.x |

### Objetivo Macro

**FILTRAR E CONVERTER O LEAD MQL** via landing pages de alta conversão.
Filtrar = qualificar por valor mínimo. Converter = levar ao WhatsApp.

---

## Estrutura de Pastas

```
landing_page_factory/
├── REGISTRY.yaml                    # Inventário dinâmico de tudo disponível
├── PLAN.md                          # Este arquivo
├── README.md
├── .gitignore
│
├── agent/
│   ├── strategist/
│   │   ├── SYSTEM_PROMPT.md         # Prompt do agente estrategista/copywriter
│   │   ├── GENERATION_RULES.md      # Regras invioláveis do Strategist
│   │   ├── VALIDATION_CHECKLIST.md  # Checks antes de entregar o Copy Deck
│   │   └── creative-matrix.yaml     # Matriz de combinações criativas por objetivo
│   ├── coder/
│   │   ├── SYSTEM_PROMPT.md         # Prompt do agente implementador
│   │   ├── GENERATION_RULES.md      # Regras técnicas invioláveis
│   │   └── VALIDATION_CHECKLIST.md  # Checks pós-implementação
│   └── pipeline/
│       ├── orchestrator.md          # Fluxo de execução completo
│       └── copy-deck-template.yaml  # Template vazio do Copy Deck
│
├── schemas/
│   ├── page-config.schema.json      # Schema do config legado (archive)
│   └── copy-deck.schema.json        # Schema do Copy Deck (contrato entre agentes)
│
├── libraries/
│   ├── audiences/                   # Perfis de público-alvo
│   ├── communication/               # Guidelines de comunicação por audiência
│   ├── copywriting/                 # Base de conhecimento de copy e persuasão
│   │   ├── _INDEX.yaml
│   │   ├── headlines/
│   │   ├── psicologia/
│   │   ├── prova_social/
│   │   ├── quebra_objecoes/
│   │   ├── estrutura_lp/
│   │   ├── ctas/
│   │   └── microcopy/
│   ├── components/                  # Templates estruturais de seções
│   ├── design-tokens/               # Cores, tipografia, espaçamento
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
│   ├── validate-config.js           # Validator de configs legados
│   ├── validate-copy-deck.js        # Validator de Copy Decks
│   └── README.md
│
├── output/
│   └── copy-decks/                  # Copy Decks gerados pelo Strategist
│
└── archive/
    ├── configs/                     # Configs YAML v1 (referência histórica)
    └── agent-v1/                    # Prompts do agente único v1
```

---

## Audiências

- **Aposentados/Pensionistas INSS**: 50-70 anos, linguagem ultra-simples, valores em R$
- **Servidores Públicos**: 30-55 anos, linguagem profissional, dados/percentuais OK

## Stack Técnico (Output do Coder)

- Astro 5.x + Tailwind CSS 4.x + TypeScript
- IPData para geolocalização de depoimentos
- Wolfgang Tracking + GA4 + Clarity (3 snippets obrigatórios)
- WhatsApp como destino final (via location.assign)

## Regras de Negócio Invariáveis

- Redução de 75%: `valor_depois = valor_antes × 0.25`
- WhatsApp é o ÚNICO destino final
- Qualificação: R$ 2.000 (aposentados) / R$ 3.000 (servidores)
- Número WhatsApp gerenciado pelo Wolfgang (nunca hardcoded)
- Palavras proibidas: grátis, garantido, melhor idade, etc.
