/**
 * Read-only code samples used by the Style Guide demo tabs.
 */
export const STYLE_GUIDE_DEMO_CODE = {
  html: `<section class="demo">
  <header class="demo-header">
    <div>
      <p class="eyebrow">Style Guide</p>
      <h3>Naming validator</h3>
      <p class="subtitle">Check selectors, class names, and file bases.</p>
    </div>
  </header>

  <div class="grid">
    <label class="field">
      <span class="field__label">Project prefix</span>
      <input
        type="text"
        [value]="prefixInput()"
        (input)="updatePrefix(prefixField.value)"
        #prefixField
      />
      <span class="field__meta" [class.is-valid]="prefixResult().isValid">
        @if (prefixResult().isValid) {
          Prefix is unique and kebab-case.
        } @else {
          Suggestion: {{ prefixResult().suggestion }}
        }
      </span>
    </label>

    <label class="field">
      <span class="field__label">Selector</span>
      <input
        type="text"
        [value]="selectorInput()"
        (input)="updateSelector(selectorField.value)"
        #selectorField
      />
      <span class="field__meta" [class.is-valid]="selectorResult().isValid">
        @if (selectorResult().isValid) {
          Valid selector.
        } @else {
          Suggestion: {{ selectorResult().suggestion }}
        }
      </span>
    </label>

    <label class="field">
      <span class="field__label">Class name</span>
      <input
        type="text"
        [value]="classInput()"
        (input)="updateClassName(classField.value)"
        #classField
      />
      <span class="field__meta" [class.is-valid]="classResult().isValid">
        @if (classResult().isValid) {
          Valid class name.
        } @else {
          Suggestion: {{ classResult().suggestion }}
        }
      </span>
    </label>

    <label class="field">
      <span class="field__label">File base</span>
      <input
        type="text"
        [value]="fileInput()"
        (input)="updateFileBase(fileField.value)"
        #fileField
      />
      <span class="field__meta" [class.is-valid]="fileResult().isValid">
        @if (fileResult().isValid) {
          Valid file base.
        } @else {
          Suggestion: {{ fileResult().suggestion }}
        }
      </span>
    </label>
  </div>

  <div class="summary" [class.summary--error]="hasErrors()">
    @if (hasErrors()) {
      Fix naming to match the project conventions.
    } @else {
      All naming rules pass for this feature.
    }
  </div>
</section>
`,
  ts: `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type NamingResult = {
  value: string;
  isValid: boolean;
  suggestion: string;
};

@Component({
  selector: 'app-style-guide-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './style-guide-demo.html',
  styleUrl: './style-guide-demo.css'
})
export class StyleGuideDemoComponent {
  readonly prefixInput = signal('app');
  readonly selectorInput = signal('app-trainer-profile');
  readonly classInput = signal('TrainerProfileComponent');
  readonly fileInput = signal('trainer-profile');

  readonly prefixResult = computed(() => this.validatePrefix(this.prefixInput()));
  readonly selectorResult = computed(() =>
    this.validateSelector(this.selectorInput(), this.prefixInput())
  );
  readonly classResult = computed(() => this.validateClassName(this.classInput()));
  readonly fileResult = computed(() => this.validateFileBase(this.fileInput()));

  readonly hasErrors = computed(
    () =>
      !this.prefixResult().isValid ||
      !this.selectorResult().isValid ||
      !this.classResult().isValid ||
      !this.fileResult().isValid
  );

  updatePrefix(value: string): void {
    this.prefixInput.set(value);
  }

  updateSelector(value: string): void {
    this.selectorInput.set(value);
  }

  updateClassName(value: string): void {
    this.classInput.set(value);
  }

  updateFileBase(value: string): void {
    this.fileInput.set(value);
  }

  private validatePrefix(value: string): NamingResult {
    const trimmed = value.trim();
    const normalized = toKebabCase(trimmed);
    const suggestion = normalized || 'app';
    const isValid = normalized.length > 0 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized);
    return { value: trimmed, isValid, suggestion };
  }

  private validateSelector(value: string, prefix: string): NamingResult {
    const trimmed = value.trim();
    const normalizedPrefix = toKebabCase(prefix.trim());
    const prefixSegment = normalizedPrefix ? \`\${normalizedPrefix}-\` : '';
    const withoutPrefix = trimmed.replace(new RegExp(\`^\${escapeRegExp(prefixSegment)}\`), '');
    const baseName = toKebabCase(withoutPrefix) || 'feature';
    const suggestion = \`\${prefixSegment}\${baseName}\`;
    const isValid =
      Boolean(normalizedPrefix) &&
      /^([a-z0-9]+(?:-[a-z0-9]+)*)$/.test(baseName) &&
      new RegExp(\`^\${escapeRegExp(prefixSegment)}[a-z0-9]+(?:-[a-z0-9]+)*$\`).test(trimmed);
    return { value: trimmed, isValid, suggestion };
  }

  private validateClassName(value: string): NamingResult {
    const trimmed = value.trim();
    const base = trimmed.replace(/Component$/, '');
    const suggestion = \`\${toPascalCase(base)}Component\`;
    const isValid = /^[A-Z][A-Za-z0-9]*Component$/.test(trimmed);
    return { value: trimmed, isValid, suggestion };
  }

  private validateFileBase(value: string): NamingResult {
    const trimmed = value.trim();
    const suggestion = toKebabCase(trimmed);
    const isValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed);
    return { value: trimmed, isValid, suggestion };
  }
}

const toKebabCase = (value: string): string => {
  const withSpaces = value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim();
  if (!withSpaces) return '';
  return withSpaces
    .split(/\\s+/g)
    .map((part) => part.toLowerCase())
    .join('-');
};

const toPascalCase = (value: string): string => {
  const withSpaces = value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim();
  if (!withSpaces) return '';
  return withSpaces
    .split(/\\s+/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
};

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^\\\${}()|[\\]\\\\]/g, '\\\\$&');
`,
  css: `.demo {
  display: grid;
  gap: 1rem;
}

.demo-header h3 {
  margin: 0.3rem 0 0;
  font-size: 1rem;
  font-weight: 700;
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.65rem;
  color: var(--ink-600);
}

.subtitle {
  margin: 0.35rem 0 0;
  font-size: 0.85rem;
  color: var(--ink-600);
}

.grid {
  display: grid;
  gap: 0.75rem;
}

.field {
  display: grid;
  gap: 0.35rem;
}

.field__label {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.field input {
  border: 2px solid var(--ink-900);
  padding: 0.45rem 0.6rem;
  font-size: 0.85rem;
}

.field__meta {
  font-size: 0.75rem;
  color: #b42318;
}

.field__meta.is-valid {
  color: #027a48;
}

.summary {
  border: 2px solid var(--ink-900);
  background: var(--paper-2);
  padding: 0.6rem 0.75rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.summary--error {
  border-color: #b42318;
  color: #b42318;
}
`
};
