import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TextureLayerDirective } from '../../../shared/texture-layer/texture-layer.directive';

type DocItem = {
  title: string;
  path: string;
  status: 'planned' | 'in-progress' | 'done';
  summary: string;
};

type Category = 'core' | 'labs' | 'adrs';

type CatalogDoc = DocItem & { category: Category };

type HSSelectInstance = {
  on: (event: string, cb: (value: string | string[]) => void) => void;
  setValue: (value: string) => void;
  destroy: () => void;
};

type HSSelectClass = {
  new (el: HTMLElement, options?: Record<string, unknown>): HSSelectInstance;
  autoInit: () => void;
  getInstance: (target: HTMLElement, isInstance?: boolean) => unknown;
};

@Component({
  selector: 'app-docs-page',
  imports: [TextureLayerDirective, HttpClientModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './docs-page.html',
  styleUrl: './docs-page.css',
  host: {
    '[class.modal-open]': 'modalOpen()'
  }
})
export class DocsPage implements AfterViewInit, OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly zone = inject(NgZone);

  protected readonly fallbackTitle = $localize`:@@docsModalSelect:Select a document`;
  protected readonly fallbackHint = $localize`:@@docsModalChoose:Choose a doc to load its content here.`;
  protected readonly selectedDoc = signal<DocItem | null>(null);
  protected readonly previewText = signal<string>($localize`:@@docsPreviewPlaceholder:Select a document to preview its contents here.`);
  protected readonly previewError = signal<string | null>(null);
  protected readonly previewLoading = signal(false);
  protected readonly modalOpen = signal(false);
  protected readonly selectedCategory = signal<Category | 'all'>('all');
  private readonly viewReady = signal(false);

  @ViewChild('categorySelect') protected categorySelect?: ElementRef<HTMLSelectElement>;
  @ViewChild('docSelect') protected docSelect?: ElementRef<HTMLSelectElement>;
  private hsSelectClass?: HSSelectClass;

  constructor() {
    effect(() => {
      const isOpen = this.modalOpen();
      if (isOpen && this.viewReady() && this.isBrowser()) {
        this.scheduleSelectInit();
        this.scheduleSelectSync();
      }
    });
  }

  protected readonly coreDocs: DocItem[] = [
    {
      title: 'Architecture',
      path: 'docs/architecture.md',
      status: 'done',
      summary: 'System boundaries, feature folders, data layer shape.'
    },
    {
      title: 'SSR & Hydration',
      path: 'docs/ssr-hydration.md',
      status: 'done',
      summary: 'Render modes, hydration notes, and pitfalls.'
    },
    {
      title: 'Zoneless',
      path: 'docs/zoneless.md',
      status: 'done',
      summary: 'provideZonelessChangeDetection and migration notes.'
    },
    {
      title: 'Performance',
      path: 'docs/performance.md',
      status: 'done',
      summary: 'Budgets, defer views, images, and profiling.'
    }
  ];

  protected readonly labDocs: DocItem[] = [
    { title: 'Signals lab', path: 'docs/labs/signals.md', status: 'done', summary: 'Signals basics, computed, effect.' },
    { title: 'httpResource lab', path: 'docs/labs/httpresource.md', status: 'done', summary: 'Reactive data fetching with httpResource.' },
    { title: 'RxJS interop lab', path: 'docs/labs/rxjs-interop.md', status: 'done', summary: 'toSignal, toObservable, cancellation patterns.' },
    { title: 'Routing lab', path: 'docs/labs/routing.md', status: 'done', summary: 'Lazy routes, data, guards.' },
    { title: 'DI lab', path: 'docs/labs/di.md', status: 'done', summary: 'inject(), tokens, provider scopes.' },
    { title: 'Forms lab', path: 'docs/labs/forms.md', status: 'done', summary: 'Signal Forms models, validation, field state.' },
    { title: 'Animations lab', path: 'docs/labs/animations.md', status: 'done', summary: 'Enter/leave motion and route transitions.' },
    { title: 'PWA lab', path: 'docs/labs/pwa.md', status: 'done', summary: 'App shell caching, update prompt, no API cache.' },
    { title: 'A11y & Aria lab', path: 'docs/labs/a11y-aria.md', status: 'done', summary: 'Angular Aria patterns, focus, and announcements.' },
    { title: 'Testing lab', path: 'docs/labs/testing.md', status: 'done', summary: 'SSR-safe specs, HTTP mocks, router harness.' },
    { title: 'Performance lab', path: 'docs/labs/performance.md', status: 'done', summary: 'Budgets, defer/lazy, asset and network guardrails.' },
    { title: 'Custom build lab', path: 'docs/labs/custom-build.md', status: 'done', summary: 'Custom pipeline goals, cache strategy, SSR checks.' },
    { title: 'CDK lab', path: 'docs/labs/cdk.md', status: 'done', summary: 'CDK overlay, focus helpers, and portals.' },
    { title: 'Style Guide lab', path: 'docs/labs/style-guide.md', status: 'done', summary: 'Naming, structure, and API rules.' },
    { title: 'Tailwind lab', path: 'docs/labs/tailwind.md', status: 'done', summary: 'Utility-first setup and class composition.' }
  ];

  protected readonly adrDocs: DocItem[] = [
    { title: 'ADR-001 Render modes', path: 'docs/adr/ADR-001-render-modes.md', status: 'done', summary: 'Route-level render mode decisions.' },
    { title: 'ADR-002 Concurrency limit', path: 'docs/adr/ADR-002-concurrency-limit.md', status: 'done', summary: 'Concurrent detail requests cap.' },
    { title: 'ADR-003 Filter combination', path: 'docs/adr/ADR-003-filter-combination.md', status: 'done', summary: 'Type OR vs other filters.' },
    { title: 'ADR-004 Cache TTL', path: 'docs/adr/ADR-004-cache-ttl.md', status: 'done', summary: 'TTL guidance for catalog vs detail.' }
  ];

  private readonly catalog = computed<CatalogDoc[]>(() => [
    ...this.coreDocs.map((doc) => ({ ...doc, category: 'core' as const })),
    ...this.labDocs.map((doc) => ({ ...doc, category: 'labs' as const })),
    ...this.adrDocs.map((doc) => ({ ...doc, category: 'adrs' as const }))
  ]);

  protected readonly filteredDocs = computed(() => {
    const category = this.selectedCategory();
    const docs = this.catalog();
    return category === 'all' ? docs : docs.filter((doc) => doc.category === category);
  });

  protected isSelected(doc: DocItem): boolean {
    return this.selectedDoc()?.path === doc.path;
  }

  protected onCategoryChange(category: Category | 'all'): void {
    this.selectedCategory.set(category);
    this.scheduleSelectSync();
  }

  protected onCategorySelect(event: Event): void {
    const value = (event.target as HTMLSelectElement | null)?.value as Category | 'all' | undefined;
    this.onCategoryChange(value ?? 'all');
  }

  protected onCardClick(event: Event, doc: DocItem): void {
    event.preventDefault();
    this.modalOpen.set(true);
    this.loadPreview(doc);
    this.scheduleSelectSync();
  }

  protected openRaw(event: Event): void {
    event.stopPropagation();
  }

  protected closeModal(): void {
    this.modalOpen.set(false);
    this.selectedDoc.set(null);
    this.previewError.set(null);
    this.previewLoading.set(false);
    this.previewText.set('Select a document to preview its contents here.');
  }

  protected onDocSelect(event: Event): void {
    const path = (event.target as HTMLSelectElement | null)?.value;
    if (path) {
      this.selectDoc(path);
    }
  }

  protected selectDoc(path: string): void {
    const doc = this.catalog().find((item) => item.path === path);
    if (doc) {
      this.loadPreview(doc);
      this.modalOpen.set(true);
    }
  }

  protected goNext(): void {
    const docs = this.filteredDocs();
    if (!docs.length || !this.selectedDoc()) return;
    const currentIndex = docs.findIndex((doc) => doc.path === this.selectedDoc()!.path);
    const nextIndex = (currentIndex + 1) % docs.length;
    this.loadPreview(docs[nextIndex]);
  }

  protected goPrev(): void {
    const docs = this.filteredDocs();
    if (!docs.length || !this.selectedDoc()) return;
    const currentIndex = docs.findIndex((doc) => doc.path === this.selectedDoc()!.path);
    const prevIndex = (currentIndex - 1 + docs.length) % docs.length;
    this.loadPreview(docs[prevIndex]);
  }

  private loadPreview(doc: DocItem): void {
    if (this.selectedDoc()?.path === doc.path && this.previewText()) {
      return;
    }
    this.selectedDoc.set(doc);
    this.previewError.set(null);
    this.previewLoading.set(true);
    this.previewText.set('');

    this.http.get(doc.path, { responseType: 'text' }).subscribe({
      next: (text) => this.previewText.set(text),
      error: () => {
        this.previewError.set('Could not load the document. Check that the file exists in /public/docs.');
        this.previewText.set('');
      },
      complete: () => this.previewLoading.set(false)
    });
  }

  ngAfterViewInit(): void {
    this.viewReady.set(true);
    if (this.isBrowser()) {
      this.scheduleSelectInit();
    }
  }

  ngOnDestroy(): void {
    this.destroySelects();
  }

  // HS select support (mirrors pokedex list setup)
  private readonly categorySelectConfig = {
    placeholder: 'All',
    toggleTag: '<button type="button"></button>',
    wrapperClasses: 'relative w-full',
    toggleClasses: 'ui-select-toggle',
    dropdownClasses: 'ui-select-dropdown',
    optionClasses: 'ui-select-option',
    optionAllowEmptyOption: true,
    dropdownScope: 'parent'
  };

  private readonly docSelectConfig = {
    placeholder: 'Document',
    toggleTag: '<button type="button"></button>',
    wrapperClasses: 'relative w-full',
    toggleClasses: 'ui-select-toggle',
    dropdownClasses: 'ui-select-dropdown',
    optionClasses: 'ui-select-option',
    optionAllowEmptyOption: false,
    hasSearch: true,
    searchPlaceholder: 'Search document',
    searchWrapperClasses: 'ui-select-search-wrapper',
    searchClasses: 'ui-select-search',
    dropdownScope: 'parent'
  };

  private scheduleSelectInit(): void {
    queueMicrotask(() => void this.initSelects());
  }

  private async initSelects(): Promise<void> {
    if (!this.viewReady() || !this.modalOpen()) return;
    const hsSelect = await this.loadHsSelect();
    if (!hsSelect) return;
    if (!this.getSelectElements().length) {
      queueMicrotask(() => void this.initSelects());
      return;
    }
    this.ensureSelectCollection();
    this.destroySelects();
    this.createSelectInstances(hsSelect);
    this.registerSelectHandlers();
    this.syncSelectValues();
  }

  private scheduleSelectSync(): void {
    queueMicrotask(() => this.syncSelectValues());
  }

  private syncSelectValues(): void {
    this.setSelectValue(this.categorySelect, this.selectedCategory());
    const docPath = this.selectedDoc()?.path ?? this.filteredDocs()[0]?.path ?? '';
    this.setSelectValue(this.docSelect, docPath);
  }

  private destroySelects(): void {
    if (!this.hasSelectCollection() || !this.hsSelectClass) return;
    this.getSelectElements().forEach((select) => {
      const instance = this.hsSelectClass!.getInstance(select, true);
      if (instance && typeof instance === 'object' && 'element' in instance) {
        (instance as { element: { destroy: () => void } }).element.destroy();
      } else if (instance && typeof instance === 'object') {
        (instance as { destroy: () => void }).destroy();
      }
    });
  }

  private createSelectInstances(hsSelect: HSSelectClass): void {
    if (this.categorySelect?.nativeElement) {
      new hsSelect(this.categorySelect.nativeElement, this.categorySelectConfig);
      this.markSelectReady(this.categorySelect.nativeElement);
    }
    if (this.docSelect?.nativeElement) {
      new hsSelect(this.docSelect.nativeElement, this.docSelectConfig);
      this.markSelectReady(this.docSelect.nativeElement);
    }
  }

  private registerSelectHandlers(): void {
    this.registerSelectHandler(this.categorySelect, (value) => {
      const cat = (value as Category | 'all') ?? 'all';
      this.zone.run(() => this.onCategoryChange(cat));
    });
    this.registerSelectHandler(this.docSelect, (value) => this.zone.run(() => this.selectDoc(value)));
  }

  private registerSelectHandler(
    ref: ElementRef<HTMLSelectElement> | undefined,
    handler: (value: string) => void
  ): void {
    const instance = this.getSelectInstance(ref);
    if (!instance) return;
    instance.on('change', (value: string | string[]) => {
      const nextValue = Array.isArray(value) ? value[0] ?? '' : String(value ?? '');
      this.zone.run(() => handler(nextValue));
    });
  }

  private getSelectElements(): HTMLSelectElement[] {
    return [this.categorySelect?.nativeElement, this.docSelect?.nativeElement].filter(
      (el): el is HTMLSelectElement => Boolean(el)
    );
  }

  private getSelectInstance(ref: ElementRef<HTMLSelectElement> | undefined): HSSelectInstance | null {
    const element = ref?.nativeElement;
    if (!element || !this.hasSelectCollection() || !this.hsSelectClass) return null;
    const instance = this.hsSelectClass.getInstance(element, true);
    if (!instance) return null;
    if (typeof instance === 'object' && 'element' in instance) {
      return (instance as { element: HSSelectInstance }).element;
    }
    return instance as HSSelectInstance;
  }

  private setSelectValue(ref: ElementRef<HTMLSelectElement> | undefined, value: string): void {
    const element = ref?.nativeElement;
    if (!element || element.value === value) return;
    const instance = this.getSelectInstance(ref);
    if (instance) {
      instance.setValue(value);
    } else {
      element.value = value;
    }
  }

  private markSelectReady(element: HTMLSelectElement): void {
    element.classList.add('is-hs-ready');
  }

  private async loadHsSelect(): Promise<HSSelectClass | null> {
    if (!this.isBrowser()) return null;
    if (this.hsSelectClass) return this.hsSelectClass;
    const module = await import('preline/dist/select');
    this.hsSelectClass = module.default as HSSelectClass;
    return this.hsSelectClass;
  }

  private ensureSelectCollection(): void {
    if (!this.isBrowser()) return;
    const windowRef = window as Window & { $hsSelectCollection?: unknown[] };
    if (!Array.isArray(windowRef.$hsSelectCollection)) {
      windowRef.$hsSelectCollection = [];
    }
  }

  private hasSelectCollection(): boolean {
    if (!this.isBrowser()) return false;
    const windowRef = window as Window & { $hsSelectCollection?: unknown[] };
    return Array.isArray(windowRef.$hsSelectCollection);
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
