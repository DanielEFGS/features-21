import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { BehaviorSubject, NEVER, Observable, of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { PokeApiClient } from '../../../data/poke-api/poke-api.client';
import { POKEDEX_DETAIL_CONCURRENCY } from '../../../core/config/pokedex-config';
import { Pokemon, PokemonList } from '../../../data/poke-api/poke-api.models';
import { PokedexListPage } from './pokedex-list-page';

type ClientStub = {
  getPokemonList: (limit: number, offset: number) => Observable<PokemonList>;
  getPokemonByType: (type: string) => Observable<PokemonList>;
  getPokemon: (name: string) => Observable<Pokemon>;
  getTypes: () => Observable<Array<{ name: string; url: string }>>;
};

class StubSelect {
  static autoInit() {}
  static getInstance() {
    return null;
  }
  on() {}
  setValue() {}
  destroy() {}
  constructor(_element: HTMLElement) {}
}

vi.mock('preline/dist/select', () => ({ default: StubSelect }));

function createRoute(query: Record<string, string>) {
  const subject = new BehaviorSubject(convertToParamMap(query));
  return { subject, route: { queryParamMap: subject.asObservable() } };
}

function createPokemon(name: string, id: number): Pokemon {
  return {
    id,
    name,
    baseExperience: 0,
    height: 0,
    weight: 0,
    isDefault: true,
    order: id,
    spriteUrl: null,
    artworkUrl: null,
    sprites: [],
    types: [],
    abilities: [],
    stats: []
  };
}

async function setupListTest(
  query: Record<string, string>,
  clientOverrides: Partial<ClientStub> = {},
  platformId: 'browser' | 'server' = 'server',
  stubHsSelect = false
) {
  const { subject, route } = createRoute(query);
  const client: ClientStub = {
    getPokemonList: () => of({ items: [], total: 0 }),
    getPokemonByType: () => of({ items: [], total: 0 }),
    getPokemon: (name: string) => of(createPokemon(name, 1)),
    getTypes: () => of([]),
    ...clientOverrides
  };

  await TestBed.configureTestingModule({
    imports: [PokedexListPage],
    providers: [
      provideRouter([]),
      { provide: PLATFORM_ID, useValue: platformId },
      { provide: POKEDEX_DETAIL_CONCURRENCY, useValue: 2 },
      { provide: PokeApiClient, useValue: client },
      { provide: ActivatedRoute, useValue: route }
    ]
  }).compileComponents();

  const fixture = TestBed.createComponent(PokedexListPage);
  fixture.detectChanges();
  if (stubHsSelect) {
    class FakeSelect {
      static autoInit() {}
      static getInstance() {
        return null;
      }
      on() {}
      setValue() {}
      destroy() {}
      constructor(_element: HTMLElement) {}
    }
    (fixture.componentInstance as unknown as { loadHsSelect: () => Promise<unknown> }).loadHsSelect = vi
      .fn()
      .mockResolvedValue(FakeSelect);
  }

  return {
    fixture,
    component: fixture.componentInstance as unknown as Record<string, unknown>,
    client,
    subject,
    router: TestBed.inject(Router)
  };
}

describe('PokedexListPage', () => {
  it('applies the default page size when missing', async () => {
    const { subject, route } = createRoute({});

    await TestBed.configureTestingModule({
      imports: [PokedexListPage],
      providers: [
        provideRouter([]),
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: POKEDEX_DETAIL_CONCURRENCY, useValue: 2 },
        { provide: PokeApiClient, useValue: { getPokemonList: () => of({ items: [], total: 0 }), getPokemonByType: () => of({ items: [], total: 0 }), getPokemon: (name: string) => of(createPokemon(name, 1)), getTypes: () => of([]) } },
        { provide: ActivatedRoute, useValue: route }
      ]
    }).compileComponents();

    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate');
    const fixture = TestBed.createComponent(PokedexListPage);
    fixture.detectChanges();

    expect(navigate).toHaveBeenCalledWith(
      [],
      expect.objectContaining({ queryParams: { pageSize: 8 } })
    );

    subject.complete();
  });
  it('normalizes query params', async () => {
    const { component, subject } = await setupListTest({ page: '0', pageSize: 'bad', sort: 'bad', dir: 'desc', q: '  pika ' });

    expect((component['page'] as () => number)()).toBe(1);
    expect((component['pageSize'] as () => number)()).toBe(8);
    expect((component['sortBy'] as () => string)()).toBe('id');
    expect((component['sortDir'] as () => string)()).toBe('desc');
    expect((component['query'] as () => string)()).toBe('pika');

    subject.complete();
  });

  it('applies defaults for empty query params', async () => {
    const { component, subject } = await setupListTest({
      page: '',
      pageSize: '',
      sort: 'name',
      dir: 'asc',
      q: '',
      type: '  water '
    });

    expect((component['page'] as () => number)()).toBe(1);
    expect((component['pageSize'] as () => number)()).toBe(8);
    expect((component['sortBy'] as () => string)()).toBe('name');
    expect((component['sortDir'] as () => string)()).toBe('asc');
    expect((component['query'] as () => string)()).toBe('');
    expect((component['typeFilter'] as () => string)()).toBe('water');

    subject.complete();
  });

  it('uses the type endpoint when type is selected', async () => {
    const getPokemonList = vi.fn(() => of({ items: [], total: 0 }));
    const getPokemonByType = vi.fn(() => of({ items: [], total: 0 }));

    const { subject } = await setupListTest(
      { page: '1', pageSize: '8', type: 'grass' },
      { getPokemonList, getPokemonByType }
    );

    expect(getPokemonByType).toHaveBeenCalledWith('grass');
    expect(getPokemonList).not.toHaveBeenCalled();

    subject.complete();
  });

  it('sorts pokemon by name', async () => {
    const { component, subject, fixture } = await setupListTest(
      { page: '1', pageSize: '8', sort: 'name', dir: 'asc' },
      {
        getPokemonList: () =>
          of({
            items: [
              { name: 'zubat', url: 'https://pokeapi.co/api/v2/pokemon/41/' },
              { name: 'abra', url: 'https://pokeapi.co/api/v2/pokemon/63/' }
            ],
            total: 2
          }),
        getPokemon: (name: string) => of(createPokemon(name, name === 'abra' ? 63 : 41))
      }
    );

    await fixture.whenStable();
    const names = (component['listState'] as () => { items: Array<{ name: string }> })().items.map(
      (item) => item.name
    );

    expect(names).toEqual(['abra', 'zubat']);

    subject.complete();
  });

  it('sorts pokemon by name in descending order', async () => {
    const { component, subject, fixture } = await setupListTest(
      { page: '1', pageSize: '8', sort: 'name', dir: 'desc' },
      {
        getPokemonList: () =>
          of({
            items: [
              { name: 'zubat', url: 'https://pokeapi.co/api/v2/pokemon/41/' },
              { name: 'abra', url: 'https://pokeapi.co/api/v2/pokemon/63/' }
            ],
            total: 2
          }),
        getPokemon: (name: string) => of(createPokemon(name, name === 'abra' ? 63 : 41))
      }
    );

    await fixture.whenStable();
    const names = (component['listState'] as () => { items: Array<{ name: string }> })().items.map(
      (item) => item.name
    );

    expect(names).toEqual(['zubat', 'abra']);

    subject.complete();
  });

  it('updates query params when filters change', async () => {
    const { component, subject, router } = await setupListTest({ page: '1', pageSize: '8' });
    const navigate = vi.spyOn(router, 'navigate');

    (component['updateQuery'] as (value: string) => void)('pikachu');
    expect(navigate).toHaveBeenCalledWith([], expect.objectContaining({ queryParams: { q: 'pikachu', page: 1 } }));

    (component['updateQuery'] as (value: string) => void)('');
    expect(navigate).toHaveBeenCalledWith([], expect.objectContaining({ queryParams: { q: null, page: 1 } }));

    (component['updateType'] as (value: string) => void)('grass');
    expect(navigate).toHaveBeenCalledWith([], expect.objectContaining({ queryParams: { type: 'grass', page: 1 } }));

    (component['updateType'] as (value: string) => void)('');
    expect(navigate).toHaveBeenCalledWith([], expect.objectContaining({ queryParams: { type: null, page: 1 } }));

    (component['updateSort'] as (value: string) => void)('name');
    expect(navigate).toHaveBeenCalledWith([], expect.objectContaining({ queryParams: { sort: 'name', page: 1 } }));

    (component['updateDir'] as (value: string) => void)('desc');
    expect(navigate).toHaveBeenCalledWith([], expect.objectContaining({ queryParams: { dir: 'desc', page: 1 } }));

    subject.complete();
  });

  it('changes pagination based on total pages', async () => {
    const { component, subject, router, fixture } = await setupListTest(
      { page: '1', pageSize: '8' },
      {
        getPokemonList: () =>
          of({
            items: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
            total: 16
          }),
        getPokemon: () => of(createPokemon('bulbasaur', 1))
      }
    );

    const navigate = vi.spyOn(router, 'navigate');
    await fixture.whenStable();

    expect((component['canNext'] as () => boolean)()).toBe(true);
    (component['goToNextPage'] as () => void)();
    expect(navigate).toHaveBeenCalledWith([], expect.objectContaining({ queryParams: { page: 2 } }));

    subject.complete();
  });

  it('does not advance when already on the last page', async () => {
    const { component, subject, router, fixture } = await setupListTest(
      { page: '1', pageSize: '8' },
      {
        getPokemonList: () =>
          of({
            items: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
            total: 1
          }),
        getPokemon: () => of(createPokemon('bulbasaur', 1))
      }
    );

    const navigate = vi.spyOn(router, 'navigate');
    await fixture.whenStable();

    (component['goToNextPage'] as () => void)();
    expect(navigate).not.toHaveBeenCalled();

    subject.complete();
  });

  it('moves to the previous page when available', async () => {
    const { component, subject, router } = await setupListTest({ page: '2', pageSize: '8' });
    const navigate = vi.spyOn(router, 'navigate');

    (component['goToPreviousPage'] as () => void)();
    expect(navigate).toHaveBeenCalledWith([], expect.objectContaining({ queryParams: { page: 1 } }));

    subject.complete();
  });

  it('reports an error when types fail to load', async () => {
    const { component, subject } = await setupListTest(
      { page: '1', pageSize: '8' },
      { getTypes: () => throwError(() => new Error('fail')) }
    );

    expect((component['typesState'] as () => { status: string; error: string | null })().status).toBe('error');
    expect((component['typesState'] as () => { status: string; error: string | null })().error).toBe('Unable to load types.');

    subject.complete();
  });

  it('filters list results by query text', async () => {
    const { component, subject, fixture } = await setupListTest(
      { page: '1', pageSize: '8', q: 'bulb' },
      {
        getPokemonList: () =>
          of({
            items: [
              { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
              { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' }
            ],
            total: 2
          }),
        getPokemon: (name: string) => of(createPokemon(name, name === 'bulbasaur' ? 1 : 2))
      }
    );

    await fixture.whenStable();
    const items = (component['listState'] as () => { items: Array<{ name: string }> })().items;
    expect(items.map((item) => item.name)).toEqual(['bulbasaur']);

    subject.complete();
  });

  it('sorts by id in descending order', async () => {
    const { component, subject, fixture } = await setupListTest(
      { page: '1', pageSize: '8', sort: 'id', dir: 'desc' },
      {
        getPokemonList: () =>
          of({
            items: [
              { name: 'alpha', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
              { name: 'beta', url: 'https://pokeapi.co/api/v2/pokemon/2/' }
            ],
            total: 2
          }),
        getPokemon: (name: string) => of(createPokemon(name, name === 'alpha' ? 1 : 2))
      }
    );

    await fixture.whenStable();
    const items = (component['listState'] as () => { items: Array<{ name: string }> })().items;
    expect(items.map((item) => item.name)).toEqual(['beta', 'alpha']);

    subject.complete();
  });

  it('sorts ids even when some are missing', async () => {
    const { component, subject, fixture } = await setupListTest(
      { page: '1', pageSize: '8', sort: 'id', dir: 'asc' },
      {
        getPokemonList: () =>
          of({
            items: [
              { name: 'beta', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
              { name: 'alpha', url: 'https://pokeapi.co/api/v2/pokemon/unknown/' }
            ],
            total: 2
          }),
        getPokemon: (name: string) => of(createPokemon(name, name === 'alpha' ? 1 : 2))
      }
    );

    await fixture.whenStable();
    const items = (component['listState'] as () => { items: Array<{ name: string }> })().items;
    expect(items.map((item) => item.name)).toEqual(['alpha', 'beta']);

    subject.complete();
  });

  it('reports an empty list state', async () => {
    const emptySetup = await setupListTest(
      { page: '1', pageSize: '8' },
      { getPokemonList: () => of({ items: [], total: 0 }) }
    );

    await emptySetup.fixture.whenStable();
    expect((emptySetup.component['listState'] as () => { status: string })().status).toBe('empty');
    expect((emptySetup.component['totalPages'] as () => number)()).toBe(1);
    emptySetup.subject.complete();
  });

  it('renders the loading skeleton while list data resolves', async () => {
    const { fixture, subject } = await setupListTest(
      { page: '1', pageSize: '8' },
      { getPokemonList: () => NEVER }
    );

    fixture.detectChanges();

    const skeleton = fixture.nativeElement.querySelector('.skeleton-grid');
    expect(skeleton).not.toBeNull();

    subject.complete();
  });

  it('renders the empty state placeholder in the template', async () => {
    const { fixture, subject } = await setupListTest(
      { page: '1', pageSize: '8' },
      { getPokemonList: () => of({ items: [], total: 0 }) }
    );

    await fixture.whenStable();
    fixture.detectChanges();

    const placeholder = fixture.nativeElement.querySelector('.placeholder');
    expect(placeholder?.textContent).toContain('No results to display.');

    subject.complete();
  });

  it('reports an error list state', async () => {
    const errorSetup = await setupListTest(
      { page: '1', pageSize: '8' },
      { getPokemonList: () => throwError(() => new Error('fail')) }
    );

    await errorSetup.fixture.whenStable();
    expect((errorSetup.component['listState'] as () => { status: string; error: string | null })().status).toBe('error');
    expect((errorSetup.component['listState'] as () => { status: string; error: string | null })().error).toBe(
      'Unable to load the list.'
    );
    errorSetup.subject.complete();
  });

  it('renders the error state placeholder and retry button', async () => {
    const { fixture, subject } = await setupListTest(
      { page: '1', pageSize: '8' },
      { getPokemonList: () => throwError(() => new Error('fail')) }
    );

    await fixture.whenStable();
    fixture.detectChanges();

    const placeholder = fixture.nativeElement.querySelector('.placeholder');
    const retryButton = fixture.nativeElement.querySelector('button');
    expect(placeholder?.textContent).toContain('Unable to load the list.');
    expect(retryButton?.textContent).toContain('Retry');

    subject.complete();
  });

  it('shows the loading option for the type select', async () => {
    const loadingSetup = await setupListTest(
      { page: '1', pageSize: '8' },
      { getTypes: () => NEVER }
    );

    loadingSetup.fixture.detectChanges();
    const loadingSelect = loadingSetup.fixture.nativeElement.querySelector('#type-select');
    expect(loadingSelect?.textContent).toContain('Loading...');
    loadingSetup.subject.complete();
  });

  it('shows the error option for the type select', async () => {
    const errorSetup = await setupListTest(
      { page: '1', pageSize: '8' },
      { getTypes: () => throwError(() => new Error('fail')) }
    );

    await errorSetup.fixture.whenStable();
    errorSetup.fixture.detectChanges();
    const errorSelect = errorSetup.fixture.nativeElement.querySelector('#type-select');
    expect(errorSelect?.textContent).toContain('Unavailable');
    errorSetup.subject.complete();
  });

  it('renders type options and image fallbacks in the list', async () => {
    const { fixture, subject } = await setupListTest(
      { page: '1', pageSize: '8' },
      {
        getTypes: () => of([{ name: 'grass', url: '' }]),
        getPokemonList: () =>
          of({
            items: [
              { name: 'alpha', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
              { name: 'beta', url: 'https://pokeapi.co/api/v2/pokemon/2/' }
            ],
            total: 2
          }),
        getPokemon: (name: string) =>
          of({
            ...createPokemon(name, name === 'alpha' ? 1 : 2),
            spriteUrl: name === 'alpha' ? 'sprite.png' : null,
            artworkUrl: null
          })
      }
    );

    await fixture.whenStable();
    fixture.detectChanges();

    const typeSelect = fixture.nativeElement.querySelector('#type-select');
    expect(typeSelect?.textContent).toContain('grass');

    const images = fixture.nativeElement.querySelectorAll('.thumb img');
    const fallbacks = fixture.nativeElement.querySelectorAll('.thumb-fallback');
    expect(images.length).toBe(1);
    expect(fallbacks.length).toBe(1);

    subject.complete();
  });

  it('renders artwork when sprite is missing', async () => {
    const { fixture, subject } = await setupListTest(
      { page: '1', pageSize: '8' },
      {
        getPokemonList: () =>
          of({
            items: [{ name: 'delta', url: 'https://pokeapi.co/api/v2/pokemon/4/' }],
            total: 1
          }),
        getPokemon: () =>
          of({
            ...createPokemon('delta', 4),
            spriteUrl: null,
            artworkUrl: 'artwork.png'
          })
      }
    );

    await fixture.whenStable();
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('.thumb img');
    expect(image?.getAttribute('src')).toContain('artwork.png');

    subject.complete();
  });

  it('renders type chips for list items', async () => {
    const { fixture, subject } = await setupListTest(
      { page: '1', pageSize: '8' },
      {
        getPokemonList: () =>
          of({
            items: [{ name: 'gamma', url: 'https://pokeapi.co/api/v2/pokemon/3/' }],
            total: 1
          }),
        getPokemon: () =>
          of({
            ...createPokemon('gamma', 3),
            types: [{ name: 'water' }]
          })
      }
    );

    await fixture.whenStable();
    fixture.detectChanges();

    const chips = fixture.nativeElement.querySelectorAll('.chip');
    expect(chips.length).toBeGreaterThan(0);
    expect(chips[0]?.textContent).toContain('water');

    subject.complete();
  });

  it('handles input and select change events in the template', async () => {
    const { fixture, subject, router } = await setupListTest(
      { page: '1', pageSize: '8' },
      { getTypes: () => of([{ name: 'grass', url: '' }]) }
    );

    await fixture.whenStable();
    fixture.detectChanges();

    const navigate = vi.spyOn(router, 'navigate');
    const searchInput = fixture.nativeElement.querySelector('input[type="search"]');
    const typeSelect = fixture.nativeElement.querySelector('#type-select');
    const sortSelect = fixture.nativeElement.querySelector('#sort-select');
    const dirSelect = fixture.nativeElement.querySelector('#dir-select');

    searchInput.value = 'pikachu';
    searchInput.dispatchEvent(new Event('input'));

    typeSelect.value = 'grass';
    typeSelect.dispatchEvent(new Event('change'));

    sortSelect.value = 'name';
    sortSelect.dispatchEvent(new Event('change'));

    dirSelect.value = 'desc';
    dirSelect.dispatchEvent(new Event('change'));

    expect(navigate).toHaveBeenCalled();

    subject.complete();
  });

  it('slices type results when paging and handles missing ids', async () => {
    const { component, subject, fixture } = await setupListTest(
      { page: '2', pageSize: '1', type: 'grass' },
      {
        getPokemonByType: () =>
          of({
            items: [
              { name: 'alpha', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
              { name: 'beta', url: 'https://pokeapi.co/api/v2/pokemon/unknown/' }
            ],
            total: 2
          }),
        getPokemon: (name: string) => of(createPokemon(name, name === 'alpha' ? 1 : 2))
      }
    );

    await fixture.whenStable();
    const state = (component['listState'] as () => { items: Array<{ name: string }> })();
    expect(state.items.length).toBe(1);
    expect(state.items[0]?.name).toBe('alpha');

    subject.complete();
  });

  it('does not change the page when already at the start', async () => {
    const { component, subject, router } = await setupListTest({ page: '1', pageSize: '8' });
    const navigate = vi.spyOn(router, 'navigate');

    (component['goToPreviousPage'] as () => void)();
    expect(navigate).not.toHaveBeenCalled();

    subject.complete();
  });

  it('increments the reload tick when retrying', async () => {
    const { component, subject } = await setupListTest({ page: '1', pageSize: '8' });

    const reloadTick = component['reloadTick'] as () => number;
    (component['retryLoad'] as () => void)();
    expect(reloadTick()).toBe(1);

    subject.complete();
  });

  it('initializes HSSelect instances in the browser', async () => {
    class FakeSelect {
      static instances = new Map<HTMLElement, FakeSelect>();
      static autoInit = vi.fn();
      static getInstance = (el: HTMLElement) => {
        const instance = FakeSelect.instances.get(el);
        return instance ? { element: instance } : null;
      };

      on = vi.fn();
      setValue = vi.fn();
      destroy = vi.fn();

      constructor(private readonly el: HTMLElement) {
        FakeSelect.instances.set(this.el, this);
      }
    }

    const { subject, route } = createRoute({ page: '1', pageSize: '8' });

    await TestBed.configureTestingModule({
      imports: [PokedexListPage],
      providers: [
        provideRouter([]),
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: POKEDEX_DETAIL_CONCURRENCY, useValue: 2 },
        { provide: PokeApiClient, useValue: { getPokemonList: () => of({ items: [], total: 0 }), getPokemonByType: () => of({ items: [], total: 0 }), getPokemon: (name: string) => of(createPokemon(name, 1)), getTypes: () => of([]) } },
        { provide: ActivatedRoute, useValue: route }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PokedexListPage);
    const component = fixture.componentInstance as unknown as Record<string, unknown>;
    component['loadHsSelect'] = vi.fn().mockResolvedValue(FakeSelect);
    fixture.detectChanges();
    await (component['initSelects'] as () => Promise<void>)();

    expect(FakeSelect.instances.size).toBe(3);

    const typeSelect = component['typeSelect'] as { nativeElement: HTMLSelectElement } | undefined;
    expect(typeSelect?.nativeElement.classList.contains('is-hs-ready')).toBe(true);

    subject.complete();
  });

  it('handles select helpers without instances', async () => {
    const { component, subject } = await setupListTest({ page: '1', pageSize: '8' }, {}, 'browser', true);

    const select = document.createElement('select');
    select.innerHTML = '<option value="same">same</option><option value="new">new</option>';
    select.value = 'same';

    (component['setSelectValue'] as (ref: { nativeElement: HTMLSelectElement }, value: string) => void)(
      { nativeElement: select },
      'same'
    );
    expect(select.value).toBe('same');

    (component['setSelectValue'] as (ref: { nativeElement: HTMLSelectElement }, value: string) => void)(
      { nativeElement: select },
      'new'
    );
    expect(select.value).toBe('new');

    expect((component['getSelectInstance'] as (ref: { nativeElement: HTMLSelectElement }) => unknown)({ nativeElement: select })).toBeNull();

    subject.complete();
  });

  it('uses HSSelect instances when setting select values', async () => {
    const { component, subject } = await setupListTest({ page: '1', pageSize: '8' }, {}, 'browser', true);

    const select = document.createElement('select');
    select.innerHTML = '<option value="old">old</option><option value="new">new</option>';
    select.value = 'old';

    const setValue = vi.fn();
    component['getSelectInstance'] = vi.fn(() => ({ setValue, on: vi.fn(), destroy: vi.fn() }));

    (component['setSelectValue'] as (ref: { nativeElement: HTMLSelectElement }, value: string) => void)(
      { nativeElement: select },
      'new'
    );

    expect(setValue).toHaveBeenCalledWith('new');

    subject.complete();
  });

  it('returns null from loadHsSelect on the server', async () => {
    const { component, subject } = await setupListTest({ page: '1', pageSize: '8' });
    const instance = component as unknown as { loadHsSelect: () => Promise<unknown> };

    await expect(instance.loadHsSelect()).resolves.toBeNull();

    subject.complete();
  });

  it('returns the cached HSSelect class in the browser', async () => {
    const { component, subject } = await setupListTest({ page: '1', pageSize: '8' }, {}, 'browser');
    const instance = component as unknown as { loadHsSelect: () => Promise<unknown>; hsSelectClass?: unknown };
    class CachedSelect {
      static autoInit() {}
      static getInstance() {
        return null;
      }
    }

    instance.hsSelectClass = CachedSelect;
    await expect(instance.loadHsSelect()).resolves.toBe(CachedSelect);

    subject.complete();
  });

  it('no-ops ensureSelectCollection on the server', async () => {
    const { component, subject } = await setupListTest({ page: '1', pageSize: '8' });
    const instance = component as unknown as { ensureSelectCollection: () => void };

    expect(() => instance.ensureSelectCollection()).not.toThrow();

    subject.complete();
  });

  it('returns null from getSelectInstance when ref is missing', async () => {
    const { component, subject } = await setupListTest({ page: '1', pageSize: '8' });
    const instance = component as unknown as { getSelectInstance: (ref: unknown) => unknown };

    expect(instance.getSelectInstance(undefined)).toBeNull();

    subject.complete();
  });

  it('returns null from getSelectInstance when the collection is missing', async () => {
    const { subject, route } = createRoute({ page: '1', pageSize: '8' });

    await TestBed.configureTestingModule({
      imports: [PokedexListPage],
      providers: [
        provideRouter([]),
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: POKEDEX_DETAIL_CONCURRENCY, useValue: 2 },
        { provide: PokeApiClient, useValue: { getPokemonList: () => of({ items: [], total: 0 }), getPokemonByType: () => of({ items: [], total: 0 }), getPokemon: (name: string) => of(createPokemon(name, 1)), getTypes: () => of([]) } },
        { provide: ActivatedRoute, useValue: route }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PokedexListPage);
    const component = fixture.componentInstance as unknown as {
      loadHsSelect: () => Promise<unknown>;
      getSelectInstance: (ref: { nativeElement: HTMLSelectElement }) => unknown;
    };
    component.loadHsSelect = vi.fn().mockResolvedValue(null);
    fixture.detectChanges();

    const windowRef = window as Window & { $hsSelectCollection?: unknown[] };
    delete windowRef.$hsSelectCollection;

    const select = document.createElement('select');
    expect(component.getSelectInstance({ nativeElement: select })).toBeNull();

    subject.complete();
  });

  it('returns null from getSelectInstance when HSSelect has no instance', async () => {
    const { subject, route } = createRoute({ page: '1', pageSize: '8' });

    await TestBed.configureTestingModule({
      imports: [PokedexListPage],
      providers: [
        provideRouter([]),
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: POKEDEX_DETAIL_CONCURRENCY, useValue: 2 },
        { provide: PokeApiClient, useValue: { getPokemonList: () => of({ items: [], total: 0 }), getPokemonByType: () => of({ items: [], total: 0 }), getPokemon: (name: string) => of(createPokemon(name, 1)), getTypes: () => of([]) } },
        { provide: ActivatedRoute, useValue: route }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PokedexListPage);
    const component = fixture.componentInstance as unknown as {
      loadHsSelect: () => Promise<unknown>;
      hsSelectClass?: { getInstance: (element: HTMLElement, isInstance?: boolean) => unknown };
      getSelectInstance: (ref: { nativeElement: HTMLSelectElement }) => unknown;
    };
    component.loadHsSelect = vi.fn().mockResolvedValue(null);
    fixture.detectChanges();

    const windowRef = window as Window & { $hsSelectCollection?: unknown[] };
    windowRef.$hsSelectCollection = [];

    component.hsSelectClass = { getInstance: () => null };

    const select = document.createElement('select');
    expect(component.getSelectInstance({ nativeElement: select })).toBeNull();

    subject.complete();
  });

  it('returns HSSelect instances from getSelectInstance', async () => {
    const { subject, route } = createRoute({ page: '1', pageSize: '8' });

    await TestBed.configureTestingModule({
      imports: [PokedexListPage],
      providers: [
        provideRouter([]),
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: POKEDEX_DETAIL_CONCURRENCY, useValue: 2 },
        { provide: PokeApiClient, useValue: { getPokemonList: () => of({ items: [], total: 0 }), getPokemonByType: () => of({ items: [], total: 0 }), getPokemon: (name: string) => of(createPokemon(name, 1)), getTypes: () => of([]) } },
        { provide: ActivatedRoute, useValue: route }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PokedexListPage);
    const component = fixture.componentInstance as unknown as {
      loadHsSelect: () => Promise<unknown>;
      hsSelectClass?: { getInstance: (element: HTMLElement, isInstance?: boolean) => unknown };
      getSelectInstance: (ref: { nativeElement: HTMLSelectElement }) => unknown;
    };
    component.loadHsSelect = vi.fn().mockResolvedValue(null);
    fixture.detectChanges();

    const windowRef = window as Window & { $hsSelectCollection?: unknown[] };
    windowRef.$hsSelectCollection = [];

    const rawInstance = { on: vi.fn(), setValue: vi.fn(), destroy: vi.fn() };
    component.hsSelectClass = { getInstance: () => rawInstance };

    const select = document.createElement('select');
    expect(component.getSelectInstance({ nativeElement: select })).toBe(rawInstance);

    component.hsSelectClass = { getInstance: () => ({ element: rawInstance }) };
    expect(component.getSelectInstance({ nativeElement: select })).toBe(rawInstance);

    subject.complete();
  });

  it('handles destroySelects when instances have no element wrapper', async () => {
    const { subject, route } = createRoute({ page: '1', pageSize: '8' });

    await TestBed.configureTestingModule({
      imports: [PokedexListPage],
      providers: [
        provideRouter([]),
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: POKEDEX_DETAIL_CONCURRENCY, useValue: 2 },
        { provide: PokeApiClient, useValue: { getPokemonList: () => of({ items: [], total: 0 }), getPokemonByType: () => of({ items: [], total: 0 }), getPokemon: (name: string) => of(createPokemon(name, 1)), getTypes: () => of([]) } },
        { provide: ActivatedRoute, useValue: route }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PokedexListPage);
    const component = fixture.componentInstance as unknown as {
      loadHsSelect: () => Promise<unknown>;
      hsSelectClass?: { getInstance: (element: HTMLElement, isInstance?: boolean) => unknown };
      destroySelects: () => void;
    };
    component.loadHsSelect = vi.fn().mockResolvedValue(null);
    fixture.detectChanges();

    const windowRef = window as Window & { $hsSelectCollection?: unknown[] };
    windowRef.$hsSelectCollection = [];

    const destroy = vi.fn();
    component.hsSelectClass = { getInstance: () => ({ destroy }) };

    component.destroySelects();
    expect(destroy).toHaveBeenCalled();

    subject.complete();
  });

  it('normalizes change events in registerSelectHandler', async () => {
    const { component, subject } = await setupListTest({ page: '1', pageSize: '8' });
    const instance = component as unknown as {
      registerSelectHandler: (
        ref: { nativeElement: HTMLSelectElement } | undefined,
        handler: (value: string) => void
      ) => void;
      getSelectInstance: (ref: { nativeElement: HTMLSelectElement }) => { on: (event: string, cb: (value: string | string[]) => void) => void };
    };

    let callback: ((value: string | string[]) => void) | undefined;
    instance.getSelectInstance = vi.fn(() => ({
      on: (_event: string, cb: (value: string | string[]) => void) => {
        callback = cb;
      }
    }));

    const handler = vi.fn();
    instance.registerSelectHandler({ nativeElement: document.createElement('select') }, handler);

    callback?.(['fire']);
    callback?.([]);
    callback?.(undefined as unknown as string);
    callback?.('water');

    expect(handler).toHaveBeenCalledWith('fire');
    expect(handler).toHaveBeenCalledWith('');
    expect(handler).toHaveBeenCalledWith('water');
    expect(handler).toHaveBeenCalledWith('');

    subject.complete();
  });

  it('skips select creation for missing refs', async () => {
    const { component, subject } = await setupListTest({ page: '1', pageSize: '8' }, {}, 'browser', true);
    const select = document.createElement('select');

    class FakeSelect {
      static calls: HTMLElement[] = [];
      static autoInit() {}
      static getInstance() {
        return null;
      }
      constructor(element: HTMLElement) {
        FakeSelect.calls.push(element);
      }
      on() {}
      setValue() {}
      destroy() {}
    }

    const instance = component as unknown as {
      typeSelect?: { nativeElement: HTMLSelectElement };
      sortSelect?: { nativeElement: HTMLSelectElement };
      dirSelect?: { nativeElement: HTMLSelectElement };
      createSelectInstances: (hsSelect: unknown) => void;
    };

    instance.typeSelect = { nativeElement: select };
    instance.sortSelect = undefined;
    instance.dirSelect = undefined;

    instance.createSelectInstances(FakeSelect);
    expect(FakeSelect.calls.length).toBe(1);

    subject.complete();
  });

  it('skips type select creation when the ref is missing', async () => {
    const { component, subject } = await setupListTest({ page: '1', pageSize: '8' }, {}, 'browser', true);
    const select = document.createElement('select');

    class FakeSelect {
      static calls: HTMLElement[] = [];
      static autoInit() {}
      static getInstance() {
        return null;
      }
      constructor(element: HTMLElement) {
        FakeSelect.calls.push(element);
      }
      on() {}
      setValue() {}
      destroy() {}
    }

    const instance = component as unknown as {
      typeSelect?: { nativeElement: HTMLSelectElement };
      sortSelect?: { nativeElement: HTMLSelectElement };
      dirSelect?: { nativeElement: HTMLSelectElement };
      createSelectInstances: (hsSelect: unknown) => void;
    };

    instance.typeSelect = undefined;
    instance.sortSelect = { nativeElement: select };
    instance.dirSelect = { nativeElement: select };

    instance.createSelectInstances(FakeSelect);
    expect(FakeSelect.calls.length).toBe(2);

    subject.complete();
  });
});
