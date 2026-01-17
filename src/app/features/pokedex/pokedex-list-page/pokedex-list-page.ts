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
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, from, map, mergeMap, of, startWith, switchMap, toArray } from 'rxjs';
import { ActivatedRoute, Router, RouterLink, convertToParamMap } from '@angular/router';

import { POKEDEX_DETAIL_CONCURRENCY } from '../../../core/config/pokedex-config';
import { PokeApiClient } from '../../../data/poke-api/poke-api.client';
import { Pokemon, TypeListItem } from '../../../data/poke-api/poke-api.models';
import { TextureLayerDirective } from '../../../shared/texture-layer/texture-layer.directive';

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

type ListStatus = 'loading' | 'success' | 'empty' | 'error';

interface ListState {
  status: ListStatus;
  items: Pokemon[];
  total: number;
  error: string | null;
}

type TypesStatus = 'loading' | 'success' | 'error';

interface TypesState {
  status: TypesStatus;
  items: TypeListItem[];
  error: string | null;
}

@Component({
  selector: 'app-pokedex-list-page',
  imports: [RouterLink, TextureLayerDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pokedex-list-page.html',
  styleUrl: './pokedex-list-page.css'
})
export class PokedexListPage implements AfterViewInit, OnDestroy {
  /** Reference to the type filter select element. */
  @ViewChild('typeSelect') readonly typeSelect?: ElementRef<HTMLSelectElement>;
  /** Reference to the sort select element. */
  @ViewChild('sortSelect') readonly sortSelect?: ElementRef<HTMLSelectElement>;
  /** Reference to the direction select element. */
  @ViewChild('dirSelect') readonly dirSelect?: ElementRef<HTMLSelectElement>;

  private readonly client = inject(PokeApiClient);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly detailConcurrency = inject(POKEDEX_DETAIL_CONCURRENCY);

  protected readonly reloadTick = signal(0);
  private readonly viewReady = signal(false);
  private hsSelectClass?: HSSelectClass;

  private readonly queryParamMap = toSignal(this.route.queryParamMap, {
    initialValue: convertToParamMap({})
  });

  protected readonly query = computed(() =>
    normalizeStringParam(this.queryParamMap().get('q'), '')
  );

  protected readonly typeFilter = computed(() =>
    normalizeStringParam(this.queryParamMap().get('type'), '')
  );

  protected readonly sortOptions = [
    { value: 'id', label: 'ID' },
    { value: 'name', label: 'Nombre' }
  ];

  protected readonly dirOptions = [
    { value: 'asc', label: 'Asc' },
    { value: 'desc', label: 'Desc' }
  ];

  /** Preline config for the type select. */
  protected readonly typeSelectConfig = {
    placeholder: 'Todos los tipos',
    toggleTag: '<button type="button"></button>',
    wrapperClasses: 'relative w-full',
    toggleClasses: 'ui-select-toggle',
    dropdownClasses: 'ui-select-dropdown',
    optionClasses: 'ui-select-option',
    optionAllowEmptyOption: true,
    hasSearch: true,
    searchPlaceholder: 'Buscar tipo',
    searchWrapperClasses: 'ui-select-search-wrapper',
    searchClasses: 'ui-select-search',
    dropdownScope: 'parent'
  };

  /** Preline config for the sort select. */
  protected readonly sortSelectConfig = {
    placeholder: 'Orden',
    toggleTag: '<button type="button"></button>',
    wrapperClasses: 'relative w-full',
    toggleClasses: 'ui-select-toggle',
    dropdownClasses: 'ui-select-dropdown',
    optionClasses: 'ui-select-option',
    dropdownScope: 'parent'
  };

  /** Preline config for the direction select. */
  protected readonly dirSelectConfig = {
    placeholder: 'Direccion',
    toggleTag: '<button type="button"></button>',
    wrapperClasses: 'relative w-full',
    toggleClasses: 'ui-select-toggle',
    dropdownClasses: 'ui-select-dropdown',
    optionClasses: 'ui-select-option',
    dropdownScope: 'parent'
  };

  private readonly initialTypesState: TypesState = {
    status: 'loading',
    items: [],
    error: null
  };

  protected readonly typesState = toSignal(
    this.client.getTypes().pipe(
      map((items): TypesState => ({ status: 'success', items, error: null })),
      startWith(this.initialTypesState),
      catchError(() =>
        of<TypesState>({
          status: 'error',
          items: [],
          error: 'No se pudieron cargar los tipos.'
        })
      )
    ),
    { initialValue: this.initialTypesState }
  );

  constructor() {
    effect(() => {
      if (!this.queryParamMap().has('pageSize')) {
        this.updateQueryParams({ pageSize: this.pageSize() });
      }
    });

    effect(() => {
      this.typesState();
      if (this.viewReady() && this.isBrowser()) {
        this.scheduleSelectInit();
      }
    });

    effect(() => {
      this.typeFilter();
      this.sortBy();
      this.sortDir();
      if (this.viewReady() && this.isBrowser()) {
        this.scheduleSelectSync();
      }
    });
  }

  protected readonly sortBy = computed(() =>
    normalizeEnumParam(this.queryParamMap().get('sort'), ['id', 'name'], 'id')
  );

  protected readonly sortDir = computed(() =>
    normalizeEnumParam(this.queryParamMap().get('dir'), ['asc', 'desc'], 'asc')
  );

  protected readonly page = computed(() =>
    normalizeNumberParam(this.queryParamMap().get('page'), 1, 1, 999)
  );

  protected readonly pageSize = computed(() =>
    normalizeNumberParam(this.queryParamMap().get('pageSize'), 8, 1, 96)
  );

  private readonly params$ = toObservable(
    computed(() => ({
      page: this.page(),
      pageSize: this.pageSize(),
      reload: this.reloadTick(),
      query: this.query(),
      sortBy: this.sortBy(),
      sortDir: this.sortDir(),
      type: this.typeFilter()
    }))
  );

  private readonly initialState: ListState = {
    status: 'loading',
    items: [],
    total: 0,
    error: null
  };

  protected readonly listState = toSignal(
    this.params$.pipe(
      switchMap((params) => {
        const { page, pageSize, query, sortBy, sortDir, type } = params;
        const base$ = type
          ? this.client.getPokemonByType(type)
          : this.client.getPokemonList(pageSize, (page - 1) * pageSize);

        return base$.pipe(
          map((response) => {
            const items = response.items.map((item) => ({
              ...item,
              id: extractIdFromUrl(item.url)
            }));

            const filtered = query
              ? items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
              : items;

            const sorted = [...filtered].sort((a, b) => {
              if (sortBy === 'name') {
                return sortDir === 'asc'
                  ? a.name.localeCompare(b.name)
                  : b.name.localeCompare(a.name);
              }

              const aId = a.id ?? 0;
              const bId = b.id ?? 0;
              return sortDir === 'asc' ? aId - bId : bId - aId;
            });

            if (type) {
              const start = (page - 1) * pageSize;
              const paged = sorted.slice(start, start + pageSize);
              return { list: paged, total: sorted.length };
            }

            return { list: sorted, total: response.total };
          }),
          switchMap(({ list, total }) => {
            if (list.length === 0) {
              return of<ListState>({
                status: 'empty',
                items: [],
                total,
                error: null
              });
            }

            return from(list).pipe(
              mergeMap((item, index) =>
                this.client.getPokemon(item.name).pipe(map((pokemon) => ({ index, pokemon }))),
                this.detailConcurrency
              ),
              toArray(),
              map((results) => results.sort((a, b) => a.index - b.index)),
              map((results) => results.map((result) => result.pokemon)),
              map(
                (items): ListState => ({
                  status: 'success',
                  items,
                  total,
                  error: null
                })
              ),
              startWith<ListState>({
                status: 'loading',
                items: [],
                total,
                error: null
              })
            );
          }),
          startWith(this.initialState),
          catchError(() =>
            of<ListState>({
              status: 'error',
              items: [],
              total: 0,
              error: 'No se pudo cargar el listado.'
            })
          )
        );
      })
    ),
    { initialValue: this.initialState }
  );

  protected readonly totalPages = computed(() => {
    const total = this.listState().total;
    return Math.max(1, Math.ceil(total / this.pageSize()));
  });

  protected readonly canPrev = computed(() => this.page() > 1);
  protected readonly canNext = computed(() => this.page() < this.totalPages());

  /**
   * Initializes Preline select widgets once the view is ready.
   */
  ngAfterViewInit() {
    this.viewReady.set(true);
    if (this.isBrowser()) {
      this.scheduleSelectInit();
    }
  }

  /**
   * Cleans up any Preline select instances on destroy.
   */
  ngOnDestroy() {
    this.destroySelects();
  }

  /**
   * Moves to the previous page and updates the URL.
   */
  protected goToPreviousPage() {
    if (this.canPrev()) {
      this.updatePage(this.page() - 1);
    }
  }

  /**
   * Moves to the next page and updates the URL.
   */
  protected goToNextPage() {
    if (this.canNext()) {
      this.updatePage(this.page() + 1);
    }
  }

  /**
   * Forces a reload of the current list state.
   */
  protected retryLoad() {
    this.reloadTick.update((value) => value + 1);
  }

  /**
   * Updates the search query and resets pagination.
   *
   * @param value - New search query.
   */
  protected updateQuery(value: string) {
    this.updateQueryParams({ q: value || null, page: 1 });
  }

  /**
   * Updates the type filter and resets pagination.
   *
   * @param value - New type filter.
   */
  protected updateType(value: string) {
    this.updateQueryParams({ type: value || null, page: 1 });
  }

  /**
   * Updates the sort field and resets pagination.
   *
   * @param value - Sort field.
   */
  protected updateSort(value: string) {
    this.updateQueryParams({ sort: value, page: 1 });
  }

  /**
   * Updates the sort direction and resets pagination.
   *
   * @param value - Sort direction.
   */
  protected updateDir(value: string) {
    this.updateQueryParams({ dir: value, page: 1 });
  }

  /**
   * Schedules a refresh of the Preline select instances.
   */
  private scheduleSelectInit() {
    queueMicrotask(() => void this.initSelects());
  }

  /**
   * Initializes Preline selects after DOM updates.
   */
  private async initSelects() {
    const hsSelect = await this.loadHsSelect();
    if (!hsSelect) {
      return;
    }
    this.ensureSelectCollection();
    this.destroySelects();
    this.createSelectInstances(hsSelect);
    this.registerSelectHandlers();
    this.syncSelectValues();
  }

  /**
   * Schedules a sync of select values to match query params.
   */
  private scheduleSelectSync() {
    queueMicrotask(() => this.syncSelectValues());
  }

  /**
   * Syncs Preline select values with the current query params.
   */
  private syncSelectValues() {
    this.setSelectValue(this.typeSelect, this.typeFilter());
    this.setSelectValue(this.sortSelect, this.sortBy());
    this.setSelectValue(this.dirSelect, this.sortDir());
  }

  /**
   * Destroys any existing Preline select instances for this view.
   */
  private destroySelects() {
    if (!this.hasSelectCollection()) {
      return;
    }
    const hsSelect = this.hsSelectClass;
    if (!hsSelect) {
      return;
    }
    this.getSelectElements().forEach((select) => {
      const instance = hsSelect.getInstance(select, true);
      if (instance && typeof instance === 'object' && 'element' in instance) {
        (instance as { element: { destroy: () => void } }).element.destroy();
      } else if (instance && typeof instance === 'object') {
        (instance as { destroy: () => void }).destroy();
      }
    });
  }

  /**
   * Creates Preline select instances with explicit options.
   *
   * @param hsSelect - Preline select class.
   */
  private createSelectInstances(hsSelect: HSSelectClass) {
    if (this.typeSelect?.nativeElement) {
      new hsSelect(this.typeSelect.nativeElement, this.typeSelectConfig);
    }
    if (this.sortSelect?.nativeElement) {
      new hsSelect(this.sortSelect.nativeElement, this.sortSelectConfig);
    }
    if (this.dirSelect?.nativeElement) {
      new hsSelect(this.dirSelect.nativeElement, this.dirSelectConfig);
    }
  }

  /**
   * Registers Preline select change handlers after initialization.
   */
  private registerSelectHandlers() {
    this.registerSelectHandler(this.typeSelect, (value) => this.updateType(value));
    this.registerSelectHandler(this.sortSelect, (value) => this.updateSort(value));
    this.registerSelectHandler(this.dirSelect, (value) => this.updateDir(value));
  }

  /**
   * Attaches a change handler to a Preline select instance.
   *
   * @param ref - Element reference to bind.
   * @param handler - Value change handler.
   */
  private registerSelectHandler(
    ref: ElementRef<HTMLSelectElement> | undefined,
    handler: (value: string) => void
  ) {
    const instance = this.getSelectInstance(ref);
    if (!instance) {
      return;
    }

    instance.on('change', (value: string | string[]) => {
      const nextValue = Array.isArray(value) ? value[0] ?? '' : String(value ?? '');
      this.zone.run(() => handler(nextValue));
    });
  }

  /**
   * Collects select elements used by the filter bar.
   *
   * @returns List of select elements.
   */
  private getSelectElements() {
    return [this.typeSelect, this.sortSelect, this.dirSelect]
      .map((ref) => ref?.nativeElement)
      .filter((element): element is HTMLSelectElement => Boolean(element));
  }

  /**
   * Resolves the Preline select instance for a given element.
   *
   * @param ref - Element reference to resolve.
   * @returns HSSelect instance or null when missing.
   */
  private getSelectInstance(ref: ElementRef<HTMLSelectElement> | undefined) {
    const element = ref?.nativeElement;
    if (!element) {
      return null;
    }

    if (!this.hasSelectCollection()) {
      return null;
    }

    const hsSelect = this.hsSelectClass;
    if (!hsSelect) {
      return null;
    }

    const instance = hsSelect.getInstance(element, true);
    if (!instance) {
      return null;
    }
    if (typeof instance === 'object' && 'element' in instance) {
      return (instance as { element: HSSelectInstance }).element;
    }
    return instance as HSSelectInstance;
  }

  /**
   * Updates a Preline select instance with the provided value.
   *
   * @param ref - Element reference to update.
   * @param value - Value to select.
   */
  private setSelectValue(ref: ElementRef<HTMLSelectElement> | undefined, value: string) {
    const element = ref?.nativeElement;
    if (!element || element.value === value) {
      return;
    }

    const instance = this.getSelectInstance(ref);
    if (instance) {
      instance.setValue(value);
    } else {
      element.value = value;
    }
  }

  /**
   * Loads the HSSelect class on the browser only.
   *
   * @returns HSSelect class or null on the server.
   */
  private async loadHsSelect() {
    if (!this.isBrowser()) {
      return null;
    }
    if (this.hsSelectClass) {
      return this.hsSelectClass;
    }

    const module = await import('preline/dist/select');
    this.hsSelectClass = module.default as HSSelectClass;
    return this.hsSelectClass;
  }

  /**
   * Returns true when running in the browser.
   *
   * @returns True when in the browser.
   */
  private isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Ensures the global Preline select collection is initialized.
   */
  private ensureSelectCollection() {
    if (!this.isBrowser()) {
      return;
    }
    const windowRef = window as Window & { $hsSelectCollection?: unknown[] };
    if (!Array.isArray(windowRef.$hsSelectCollection)) {
      windowRef.$hsSelectCollection = [];
    }
  }

  /**
   * Checks if the Preline select collection is available.
   *
   * @returns True when the collection exists.
   */
  private hasSelectCollection() {
    if (!this.isBrowser()) {
      return false;
    }
    const windowRef = window as Window & { $hsSelectCollection?: unknown[] };
    return Array.isArray(windowRef.$hsSelectCollection);
  }

  /**
   * Navigates to a specific page via query params.
   *
   * @param page - Target page number.
   */
  private updatePage(page: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge'
    });
  }

  /**
   * Merges query params into the current URL.
   *
   * @param params - Query params to merge.
   */
  private updateQueryParams(params: Record<string, string | number | null>) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge'
    });
  }
}

/**
 * Normalizes a numeric query param to a bounded integer.
 *
 * @param value - Raw query param value.
 * @param fallback - Fallback value when invalid.
 * @param min - Minimum allowed value.
 * @param max - Maximum allowed value.
 * @returns Normalized number.
 */
function normalizeNumberParam(
  value: string | null,
  fallback: number,
  min: number,
  max: number
) {
  if (value === null || value.trim() === '') {
    return fallback;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, Math.floor(parsed)));
}

/**
 * Normalizes a string query param with trimming and fallback.
 *
 * @param value - Raw query param value.
 * @param fallback - Fallback value when empty.
 * @returns Normalized string.
 */
function normalizeStringParam(value: string | null, fallback: string) {
  if (!value) {
    return fallback;
  }
  return value.trim();
}

/**
 * Normalizes an enum-like query param with allowed values.
 *
 * @param value - Raw query param value.
 * @param allowed - Allowed values.
 * @param fallback - Fallback value when invalid.
 * @returns Normalized enum value.
 */
function normalizeEnumParam<T extends string>(
  value: string | null,
  allowed: readonly T[],
  fallback: T
) {
  if (value && allowed.includes(value as T)) {
    return value as T;
  }
  return fallback;
}

/**
 * Extracts the numeric id from a PokeAPI resource URL.
 *
 * @param url - Resource URL.
 * @returns Numeric id or null when missing.
 */
function extractIdFromUrl(url: string) {
  const segments = url.split('/').filter(Boolean);
  const last = segments[segments.length - 1];
  const id = Number(last);
  return Number.isFinite(id) ? id : null;
}
