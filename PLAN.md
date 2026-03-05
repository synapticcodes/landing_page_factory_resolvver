# Plano: 02_captura_funcionarios_publicos

## Objetivo
Criar uma **segunda página de captura** para funcionários públicos em:
`/Users/wolfgangpitta/Desktop/páginas_captura/páginas_funcionarios_publicos/02_captura_funcionarios_publicos/`

## Referência base
A página `01_captura_funcionarios_publicos` já existe e serve como referência de stack, estrutura e qualidade. A nova página DEVE ser **diferente em copy, fórmulas de headline, gatilhos psicológicos e abordagem**, conforme regra de variação do SYSTEM_PROMPT.

## Stack (idêntica à 01)
- **Astro 5.x** + **Tailwind CSS 4.x** + TypeScript
- Mesmos design tokens (`global.css`)
- Mesmo layout (`Layout.astro`) com Wolfgang snippet + GA4 + Clarity
- Mesmas variáveis de ambiente (`.env.example`)

## Diferenciação obrigatória vs 01

| Aspecto | Página 01 | Página 02 (NOVA) |
|---|---|---|
| **Fórmula headline** | Number/Statistics (35% do salário) | **PAS (Problem-Agitate-Solve)** — foco na dor de ver o salário diminuir mês a mês |
| **Gatilho primário** | Autoridade + dados | **Aversão à perda** (Kahneman) — quanto está perdendo por não agir |
| **CTA hero** | "Quero otimizar meu consignado" | **"Descobrir quanto estou perdendo"** — curiosidade + perda |
| **Caso de uso** | Servidor federal R$ 7.200 | **Servidor estadual R$ 5.500** — cenário diferente, mais acessível |
| **FAQ** | Base legal, bloqueio bancário, esferas, tempo, custo, sem redução | **Rotacionar**: sigilo no órgão, múltiplos contratos, ativos vs aposentados-servidores, impacto no contracheque, prazo para resultado, risco zero |
| **Prova Social headline** | "Servidores que já otimizaram..." | **"O que servidores como você já economizaram"** |
| **Abordagem geral** | Analítico/dados-primeiro | **Perda/urgência racional** — quanto perde por mês por não agir |

## Estrutura de arquivos (espelho da 01)

```
02_captura_funcionarios_publicos/
├── .env.example
├── .gitignore
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   ├── logo.png
│   ├── logo-branco.png
│   ├── logo-transparente.png
│   ├── logo.svg
│   ├── logo-branco.svg
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── favicon-32x32.png
│   ├── favicon-48x48.png
│   └── depoimentos/  (mesmas 20 fotos)
└── src/
    ├── env.d.ts
    ├── styles/global.css
    ├── layouts/Layout.astro  (com Wolfgang snippet INTEIRO no <head>)
    ├── scripts/tracking.ts
    ├── pages/index.astro
    └── components/
        ├── Hero.astro          (PAS formula)
        ├── Legitimidade.astro  (trust cards)
        ├── CasoUso.astro       (servidor estadual R$ 5.500)
        ├── Processo.astro      (4 etapas)
        ├── ProvaSocial.astro   (IPData + 20 depoimentos)
        ├── Credenciais.astro   (dados institucionais)
        ├── FAQ.astro           (6 perguntas rotacionadas)
        ├── FormCaptura.astro   (4 campos + qualificação R$ 3.000)
        └── Footer.astro        (CNPJ real: 64.933.842/0001-89)
```

## Seções da página (ordem)

1. **Hero** — PAS: Problema (parcela alta comprometendo planos) → Agitação (cada mês que passa é dinheiro perdido) → Solução (redução judicial)
2. **Legitimidade** — 4 trust cards (Google 4.8, CNPJ, Reclame AQUI, Volume)
3. **Caso de Uso** — Antes/Depois com servidor estadual R$ 5.500
4. **Processo** — 4 etapas profissionais
5. **Prova Social** — 20 depoimentos dinâmicos com IPData (mesma base da 01, mesmo código)
6. **Credenciais** — Dados jurídicos + resultados
7. **FAQ** — 6 perguntas rotacionadas (diferentes da 01)
8. **FormCaptura** — 4 campos, qualificação R$ 3.000, WhatsApp redirect
9. **Footer** — CNPJ real, endereço real

## Regras invioláveis

- [x] Wolfgang snippet INTEIRO copiado no `<head>` (de `libraries/tracking/wolfgang-snippet.html`)
- [x] ZERO código de pixel/fbq manual — Wolfgang faz tudo
- [x] ZERO número de WhatsApp hardcoded — Wolfgang gerencia
- [x] WhatsApp redirect via `location.assign()`
- [x] Qualificação min R$ 3.000
- [x] CNPJ real: 64.933.842/0001-89
- [x] Endereço real: Av. Carlos Gomes, 700, Boa Vista — 90480-000 Porto Alegre - RS
- [x] Fontes >= 16px, touch targets >= 56px
- [x] Mobile-first
- [x] ZERO palavras proibidas
- [x] Depoimentos do manifest (não inventados)
- [x] Alternância M/F nos depoimentos
- [x] Countdown 5s + botão fallback "ABRIR WHATSAPP AGORA"

## Passos de implementação

1. Criar diretório `02_captura_funcionarios_publicos/` com scaffolding Astro
2. Copiar assets estáticos (`public/`) — logos, favicons, fotos de depoimentos
3. Criar arquivos de configuração (`package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `.env.example`)
4. Criar `src/styles/global.css` (design tokens idênticos)
5. Criar `src/env.d.ts`
6. Criar `src/layouts/Layout.astro` com Wolfgang snippet COMPLETO
7. Criar `src/scripts/tracking.ts`
8. Criar componentes (Hero → Legitimidade → CasoUso → Processo → ProvaSocial → Credenciais → FAQ → FormCaptura → Footer)
9. Criar `src/pages/index.astro`
10. Rodar `npm install` para verificar que o projeto builda
11. Validar checklist (palavras proibidas, CNPJ, acessibilidade)
