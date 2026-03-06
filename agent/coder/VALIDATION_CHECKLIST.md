# Validation Checklist — Coder Agent

> Execute TODOS estes checks após implementar a página.

## Português Impecável

- [ ] ZERO erros de acentuação em todo texto visível (acentos, cedilhas, crases)
- [ ] Alt texts, aria-labels, meta tags e placeholders com português perfeito
- [ ] Mensagens de erro e validação com acentuação completa
- [ ] Nomes próprios capitalizados (Resolvver, Brasil, INSS, Justiça)

## Diretório de Output

- [ ] Página criada dentro de `output/pages/{audiencia}/` (aposentados ou funcionarios_publicos)
- [ ] Pasta nomeada com numeração sequencial: `{NN}_LP_{tipo}` (ex: `03_LP_captura`)
- [ ] Numeração continua a partir das pastas já existentes no diretório da audiência
- [ ] TODO o projeto Astro está DENTRO desta pasta (nenhum arquivo fora)

## Fidelidade ao Copy Deck

- [ ] TODAS as headlines implementadas EXATAMENTE como no Copy Deck
- [ ] TODOS os CTAs implementados com texto, action e style corretos
- [ ] Seções na MESMA ordem do Copy Deck
- [ ] Nenhuma seção adicionada ou removida
- [ ] Nenhum copy inventado pelo Coder (campos vazios marcados como `<!-- COPY PENDENTE -->`)
- [ ] Annotations do Strategist preservadas como comentários HTML

## Tracking — 3 Snippets

- [ ] Wolfgang snippet presente no `<head>` (PRIMEIRO)
- [ ] GA4 snippet presente no `<head>` (SEGUNDO)
- [ ] Clarity snippet presente no `<head>` (TERCEIRO)
- [ ] Snippets inseridos INTEIROS sem nenhuma modificação
- [ ] ZERO código manual de pixel/fbq/gtag/clarity gerado
- [ ] ZERO chamadas fetch/XMLHttpRequest para backend de tracking
- [ ] Tracking events do Copy Deck implementados como data attributes

## Técnico

- [ ] Astro 5.x configurado corretamente
- [ ] Tailwind CSS 4.x com design tokens da Resolvver
- [ ] TypeScript sem erros
- [ ] Formulário tem validação client-side
- [ ] WhatsApp redirect usa `location.assign()` (Wolfgang intercepta)
- [ ] Mensagem wa.me monta dinamicamente com variáveis do formulário ({first_name}, {cargo}, etc.)
- [ ] ZERO número de WhatsApp hardcoded
- [ ] Qualificação por valor mínimo implementada
- [ ] Tela de transição com countdown 5s + botão fallback
- [ ] Contingência email para desqualificados

## Formulário (R4.1)

- [ ] Campo telefone usa label "WhatsApp" (não "Telefone")
- [ ] Campo nome: `autocomplete="name"` + splitting first_name/last_name
- [ ] Campo WhatsApp: `autocomplete="tel"`
- [ ] Campo email: `autocomplete="email"`
- [ ] Servidores: campo "cargo" é texto aberto (sem órgão)
- [ ] Cargo: validação bloqueia números e caracteres especiais (acentos OK)

## Design — Mobile-First

- [ ] Fonte mínima 16px em todo body text
- [ ] Touch targets ≥ 56x56px em todos os botões/links
- [ ] CTA primário acima do fold
- [ ] Container max-width 1200px
- [ ] Scroll vertical apenas (zero carrosséis, swipes horizontais)
- [ ] Layout responsivo: mobile default, desktop via `md:` / `lg:`
- [ ] Design tokens aplicados (cores, tipografia, espaçamento)

## Acessibilidade

- [ ] Todas as imagens têm alt text descritivo
- [ ] Todos os campos de form têm `<label>` visível
- [ ] Estrutura de headings correta (h1 → h2 → h3, sem pular níveis)
- [ ] Contraste > 4.5:1 em todo texto sobre fundo
- [ ] aria-labels em ícones decorativos e botões de ação
- [ ] Formulário navegável via teclado (tab order correto)

## Performance

- [ ] Hero image com `loading="eager"`
- [ ] Demais imagens com `loading="lazy"`
- [ ] Fotos em WebP com fallback JPG via `<picture>`
- [ ] Ícones via Lucide (não imagens)
- [ ] CSS gradients preferidos a imagens de background
- [ ] Peso estimado ≤ 500KB (aposentados) / ≤ 600KB (servidores)

## Imagens Genéricas

- [ ] Imagens genéricas indicadas pelo Strategist no `visual_intent` implementadas
- [ ] Path correto: `assets/pessoas/genericas/{audiencia}/{arquivo}.webp`
- [ ] Implementadas com `<picture>` + WebP (fallback JPG se disponível)
- [ ] Nomes com espaços tratados corretamente no src
- [ ] Hero image genérica com `loading="eager"`, demais `loading="lazy"`
- [ ] Alt text descritivo em cada imagem genérica

## Depoimentos

- [ ] Geolocalização implementada via IPData (server-side)
- [ ] Filtro por audiência + região + aprovado: true + texto não-vazio
- [ ] Alternância de gênero M→F→M→F
- [ ] Cidade do VISITANTE exibida (não da foto)
- [ ] Valores seguem regra 75%
- [ ] Fallback implementado: região vizinha → avatar CSS

## Footer

- [ ] Logo Resolvver presente
- [ ] CNPJ: 64.933.842/0001-89
- [ ] Endereço completo
- [ ] **"Atuação em todo o Brasil"** presente junto ao endereço (R7)
- [ ] Email: contato@resolvver.com
- [ ] Links legais (se no Copy Deck)
- [ ] Copyright com ano atual

## SEO

- [ ] `<title>` conforme `seo.title` do Copy Deck
- [ ] `<meta name="description">` conforme Copy Deck
- [ ] OG tags (og:title, og:description, og:image)
- [ ] OG Image endpoint `/api/og.png` configurado
- [ ] `<html lang="pt-BR">`
