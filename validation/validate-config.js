#!/usr/bin/env node

/**
 * Landing Page Configuration Validator
 * Validates YAML config files against JSON Schema and custom business rules
 *
 * Usage:
 *   node validate-config.js [path/to/config.yaml] [--verbose]
 *   node validate-config.js --verbose (validates all configs/*.yaml)
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Ajv = require('ajv');

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const FORBIDDEN_WORDS = [
  'grátis',
  'gratuito',
  'gratuita',
  'sem custo',
  '0800',
  'garantia',
  'garantido',
  'garantimos',
  'promessa',
  'prometo',
  'prometemos',
  '100%',
  'infalível',
  'milagre'
];

const KNOWN_AUDIENCES = ['aposentados', 'servidores_publicos'];

const SECTION_TYPE_REQUIREMENTS = {
  hero: { required: true, minCount: 1 },
  form: { required: false, minCount: 0 }, // form OR quiz required
  quiz: { required: false, minCount: 0 }   // form OR quiz required
};

// Color codes for terminal output
const COLORS = {
  RESET: '\x1b[0m',
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  CYAN: '\x1b[36m',
  GRAY: '\x1b[90m'
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Prints colored console output
 */
function log(status, message) {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  let icon = '';
  let color = '';

  if (status === 'pass') {
    icon = '✅';
    color = COLORS.GREEN;
  } else if (status === 'fail') {
    icon = '❌';
    color = COLORS.RED;
  } else if (status === 'warn') {
    icon = '⚠️ ';
    color = COLORS.YELLOW;
  } else if (status === 'info') {
    icon = 'ℹ️ ';
    color = COLORS.CYAN;
  }

  console.log(`${color}${icon} ${message}${COLORS.RESET}`);
}

/**
 * Prints a section header
 */
function logHeader(title) {
  console.log(`\n${COLORS.CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.RESET}`);
  console.log(`${COLORS.CYAN}${title}${COLORS.RESET}`);
  console.log(`${COLORS.CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.RESET}`);
}

/**
 * Logs details with verbose mode
 */
function logDetail(message, verbose) {
  if (verbose) {
    console.log(`${COLORS.GRAY}  → ${message}${COLORS.RESET}`);
  }
}

/**
 * Resolves file path relative to landing_page_factory directory
 */
function resolvePath(relativePath, baseDir) {
  return path.join(baseDir, relativePath);
}

/**
 * Checks if a file exists
 */
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Fields that contain CSS/technical values where "100%" is legitimate
const TECHNICAL_FIELD_PATTERNS = [
  /\.visual\./,
  /\.background$/,
  /\.spacing\./,
  /\.layout$/,
  /\.text_color$/,
  /\.style$/
];

/**
 * Checks if a field path is a technical/CSS field where "100%" is valid
 */
function isTechnicalField(path) {
  return TECHNICAL_FIELD_PATTERNS.some(pattern => pattern.test(path));
}

/**
 * Recursively searches for forbidden words in an object.
 * Skips "100%" checks in visual/CSS fields where it's a legitimate value.
 */
function findForbiddenWords(obj, forbiddenList) {
  const results = [];

  function traverse(val, path) {
    if (typeof val === 'string') {
      forbiddenList.forEach(word => {
        // Skip "100%" in technical/CSS fields
        if (word === '100%' && isTechnicalField(path)) return;
        if (val.toLowerCase().includes(word.toLowerCase())) {
          results.push({ path, word, value: val });
        }
      });
    } else if (typeof val === 'object' && val !== null) {
      if (Array.isArray(val)) {
        val.forEach((item, idx) => traverse(item, `${path}[${idx}]`));
      } else {
        Object.keys(val).forEach(key => {
          traverse(val[key], path ? `${path}.${key}` : key);
        });
      }
    }
  }

  traverse(obj, '');
  return results;
}

/**
 * Extracts all section IDs from sections array
 */
function getSectionIds(sections) {
  return sections.map(s => s.section_id || '');
}

/**
 * Counts sections by type
 */
function countSectionsByType(sections, typeToFind) {
  return sections.filter(s => s.component_type === typeToFind).length;
}

/**
 * Validates WhatsApp number format
 */
function isValidWhatsAppNumber(number) {
  return /^55[0-9]{10,11}$/.test(number);
}

// ============================================================================
// MAIN VALIDATOR CLASS
// ============================================================================

class ConfigValidator {
  constructor(baseDir, verbose = false) {
    this.baseDir = baseDir;
    this.verbose = verbose;
    this.errors = [];
    this.warnings = [];
    this.schema = null;
    this.ajv = null;
    this.configPath = null;
    this.config = null;
  }

  /**
   * Loads and parses the JSON Schema
   */
  loadSchema(schemaPath) {
    try {
      const schemaContent = fs.readFileSync(schemaPath, 'utf8');
      this.schema = JSON.parse(schemaContent);
      // Initialize AJV with strict: false to ignore unknown formats
      this.ajv = new Ajv({
        allErrors: true,
        strictSchema: false,
        verbose: false
      });
      return true;
    } catch (error) {
      log('fail', `Failed to load schema: ${error.message}`);
      return false;
    }
  }

  /**
   * Loads and parses YAML config
   */
  loadConfig(configPath) {
    try {
      const content = fs.readFileSync(configPath, 'utf8');
      this.config = yaml.load(content);
      this.configPath = configPath;
      logDetail(`Loaded config from: ${configPath}`, this.verbose);
      return true;
    } catch (error) {
      log('fail', `Failed to load config: ${error.message}`);
      return false;
    }
  }

  /**
   * Validates against JSON Schema
   */
  validateSchema() {
    if (!this.schema || !this.config) {
      log('fail', 'Schema or config not loaded');
      return false;
    }

    const validate = this.ajv.compile(this.schema);
    const valid = validate(this.config);

    if (!valid) {
      validate.errors.forEach(error => {
        this.errors.push(`Schema Error at ${error.instancePath || 'root'}: ${error.message}`);
      });
      log('fail', `Schema validation failed: ${validate.errors.length} error(s)`);
      logDetail(`First error: ${validate.errors[0].message}`, this.verbose);
      return false;
    }

    log('pass', 'Schema validation passed');
    return true;
  }

  /**
   * Validates all file references exist
   */
  validateFileReferences() {
    const refs = this.extractAllRefs(this.config);
    let allExist = true;

    if (refs.length === 0) {
      logDetail('No file references found', this.verbose);
      return true;
    }

    refs.forEach(ref => {
      const fullPath = resolvePath(ref.path, this.baseDir);
      if (!fileExists(fullPath)) {
        this.errors.push(`Missing file reference: ${ref.path} (checked at: ${fullPath})`);
        log('fail', `Missing reference: ${ref.path}`);
        allExist = false;
      } else {
        logDetail(`✓ File exists: ${ref.path}`, this.verbose);
      }
    });

    if (allExist) {
      log('pass', `All ${refs.length} file references exist`);
    }

    return allExist;
  }

  /**
   * Extracts all *_ref properties from config
   */
  extractAllRefs(obj, refs = []) {
    if (typeof obj !== 'object' || obj === null) {
      return refs;
    }

    if (Array.isArray(obj)) {
      obj.forEach(item => this.extractAllRefs(item, refs));
    } else {
      Object.keys(obj).forEach(key => {
        if (key.endsWith('_ref') && typeof obj[key] === 'string') {
          refs.push({ path: obj[key], key });
        }
        this.extractAllRefs(obj[key], refs);
      });
    }

    return refs;
  }

  /**
   * Validates for forbidden words in all string values
   */
  validateForbiddenWords() {
    const violations = findForbiddenWords(this.config, FORBIDDEN_WORDS);

    if (violations.length === 0) {
      log('pass', 'No forbidden words detected');
      return true;
    }

    let allViolations = true;
    violations.forEach(v => {
      this.errors.push(`Forbidden word "${v.word}" found at ${v.path}`);
      log('fail', `Forbidden word: "${v.word}" in field: ${v.path}`);
      allViolations = false;
    });

    return !allViolations;
  }

  /**
   * Validates section IDs are unique
   */
  validateSectionIds() {
    const sections = this.config.sections || [];
    const ids = getSectionIds(sections);
    const uniqueIds = new Set(ids);

    if (ids.length === uniqueIds.size) {
      log('pass', `All ${ids.length} section IDs are unique`);
      logDetail(`IDs: ${ids.join(', ')}`, this.verbose);
      return true;
    }

    const duplicates = ids.filter((id, idx) => ids.indexOf(id) !== idx);
    duplicates.forEach(id => {
      this.errors.push(`Duplicate section ID: ${id}`);
      log('fail', `Duplicate section ID: ${id}`);
    });

    return false;
  }

  /**
   * Validates required section types exist
   */
  validateRequiredSections() {
    const sections = this.config.sections || [];
    let allValid = true;

    // Check for hero section (required)
    const heroCount = countSectionsByType(sections, 'hero');
    if (heroCount < 1) {
      this.errors.push('At least one "hero" section is required');
      log('fail', 'Missing required "hero" section');
      allValid = false;
    } else {
      log('pass', 'At least one "hero" section exists');
      logDetail(`Found ${heroCount} hero section(s)`, this.verbose);
    }

    // Check for form or quiz section (required)
    const formCount = countSectionsByType(sections, 'form');
    const quizCount = countSectionsByType(sections, 'quiz');
    if (formCount < 1 && quizCount < 1) {
      this.errors.push('At least one "form" or "quiz" section is required');
      log('fail', 'Missing required "form" or "quiz" section');
      allValid = false;
    } else {
      log('pass', `Found form/quiz sections (form: ${formCount}, quiz: ${quizCount})`);
    }

    return allValid;
  }

  /**
   * Validates WhatsApp configuration (number managed by Wolfgang Tracking)
   */
  validateWhatsAppConfig() {
    const whatsapp = this.config.conversion?.whatsapp;

    if (!whatsapp) {
      this.errors.push('WhatsApp config is missing in conversion.whatsapp');
      log('fail', 'WhatsApp config is missing in conversion.whatsapp');
      return false;
    }

    // Number should NOT be hardcoded (managed by Wolfgang Tracking)
    if (whatsapp.number) {
      this.warnings.push('WhatsApp number should not be hardcoded — managed by Wolfgang Tracking');
      log('warn', 'WhatsApp number found in config — should be managed by Wolfgang Tracking, not hardcoded');
    }

    if (!whatsapp.message_template) {
      this.errors.push('WhatsApp message_template is missing');
      log('fail', 'WhatsApp message_template is missing in conversion.whatsapp');
      return false;
    }

    log('pass', 'WhatsApp config: número gerenciado pelo Wolfgang (não hardcoded)');
    logDetail('message_template present, redirect via location.assign()', this.verbose);
    return true;
  }

  /**
   * Validates qualification minimum value is >= 1000
   */
  validateQualificationMinValue() {
    const minValue = this.config.conversion?.qualification?.min_value;

    if (minValue === undefined) {
      this.errors.push('Qualification min_value is missing');
      log('fail', 'Qualification min_value is missing');
      return false;
    }

    if (typeof minValue !== 'number' || minValue < 1000) {
      this.errors.push(`Qualification min_value must be >= 1000, got: ${minValue}`);
      log('fail', `Qualification min_value too low: ${minValue} (minimum: 1000)`);
      return false;
    }

    log('pass', `Qualification min_value is valid: R$ ${minValue.toLocaleString('pt-BR')}`);
    logDetail(`Safety threshold check passed`, this.verbose);
    return true;
  }

  /**
   * Validates audience segment exists and matches known audiences
   */
  validateAudienceSegment() {
    const segment = this.config.metadata?.audience_segment;

    if (!segment) {
      this.errors.push('Audience segment is missing in metadata');
      log('fail', 'Missing metadata.audience_segment');
      return false;
    }

    if (!KNOWN_AUDIENCES.includes(segment)) {
      this.errors.push(`Unknown audience segment: ${segment} (known: ${KNOWN_AUDIENCES.join(', ')})`);
      log('fail', `Unknown audience segment: ${segment}`);
      return false;
    }

    log('pass', `Valid audience segment: ${segment}`);
    logDetail(`Audience exists in known list`, this.verbose);
    return true;
  }

  /**
   * Runs all validations
   */
  runAllValidations() {
    logHeader(`Validating: ${path.basename(this.configPath)}`);

    const results = {
      schema: this.validateSchema(),
      refs: this.validateFileReferences(),
      forbidden: this.validateForbiddenWords(),
      sectionIds: this.validateSectionIds(),
      sections: this.validateRequiredSections(),
      whatsapp: this.validateWhatsAppConfig(),
      qualification: this.validateQualificationMinValue(),
      audience: this.validateAudienceSegment()
    };

    return results;
  }

  /**
   * Generates validation summary
   */
  printSummary() {
    const totalChecks = Object.keys(this.constructor.prototype).filter(k => k.startsWith('validate')).length;
    const passed = Object.values(this.errors).filter(e => !e).length;
    const failed = this.errors.length;
    const isValid = failed === 0;

    console.log(`\n${COLORS.CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.RESET}`);

    if (isValid) {
      log('pass', `VALIDATION PASSED: ${path.basename(this.configPath)}`);
    } else {
      log('fail', `VALIDATION FAILED: ${path.basename(this.configPath)} (${failed} error(s))`);
      if (this.errors.length > 0) {
        console.log(`\n${COLORS.RED}Errors:${COLORS.RESET}`);
        this.errors.forEach((err, idx) => {
          console.log(`  ${idx + 1}. ${err}`);
        });
      }
    }

    if (this.warnings.length > 0) {
      console.log(`\n${COLORS.YELLOW}Warnings:${COLORS.RESET}`);
      this.warnings.forEach((warn, idx) => {
        console.log(`  ${idx + 1}. ${warn}`);
      });
    }

    console.log(`${COLORS.CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.RESET}\n`);

    return isValid;
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
  const args = process.argv.slice(2);
  let configPath = null;
  let verbose = args.includes('--verbose');
  let allValid = true;

  // Base directory is the parent of the validation folder
  const landingPageFactoryDir = path.resolve(__dirname, '..');
  const schemaPath = path.join(landingPageFactoryDir, 'schemas', 'page-config.schema.json');

  // Check if schema exists
  if (!fileExists(schemaPath)) {
    console.error(`${COLORS.RED}❌ Schema file not found: ${schemaPath}${COLORS.RESET}`);
    process.exit(1);
  }

  // Determine which configs to validate
  let configsToValidate = [];
  const configsDir = path.join(landingPageFactoryDir, 'configs');

  if (args.length > 0 && !args[0].startsWith('--')) {
    // Specific file provided
    configPath = path.resolve(args[0]);
    if (!fileExists(configPath)) {
      console.error(`${COLORS.RED}❌ Config file not found: ${configPath}${COLORS.RESET}`);
      process.exit(1);
    }
    configsToValidate = [configPath];
  } else {
    // Validate all configs in configs/ directory
    if (!fs.existsSync(configsDir)) {
      console.error(`${COLORS.RED}❌ Configs directory not found: ${configsDir}${COLORS.RESET}`);
      process.exit(1);
    }

    const files = fs.readdirSync(configsDir).filter(f => {
      return f.endsWith('.yaml') && !f.startsWith('_');
    });

    if (files.length === 0) {
      console.log(`${COLORS.YELLOW}⚠️  No YAML config files found in ${configsDir}${COLORS.RESET}`);
      process.exit(0);
    }

    configsToValidate = files.map(f => path.join(configsDir, f));
  }

  logHeader('Landing Page Configuration Validator');
  console.log(`Base directory: ${landingPageFactoryDir}`);
  console.log(`Mode: ${configsToValidate.length === 1 ? 'Single file' : `Batch (${configsToValidate.length} files)`}`);
  console.log(`Verbose: ${verbose ? 'Yes' : 'No'}\n`);

  // Validate each config
  configsToValidate.forEach((config, idx) => {
    if (idx > 0) console.log(''); // Spacing between multiple validations

    const validator = new ConfigValidator(landingPageFactoryDir, verbose);

    if (!validator.loadSchema(schemaPath)) {
      process.exit(1);
    }

    if (!validator.loadConfig(config)) {
      allValid = false;
      return;
    }

    validator.runAllValidations();
    const isValid = validator.printSummary();

    if (!isValid) {
      allValid = false;
    }
  });

  // Exit with appropriate code
  if (allValid) {
    console.log(`${COLORS.GREEN}✅ All validations passed!${COLORS.RESET}\n`);
    process.exit(0);
  } else {
    console.log(`${COLORS.RED}❌ Some validations failed!${COLORS.RESET}\n`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = ConfigValidator;
