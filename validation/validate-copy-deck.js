#!/usr/bin/env node

/**
 * Copy Deck Validator — Landing Page Factory
 *
 * Valida um Copy Deck YAML contra o schema e regras de negócio.
 * Executar após o Strategist produzir o Copy Deck, antes de enviar ao Coder.
 *
 * Usage: node validate-copy-deck.js <path-to-copy-deck.yaml>
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// YAML Parser (lightweight, no dependencies)
// ============================================================================

function parseYAMLLite(content) {
  // For production, use js-yaml. This is a structural validator.
  // It checks for presence of required fields via regex/string matching.
  return content;
}

// ============================================================================
// Validation Rules
// ============================================================================

const PROHIBITED_WORDS = [
  'grátis', 'garantido', 'rápido e fácil', 'melhor idade', 'terceira idade',
  'sem custo', 'consulte grátis', 'simulação sem compromisso', 'análise gratuita',
  'milagre', 'sem burocracia', 'dinheiro fácil', 'resolve tudo',
  'PARABÉNS! Você foi selecionado',
  'APENAS HOJE', 'ÚLTIMA CHANCE', 'ÚLTIMAS VAGAS'
];

// "site" é proibido como palavra isolada em TODO o copy (usar "página")
// Separado da lista acima porque requer word-boundary match (não substring)
const PROHIBITED_WORD_BOUNDARY = [
  { word: 'site', replacement: 'página', reason: '"site" é o canal institucional, "página" é a landing page' }
];

const REQUIRED_METADATA_FIELDS = [
  'deck_id', 'created_date', 'audience', 'objective', 'strategy_type', 'structure_model'
];

const REQUIRED_TOP_LEVEL = [
  'metadata', 'brief', 'strategy_selection', 'sections', 'conversion', 'footer'
];

const VALID_AUDIENCES = ['aposentados', 'servidores_publicos'];

const VALID_MODELS = ['AIDA', 'PAS', 'Story', 'Direct Response', 'Quiz Funnel'];

// ============================================================================
// Validator Functions
// ============================================================================

function createResult(type, rule, message) {
  return { type, rule, message };
}

function validateRequiredSections(content) {
  const results = [];

  REQUIRED_TOP_LEVEL.forEach(section => {
    const regex = new RegExp(`^${section}:`, 'm');
    if (!regex.test(content)) {
      results.push(createResult('ERROR', 'STRUCTURE', `Seção obrigatória ausente: ${section}`));
    }
  });

  return results;
}

function validateMetadata(content) {
  const results = [];

  REQUIRED_METADATA_FIELDS.forEach(field => {
    const regex = new RegExp(`\\b${field}:\\s*".+"`, 'm');
    const regexUnquoted = new RegExp(`\\b${field}:\\s*\\S+`, 'm');
    if (!regex.test(content) && !regexUnquoted.test(content)) {
      results.push(createResult('ERROR', 'METADATA', `Campo obrigatório de metadata vazio ou ausente: ${field}`));
    }
  });

  // Validate audience value
  const audienceMatch = content.match(/audience:\s*"?(\w+)"?/);
  if (audienceMatch && !VALID_AUDIENCES.includes(audienceMatch[1])) {
    results.push(createResult('ERROR', 'METADATA', `Audiência inválida: ${audienceMatch[1]}. Valores válidos: ${VALID_AUDIENCES.join(', ')}`));
  }

  return results;
}

function validateBrief(content) {
  const results = [];

  if (!/raw_input:\s*\|?\s*\n\s+\S/.test(content) && !/raw_input:\s*".+"/.test(content)) {
    results.push(createResult('ERROR', 'BRIEF', 'brief.raw_input está vazio — o brief original deve ser registrado'));
  }

  if (!/interpreted_objective:\s*\|?\s*\n\s+\S/.test(content) && !/interpreted_objective:\s*".+"/.test(content)) {
    results.push(createResult('ERROR', 'BRIEF', 'brief.interpreted_objective está vazio — a interpretação do Strategist deve ser registrada'));
  }

  return results;
}

function validateStrategySelection(content) {
  const results = [];

  if (!/model:\s*".+"/.test(content) && !/model:\s*\S+/.test(content)) {
    results.push(createResult('ERROR', 'STRATEGY', 'strategy_selection.model está vazio'));
  }

  if (!/rationale:\s*\|?\s*\n\s+\S/.test(content) && !/rationale:\s*".+"/.test(content)) {
    results.push(createResult('WARNING', 'STRATEGY', 'strategy_selection.rationale não documentado — recomendado para rastreabilidade'));
  }

  if (!/awareness_level:/.test(content)) {
    results.push(createResult('WARNING', 'STRATEGY', 'awareness_level não definido'));
  }

  if (!/primary_triggers:/.test(content)) {
    results.push(createResult('WARNING', 'STRATEGY', 'primary_triggers não definidos'));
  }

  return results;
}

function validateProhibitedWords(content) {
  const results = [];
  const lowerContent = content.toLowerCase();

  PROHIBITED_WORDS.forEach(word => {
    if (lowerContent.includes(word.toLowerCase())) {
      results.push(createResult('ERROR', 'PROHIBITED', `Palavra proibida encontrada: "${word}"`));
    }
  });

  // Word-boundary checks (palavras curtas que precisam de match exato)
  PROHIBITED_WORD_BOUNDARY.forEach(({ word, replacement, reason }) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(content)) {
      results.push(createResult('ERROR', 'PROHIBITED',
        `Palavra proibida encontrada: "${word}" — usar "${replacement}" (${reason})`));
    }
  });

  return results;
}

function validateSections(content) {
  const results = [];

  // Check that sections exist and have content
  const sectionMatches = content.match(/- section_id:/g);
  if (!sectionMatches || sectionMatches.length < 3) {
    results.push(createResult('ERROR', 'SECTIONS', `Copy Deck tem ${sectionMatches ? sectionMatches.length : 0} seções — mínimo é 3`));
  }

  // Check for empty headlines
  const emptyHeadlines = content.match(/headline:\s*\n\s+text:\s*""\s*\n/g);
  if (emptyHeadlines) {
    results.push(createResult('ERROR', 'SECTIONS', `${emptyHeadlines.length} headline(s) com texto vazio — Strategist deve preencher TODOS`));
  }

  // Check for framework documentation
  const headlineCount = (content.match(/headline:/g) || []).length;
  const frameworkCount = (content.match(/framework:/g) || []).length;
  if (frameworkCount < headlineCount * 0.5) {
    results.push(createResult('WARNING', 'SECTIONS', 'Poucas headlines com framework documentado — rastreabilidade comprometida'));
  }

  return results;
}

function validateConversion(content) {
  const results = [];

  if (!/message_template:/.test(content)) {
    results.push(createResult('ERROR', 'CONVERSION', 'whatsapp.message_template ausente'));
  }

  if (!/min_value:\s*\d+/.test(content)) {
    results.push(createResult('ERROR', 'CONVERSION', 'qualification.min_value não definido'));
  }

  // Check for hardcoded WhatsApp numbers
  const whatsappNumber = content.match(/(?:55\d{10,11}|whatsapp\.com\/send\?phone=\d+)/);
  if (whatsappNumber) {
    results.push(createResult('ERROR', 'CONVERSION', `Número de WhatsApp hardcoded encontrado: ${whatsappNumber[0]} — Wolfgang gerencia o número`));
  }

  // Check for transition screen copy
  if (!/transition_copy:/.test(content) && !/countdown_text:/.test(content)) {
    results.push(createResult('WARNING', 'CONVERSION', 'Copy da tela de transição ausente — Coder precisará de defaults'));
  }

  return results;
}

function validateFinancialValues(content) {
  const results = [];

  // Check that values follow 75% rule
  const beforeAfterPairs = content.match(/before_value:\s*(\d+(?:\.\d+)?)\s*\n\s*after_value:\s*(\d+(?:\.\d+)?)/g);
  if (beforeAfterPairs) {
    beforeAfterPairs.forEach(pair => {
      const [, before, after] = pair.match(/before_value:\s*(\d+(?:\.\d+)?)\s*\n\s*after_value:\s*(\d+(?:\.\d+)?)/);
      const expectedAfter = parseFloat(before) * 0.25;
      const actualAfter = parseFloat(after);
      if (Math.abs(expectedAfter - actualAfter) > 1) {
        results.push(createResult('ERROR', 'FINANCIAL',
          `Valores não seguem regra 75%: antes=${before}, depois=${after} (esperado: ${expectedAfter.toFixed(2)})`));
      }
    });
  }

  return results;
}

function validateAudienceRules(content) {
  const results = [];
  const audienceMatch = content.match(/audience:\s*"?(\w+)"?/);

  if (!audienceMatch) return results;
  const audience = audienceMatch[1];

  if (audience === 'aposentados') {
    // Check for percentages (should use R$ values instead)
    const percentInCopy = content.match(/\d+%/g);
    if (percentInCopy) {
      results.push(createResult('WARNING', 'AUDIENCE',
        `Audiência aposentados: encontrado ${percentInCopy.length} percentual(is) — NUNCA usar percentuais, sempre R$`));
    }
  }

  return results;
}

function validateAtuacaoNacional(content) {
  const results = [];
  const lowerContent = content.toLowerCase();

  // R11: At least one element must communicate national coverage
  const nationalTerms = [
    'todo o brasil', 'todo brasil', 'brasil inteiro', 'todos os estados',
    'atuação em todo', 'atendemos todo', 'norte a sul',
    'atuação nacional', 'cobertura nacional', '100% digital'
  ];

  const hasNationalMention = nationalTerms.some(term => lowerContent.includes(term));
  if (!hasNationalMention) {
    results.push(createResult('ERROR', 'R11-ATUAÇÃO',
      'Nenhuma menção de atuação nacional encontrada — R11 exige pelo menos 1 elemento comunicando cobertura Brasil inteiro'));
  }

  // Check footer specifically
  const footerSection = content.match(/^footer:[\s\S]*?(?=^[a-z_]+:|$)/m);
  if (footerSection) {
    const footerLower = footerSection[0].toLowerCase();
    const hasFooterNational = nationalTerms.some(term => footerLower.includes(term));
    if (!hasFooterNational) {
      results.push(createResult('WARNING', 'R11-FOOTER',
        'Footer não contém menção de atuação nacional — R11 recomenda "Atuação em todo o Brasil" junto ao endereço'));
    }
  }

  return results;
}

function validateAppAcompanhamento(content) {
  const results = [];
  const lowerContent = content.toLowerCase();

  // S6: FAQ/timeline responses should mention both WhatsApp + app
  const hasAppMention = ['aplicativo', 'app de acompanhamento', 'app em tempo real', 'nosso app', 'pelo app']
    .some(term => lowerContent.includes(term));

  if (!hasAppMention) {
    results.push(createResult('WARNING', 'S6-APP',
      'Nenhuma menção ao aplicativo de acompanhamento encontrada — S6 recomenda mencionar WhatsApp + app em respostas sobre prazo/timeline'));
  }

  return results;
}

function validateFormRules(content) {
  const results = [];
  const lowerContent = content.toLowerCase();

  // R12: WhatsApp message must be dynamic (contain variables)
  // Handle both inline and multiline YAML (message_template: | or message_template: "...")
  const messageSection = content.match(/message_template:\s*\|?\s*\n([\s\S]*?)(?=\n\s*\w+:|$)/m);
  const messageInline = content.match(/message_template:\s*["'](.+?)["']/);
  const messageContent = messageSection ? messageSection[1] : (messageInline ? messageInline[1] : null);
  if (messageContent) {
    if (!messageContent.includes('{first_name}') && !messageContent.includes('{nome}')) {
      results.push(createResult('WARNING', 'R12-MSG',
        'Mensagem WhatsApp não contém {first_name} — R12 exige mensagem dinâmica com variáveis do formulário'));
    }
    // "site" proibido: agora validado GLOBALMENTE em validateProhibitedWords()
    // (não precisa de check separado aqui)
  }

  // Check phone field label is "WhatsApp" not "Telefone"
  if (lowerContent.includes('label:') && lowerContent.includes('telefone') && !lowerContent.includes('whatsapp')) {
    results.push(createResult('ERROR', 'FORM-LABEL',
      'Campo de telefone DEVE usar label "WhatsApp" — NUNCA "Telefone" (R4.1)'));
  }

  // Check servidores don't have "órgão" as a form FIELD (not in FAQ/copy text)
  // Only flag if "orgao"/"órgão" appears as a field name or label within the form section
  const audienceMatch = content.match(/audience:\s*"?(\w+)"?/);
  if (audienceMatch && audienceMatch[1] === 'servidores_publicos') {
    const formSection = content.match(/form:\s*\n([\s\S]*?)(?=\n\s*qualification:|$)/m);
    if (formSection) {
      const formLower = formSection[1].toLowerCase();
      if (formLower.includes('orgao') || formLower.includes('órgão')) {
        results.push(createResult('ERROR', 'FORM-CAMPO',
          'Servidores: encontrado campo "órgão" no formulário — solicitar apenas "cargo" (campo aberto)'));
      }
    }
  }

  return results;
}

// ============================================================================
// R0: Português Impecável
// ============================================================================

function validatePortugues(content) {
  const results = [];

  // Common missing-accent patterns in Portuguese copy about consignado/finance
  // Each pattern: [regex for wrong form, correct form, description]
  const accentChecks = [
    [/\breducao\b/gi, 'redução', 'falta acento: "reducao" → "redução"'],
    [/\bacao\b/gi, 'ação', 'falta acento: "acao" → "ação"'],
    [/\bsituacao\b/gi, 'situação', 'falta acento: "situacao" → "situação"'],
    [/\bcomunicacao\b/gi, 'comunicação', 'falta acento: "comunicacao" → "comunicação"'],
    [/\binformacao\b/gi, 'informação', 'falta acento: "informacao" → "informação"'],
    [/\banalise\b/gi, 'análise', 'falta acento: "analise" → "análise"'],
    [/\bjuridica\b/gi, 'jurídica', 'falta acento: "juridica" → "jurídica"'],
    [/\bhonorarios\b/gi, 'honorários', 'falta acento: "honorarios" → "honorários"'],
    [/\bapos\b/gi, 'após', 'falta acento: "apos" → "após"'],
    [/\bnao\b/gi, 'não', 'falta acento: "nao" → "não"'],
    [/\bvoce\b/gi, 'você', 'falta acento: "voce" → "você"'],
    [/\bja\b/gi, 'já', 'falta acento: "ja" → "já"'],
    [/\bate\b/gi, 'até', 'falta acento: "ate" → "até"'],
    [/\be\b(?=\s+[a-záàâãéèêíïóôõúüç])/gi, null, null], // skip — "e" is valid
    [/\bjustica\b/gi, 'Justiça', 'falta acento: "justica" → "Justiça"'],
    [/\bprotocolar\b/gi, null, null], // valid word, skip
  ];

  // Extract all text values from YAML (lines that contain copy)
  const copyLines = content.split('\n').filter(line => {
    const trimmed = line.trim();
    // Skip YAML keys, comments, and structural lines
    if (trimmed.startsWith('#') || trimmed.startsWith('---') || trimmed.startsWith('-')) return false;
    // Include lines with text content (after colon or pipe blocks)
    return trimmed.includes(':') || /^[A-Za-záàâãéèêíïóôõúüçÁÀÂÃÉÈÊÍÏÓÔÕÚÜÇ]/.test(trimmed);
  });

  const copyText = copyLines.join('\n');

  accentChecks.forEach(([regex, correct, desc]) => {
    if (!correct) return; // skip entries marked as valid
    if (regex.test(copyText)) {
      results.push(createResult('ERROR', 'R0-PORTUGUES', desc));
    }
  });

  // Check for common informal abbreviations in copy
  const informalChecks = [
    [/\bpra\b/gi, '"pra" → "para"'],
    [/\btá\b/gi, '"tá" → "está"'],
    [/\bné\b/gi, '"né" → "não é"'],
    [/\bvc\b/gi, '"vc" → "você"'],
    [/\btbm\b/gi, '"tbm" → "também"'],
  ];

  informalChecks.forEach(([regex, desc]) => {
    if (regex.test(copyText)) {
      results.push(createResult('WARNING', 'R0-INFORMAL',
        `Abreviação informal detectada: ${desc}`));
    }
  });

  return results;
}

// ============================================================================
// Main Execution
// ============================================================================

function validate(filePath) {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║        COPY DECK VALIDATOR — Landing Page Factory       ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Arquivo não encontrado: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  console.log(`📄 Validando: ${path.basename(filePath)}\n`);

  const allResults = [
    ...validateRequiredSections(content),
    ...validateMetadata(content),
    ...validateBrief(content),
    ...validateStrategySelection(content),
    ...validateProhibitedWords(content),
    ...validateSections(content),
    ...validateConversion(content),
    ...validateFinancialValues(content),
    ...validateAudienceRules(content),
    ...validateAtuacaoNacional(content),
    ...validateAppAcompanhamento(content),
    ...validateFormRules(content),
    ...validatePortugues(content),
  ];

  const errors = allResults.filter(r => r.type === 'ERROR');
  const warnings = allResults.filter(r => r.type === 'WARNING');

  // Print results
  if (errors.length > 0) {
    console.log('🔴 ERROS (devem ser corrigidos):');
    errors.forEach(e => console.log(`   ❌ [${e.rule}] ${e.message}`));
    console.log('');
  }

  if (warnings.length > 0) {
    console.log('🟡 AVISOS (recomendados corrigir):');
    warnings.forEach(w => console.log(`   ⚠️  [${w.rule}] ${w.message}`));
    console.log('');
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('🟢 Copy Deck válido — nenhum problema encontrado!\n');
  }

  // Summary
  console.log('─────────────────────────────────────────');
  console.log(`Resultado: ${errors.length} erro(s), ${warnings.length} aviso(s)`);

  if (errors.length === 0) {
    console.log('✅ Copy Deck APROVADO para o Coder');
  } else {
    console.log('❌ Copy Deck REPROVADO — corrija os erros antes de enviar ao Coder');
  }
  console.log('─────────────────────────────────────────\n');

  process.exit(errors.length > 0 ? 1 : 0);
}

// CLI
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node validate-copy-deck.js <path-to-copy-deck.yaml>');
  console.log('Example: node validate-copy-deck.js output/copy-decks/deck-captura-aposentados-20260305-a.yaml');
  process.exit(1);
}

validate(args[0]);
