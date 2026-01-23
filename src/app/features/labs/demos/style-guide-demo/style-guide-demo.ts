import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

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
    const prefixSegment = normalizedPrefix ? `${normalizedPrefix}-` : '';
    const withoutPrefix = trimmed.replace(new RegExp(`^${escapeRegExp(prefixSegment)}`), '');
    const baseName = toKebabCase(withoutPrefix) || 'feature';
    const suggestion = `${prefixSegment}${baseName}`;
    const isValid =
      Boolean(normalizedPrefix) &&
      /^([a-z0-9]+(?:-[a-z0-9]+)*)$/.test(baseName) &&
      new RegExp(`^${escapeRegExp(prefixSegment)}[a-z0-9]+(?:-[a-z0-9]+)*$`).test(trimmed);
    return { value: trimmed, isValid, suggestion };
  }

  private validateClassName(value: string): NamingResult {
    const trimmed = value.trim();
    const base = trimmed.replace(/Component$/, '');
    const suggestion = `${toPascalCase(base)}Component`;
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
    .split(/\s+/g)
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
    .split(/\s+/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
};

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
