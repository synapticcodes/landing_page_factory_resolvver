# Landing Page Factory — Resolvver

Repositório de fábrica de landing pages da Resolvver, orientado por configuração (`YAML`) e validação automatizada.

O projeto centraliza:
- configuração de páginas (`configs/`);
- schema mestre (`schemas/`);
- bibliotecas de audiência, comunicação, copy, componentes, tracking e design tokens (`libraries/`);
- regras de estratégia (`strategies/`);
- acervo de mídia (`assets/`);
- validador técnico e de regras de negócio (`validation/`).

## Objetivo

Permitir que agentes LLM gerem landing pages com alta consistência, seguindo regras de copy, UX, tracking e qualificação, sem depender de decisões ad hoc em cada nova página.

## Estrutura do repositório

```text
landing_page_factory/
├── agent/                      # Regras operacionais do agente gerador
├── assets/                     # Logos, fotos, ícones e índices de mídia
├── configs/                    # Configs das páginas e template base
├── libraries/                  # Bases de conhecimento e blocos reutilizáveis
├── schemas/                    # JSON Schema da configuração da página
├── strategies/                 # Regras de estratégia (captura e quiz)
└── validation/                 # Script Node.js para validação de configs
```

## Fluxo recomendado

1. Copiar `configs/_TEMPLATE.yaml` para um novo arquivo `configs/NNN-estrategia-audiencia.yaml`.
2. Preencher `metadata`, `audience`, `strategy`, `sections`, `conversion` e `tracking`.
3. Garantir que todos os caminhos `*_ref` apontam para arquivos existentes em `libraries/` ou `strategies/`.
4. Validar com o script em `validation/`.
5. Corrigir erros e só então usar o config como entrada para geração da landing page.

## Estratégias suportadas

- `captura`: formulário direto com qualificação e redirecionamento para WhatsApp.
- `quiz`: fluxo interativo (4 ou 5 etapas), cálculo de economia estimada, captura de dados e redirecionamento para WhatsApp.

Regras de estratégia:
- `strategies/captura/rules.yaml`
- `strategies/quiz/rules.yaml`
- `strategies/quiz/scoring.yaml`

## Audiências suportadas

- `aposentados`
- `servidores_publicos`

Perfis e comunicação por audiência:
- `libraries/audiences/*.yaml`
- `libraries/communication/*.yaml`

## Validação (schema + negócio)

Validador: `validation/validate-config.js`  
Schema: `schemas/page-config.schema.json`

O validador cobre:
- estrutura obrigatória via JSON Schema;
- existência de referências `*_ref`;
- palavras proibidas em strings;
- unicidade de `section_id`;
- presença mínima de seções críticas (`hero` e `form`/`quiz`);
- formato de WhatsApp (`55` + DDD + número);
- valor mínimo de qualificação;
- consistência de audiência.

### Pré-requisitos

- Node.js `>= 14`
- npm

### Comandos

```bash
cd validation
npm install

# valida todos os arquivos em ../configs (exceto arquivos iniciados por "_")
npm run validate

# valida com saída detalhada
npm run validate:verbose

# valida um arquivo específico
node validate-config.js ../configs/001-captura-aposentados.yaml
```

## Configs atualmente no repositório

- `configs/001-captura-aposentados.yaml`
- `configs/002-captura-servidores.yaml`
- `configs/003-quiz-aposentados.yaml`
- `configs/004-quiz-servidores.yaml`
- `configs/_TEMPLATE.yaml`

## Arquivos-chave para operação do agente

- `agent/SYSTEM_PROMPT.md`: instrução principal do agente gerador.
- `agent/GENERATION_RULES.md`: regras hard/soft de geração.
- `agent/VALIDATION_CHECKLIST.md`: checklist de validação pré e pós-geração.
- `libraries/copywriting/_INDEX.yaml`: índice da base de conhecimento de copy.
- `assets/_INDEX.yaml`: índice do acervo de mídia e convenções.

## Observações importantes

- O repositório é a camada de configuração e governança; a implementação final da landing page (Astro/Tailwind) é gerada a partir desses insumos.
- Todo conteúdo é orientado para `pt-BR` e para as regras de comunicação de cada audiência.
