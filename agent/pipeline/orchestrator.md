# Pipeline de Geração — Orchestrator

> Este documento descreve o fluxo completo de geração de uma landing page, do brief à página final.

## Visão Geral

```
Brief (verbal) → Strategist → Copy Deck → [Review Humano] → Coder → Página Final
```

## Atores

| Ator | Função | Input | Output |
|---|---|---|---|
| **Usuário** | Define o objetivo | — | Brief verbal |
| **Strategist** | Arquiteta estrutura + copy | Brief + REGISTRY.yaml | Copy Deck (YAML) |
| **Reviewer** | Valida copy e estratégia | Copy Deck | Copy Deck aprovado (ou feedback) |
| **Coder** | Implementa em código | Copy Deck + REGISTRY.yaml | Página Astro completa |

## Passo a Passo

### 1. Brief (Usuário → Strategist)

O usuário descreve o que quer em linguagem natural:

```
"Cria uma página de captura para aposentados, foco em alívio emocional,
tráfego vai vir de Meta Ads."
```

O brief pode incluir:
- Audiência (aposentados ou servidores)
- Tipo de estratégia (captura, quiz, remarketing)
- Tom desejado
- Restrições específicas
- Referência a páginas anteriores ("parecida com a 001 mas diferente")

### 2. Strategist Executa

O Strategist:
1. Lê `REGISTRY.yaml` — inventaria o que está disponível
2. Interpreta o brief
3. Consulta `creative-matrix.yaml` — seleciona modelo e combinação
4. Lê libraries de copywriting — fundamenta psicologicamente
5. Gera o Copy Deck completo
6. Valida contra `VALIDATION_CHECKLIST.md` do Strategist
7. Salva em `output/copy-decks/deck-{id}.yaml`

**Comando:**
```
# No Claude Code, com o system prompt do Strategist carregado:
# O Strategist lê: REGISTRY.yaml, creative-matrix.yaml, libraries/*
# O Strategist produz: output/copy-decks/deck-{id}.yaml
```

### 3. Review Humano (Opcional mas Recomendado)

O usuário revisa o Copy Deck:
- Estrutura faz sentido para o objetivo?
- Copy está adequado à audiência?
- Headlines impactam?
- CTAs são claros?
- Algo precisa mudar?

Se precisa de ajustes: feedback ao Strategist → nova versão do Copy Deck.
Se aprovado: segue para o Coder.

### 4. Coder Executa

O Coder:
1. Lê o Copy Deck aprovado
2. Lê `REGISTRY.yaml` — localiza assets e tracking
3. **Cria o diretório de output** em `output/pages/{audiencia}/{NN}_LP_{tipo}/` (numeração sequencial)
4. Implementa FIELMENTE em Astro 5.x + Tailwind CSS 4.x dentro da pasta criada
5. Insere os 3 snippets de tracking
6. Implementa geolocalização de depoimentos
7. Implementa formulário + WhatsApp redirect
8. Valida contra `VALIDATION_CHECKLIST.md` do Coder
9. Entrega página funcional com caminho completo no relatório

**Comando:**
```
# No Claude Code, com o system prompt do Coder carregado:
# O Coder lê: Copy Deck + REGISTRY.yaml + tracking snippets + assets
# O Coder produz: página Astro completa em output/pages/{audiencia}/{NN}_LP_{tipo}/
```

### 5. Entrega

A página é entregue em `output/pages/{audiencia}/{NN}_LP_{tipo}/` como projeto Astro completo.

---

## Diagrama de Decisão

```
Usuário dá brief
     │
     ▼
Strategist lê REGISTRY
     │
     ▼
Strategist consulta creative-matrix
     │
     ├── Objetivo = captura fria? → AIDA ou PAS
     ├── Objetivo = captura morna? → Direct Response ou PAS
     ├── Objetivo = quiz? → Quiz Funnel
     ├── Objetivo = remarketing? → Direct Response ou Story
     └── Objetivo = outro? → Modelo mais adequado
     │
     ▼
Strategist gera Copy Deck
     │
     ▼
Validação automática (schema + checklist)
     │
     ├── FALHOU → Strategist corrige
     │
     ▼
Review humano
     │
     ├── Precisa ajuste → Feedback → Strategist
     │
     ▼
Coder implementa
     │
     ▼
Validação técnica (checklist Coder)
     │
     ├── FALHOU → Coder corrige
     │
     ▼
Página entregue ✓
```

---

## Estrutura de Output

```
output/
  copy-decks/
    deck-captura-aposentados-20260306-a.yaml
    deck-quiz-servidores-20260306-b.yaml
    ...
  pages/
    aposentados/
      00_LP_captura/    ← projeto Astro completo
      01_LP_quiz/
      ...
    funcionarios_publicos/
      00_LP_captura/
      01_LP_captura/
      02_LP_quiz/
      ...
```

**Regra de numeração**: O Coder lista as pastas existentes no diretório da audiência e continua a sequência (00, 01, 02...).

---

## Regras do Pipeline

1. **O Strategist NUNCA vê código.** Ele trabalha em linguagem de alto nível.
2. **O Coder NUNCA modifica copy.** Ele implementa fielmente o Copy Deck.
3. **O Review humano é entre os dois.** É o checkpoint de qualidade.
4. **Cada execução gera um Copy Deck único.** Variação é obrigatória.
5. **O REGISTRY.yaml é lido por ambos os agentes** — mas para propósitos diferentes:
   - Strategist: inventário de assets e frameworks para decisões criativas
   - Coder: localização de arquivos e tracking para implementação técnica

---

## Quando Usar Cada Agente

| Situação | Agente |
|---|---|
| Criar nova landing page do zero | Strategist → Coder |
| Ajustar copy de uma página existente | Strategist (novo Copy Deck) → Coder |
| Corrigir bug técnico em página existente | Coder apenas |
| Adicionar seção a página existente | Strategist (atualiza Copy Deck) → Coder |
| Trocar tracking/config técnica | Coder apenas |
| Testar variante A/B de copy | Strategist (nova variante) → Coder |
