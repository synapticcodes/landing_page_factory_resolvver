# Landing Page Configuration Validator

A comprehensive validation tool for Resolvver landing page YAML configuration files. Validates against JSON Schema and enforces custom business rules specific to the Resolvver landing page factory.

## Installation

From the validation directory:

```bash
npm install
```

This installs the required dependencies:
- `ajv`: JSON Schema validator
- `js-yaml`: YAML parser

## Usage

### Validate a Single Config File

```bash
node validate-config.js path/to/config.yaml
```

Example:
```bash
node validate-config.js ../configs/001-captura-aposentados.yaml
```

### Validate All Configs

Validates all `*.yaml` files in the `configs/` directory (skips files starting with `_`):

```bash
node validate-config.js
```

### Verbose Output

Add the `--verbose` flag to see detailed information about each validation check:

```bash
node validate-config.js --verbose
node validate-config.js ../configs/001-captura-aposentados.yaml --verbose
```

## What Gets Validated

### 1. JSON Schema Validation
- Validates config structure against `schemas/page-config.schema.json`
- Checks all required fields are present
- Validates data types and patterns

### 2. File Reference Validation
- All `*_ref` properties point to existing files
- Paths are validated relative to the `landing_page_factory/` directory
- Checks:
  - `metadata.audience.profile_ref`
  - `metadata.audience.communication_ref`
  - `strategy.rules_ref`
  - `strategy.scoring_ref` (if quiz)
  - `conversion.form.fields_ref`
  - `tracking.events_ref`
  - Any other `*_ref` properties

### 3. Forbidden Words Detection
Scans all string values for compliance with communication guidelines. Detects:
- `grátis`, `gratuito`, `gratuita`
- `sem custo`
- `0800` (phone prefix)
- `garantia`, `garantido`, `garantimos`
- `promessa`, `prometo`, `prometemos`
- `100%`
- `infalível`
- `milagre`

### 4. Section Validation
- **Unique IDs**: All section IDs must be unique within a page
- **Required Hero**: At least one section of type `hero` must exist
- **Required Form/Quiz**: At least one section of type `form` or `quiz` must exist

### 5. WhatsApp Configuration Validation
- Número de WhatsApp NÃO deve estar hardcoded nos configs (gerenciado pelo Wolfgang Tracking)
- `message_template` é obrigatório
- `redirect_method` deve ser `location.assign` (para Wolfgang interceptar)

### 6. Qualification Minimum Value
- Must be defined in `conversion.qualification.min_value`
- Must be >= 1000 (safety check to prevent unrealistic qualification values)
- Expressed in Brazilian Real (R$)

### 7. Audience Segment Validation
- `metadata.audience_segment` must match a known audience
- Known audiences: `aposentados`, `servidores_publicos`
- Ensures config aligns with prepared communication guidelines

## Exit Codes

- **0**: All validations passed
- **1**: One or more validations failed

## Example Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Landing Page Configuration Validator
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Base directory: /path/to/landing_page_factory
Mode: Single file
Verbose: No

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Validating: 001-captura-aposentados.yaml
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Schema validation passed
✅ All 4 file references exist
✅ No forbidden words detected
✅ All 8 section IDs are unique
✅ At least one "hero" section exists
✅ Found form/quiz sections (form: 1, quiz: 0)
✅ WhatsApp config: número gerenciado pelo Wolfgang (não hardcoded)
✅ Qualification min_value is valid: R$ 1.500,00
✅ Valid audience segment: aposentados

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ VALIDATION PASSED: 001-captura-aposentados.yaml
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ All validations passed!
```

## Error Handling

The validator provides clear error messages:

### Schema Errors
```
❌ Schema Error at .metadata.version: must match pattern "^[0-9]+\\.[0-9]+$"
```

### Missing File References
```
❌ Missing reference: libraries/audiences/unknown.yaml
```

### Forbidden Words
```
❌ Forbidden word "grátis" in field: sections[0].content.headline
```

### Configuration Errors
```
❌ Duplicate section ID: hero
❌ Missing required "hero" section
❌ Invalid WhatsApp format: 11999999999 (expected: 55[0-9]{10,11})
```

## Configuration Requirements Summary

For a valid config file:

1. **Metadata**: Valid page_id pattern, version format, known audience_segment
2. **Audience References**: Files must exist (profile_ref, communication_ref)
3. **Strategy References**: Rules file must exist (and scoring_ref if quiz type)
4. **Sections**:
   - At least 5, at most 12 sections
   - Must have at least one "hero"
   - Must have at least one "form" or "quiz"
   - All section IDs must be unique
5. **Conversion**:
   - Form fields reference must exist
   - Qualification min_value >= 1000
   - WhatsApp number must be valid Brazilian format
6. **Copy Content**: No forbidden words in any string
7. **Tracking**: Valid references to tracking event files

## Troubleshooting

### "Module not found: ajv" or "js-yaml"
Run `npm install` in the validation directory.

### "Schema file not found"
Ensure you're running the script from the correct directory, or provide the full path to the config file.

### "Unknown audience segment"
Update the KNOWN_AUDIENCES constant in validate-config.js if a new audience type is added.

### "Forbidden word detected"
Review the communication guidelines for the audience segment and update the copy to avoid the forbidden word.

## Development

To modify the validation rules, edit `validate-config.js`:

- **FORBIDDEN_WORDS**: Array of prohibited phrases
- **KNOWN_AUDIENCES**: Array of valid audience segments
- **SECTION_TYPE_REQUIREMENTS**: Rules for required section types

The validator uses CommonJS (require) for compatibility with Node.js versions 14+.

## License

MIT
