# Validation — Landing Page Factory

Ferramentas de validação para a Landing Page Factory da Resolvver.

## Validators disponíveis

### 1. Copy Deck Validator (principal)

Valida Copy Decks YAML produzidos pelo Strategist, antes de enviar ao Coder.

```bash
node validate-copy-deck.js <path-to-copy-deck.yaml>
```

Exemplo:
```bash
node validate-copy-deck.js ../output/copy-decks/deck-captura-aposentados-20260305-a.yaml
```

O que valida:

- **Estrutura obrigatória**: metadata, brief, strategy_selection, sections, conversion, footer
- **Metadata**: deck_id, audience, objective, strategy_type, structure_model
- **Brief**: raw_input e interpreted_objective preenchidos
- **Estratégia**: model definido, rationale documentado, awareness_level e primary_triggers
- **Palavras proibidas**: grátis, garantido, melhor idade, sem custo, milagre, etc.
- **Seções**: mínimo 3 seções, headlines não-vazias, frameworks documentados
- **Conversão**: WhatsApp message_template, min_value de qualificação, sem número hardcoded
- **Valores financeiros**: regra 75% (`valor_depois = valor_antes × 0.25`)
- **Regras por audiência**: aposentados não devem ter percentuais (sempre R$)

Saída:

- `🔴 ERROS` — devem ser corrigidos antes de enviar ao Coder
- `🟡 AVISOS` — recomendados mas não bloqueantes
- `✅ APROVADO` / `❌ REPROVADO`

Exit codes: `0` = aprovado, `1` = reprovado.

### 2. Config Validator (legacy)

> **⚠️ LEGACY** — Valida configs YAML v1 (arquivados em `archive/configs/`). Mantido apenas para referência histórica.

```bash
node validate-config.js <path-to-config.yaml>
```

Requer `npm install` (dependências: ajv, js-yaml).

## Pré-requisitos

- Node.js >= 14
- O Copy Deck validator não requer dependências externas
- O Config validator (legacy) requer: `cd validation && npm install`
