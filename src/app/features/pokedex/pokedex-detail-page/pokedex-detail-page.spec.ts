import { Location } from '@angular/common';
import { PLATFORM_ID, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { NEVER, of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { PokeApiClient } from '../../../data/poke-api/poke-api.client';
import { Pokemon } from '../../../data/poke-api/poke-api.models';
import { PokedexDetailPage } from './pokedex-detail-page';

function createPokemon(): Pokemon {
  return {
    id: 1,
    name: 'bulbasaur',
    baseExperience: 64,
    height: 7,
    weight: 69,
    isDefault: true,
    order: 1,
    spriteUrl: 'sprite.png',
    artworkUrl: 'artwork.png',
    sprites: [{ label: 'Front', url: 'sprite.png' }],
    types: [{ name: 'grass' }],
    abilities: [{ name: 'overgrow', isHidden: false, slot: 1 }],
    stats: [
      { name: 'hp', value: 45 },
      { name: 'special-attack', value: 65 }
    ]
  };
}

describe('PokedexDetailPage', () => {
  it('computes stats, totals, and image url', async () => {
    const pokemon = createPokemon();
    const getPokemon = vi.fn(() => of(pokemon));

    await TestBed.configureTestingModule({
      imports: [PokedexDetailPage],
      providers: [
        { provide: PokeApiClient, useValue: { getPokemon } },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ nameOrId: '1' })) }
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PokedexDetailPage);
    fixture.detectChanges();
    await fixture.whenStable();

    const component = fixture.componentInstance as unknown as {
      imageUrl: () => string | null;
      statRows: () => Array<{ label: string; value: number }>;
      spriteGallery: () => Array<{ label: string; url: string }>;
      totalStats: () => number;
      formatHeight: (value: number) => string;
      formatWeight: (value: number) => string;
    };

    expect(component.imageUrl()).toBe('artwork.png');
    expect(component.spriteGallery().length).toBe(1);
    expect(component.totalStats()).toBe(110);
    expect(component.statRows()[1]?.label).toBe('SP. ATK');
    expect(component.formatHeight(7)).toBe('0.7 m');
    expect(component.formatWeight(69)).toBe('6.9 kg');
  });

  it('toggles disclosure state', async () => {
    await TestBed.configureTestingModule({
      imports: [PokedexDetailPage],
      providers: [
        { provide: PokeApiClient, useValue: { getPokemon: () => of(createPokemon()) } },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ nameOrId: '1' })) }
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PokedexDetailPage);
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      statsExpanded: () => boolean;
      abilitiesExpanded: () => boolean;
      spritesExpanded: () => boolean;
      toggleStatsExpanded: () => void;
      toggleAbilitiesExpanded: () => void;
      toggleSpritesExpanded: () => void;
    };

    expect(component.statsExpanded()).toBe(true);
    component.toggleStatsExpanded();
    expect(component.statsExpanded()).toBe(false);

    expect(component.abilitiesExpanded()).toBe(true);
    component.toggleAbilitiesExpanded();
    expect(component.abilitiesExpanded()).toBe(false);

    expect(component.spritesExpanded()).toBe(true);
    component.toggleSpritesExpanded();
    expect(component.spritesExpanded()).toBe(false);
  });

  it('handles missing parameters', async () => {
    await TestBed.configureTestingModule({
      imports: [PokedexDetailPage],
      providers: [
        { provide: PokeApiClient, useValue: { getPokemon: () => of(createPokemon()) } },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({})) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PokedexDetailPage);
    fixture.detectChanges();
    await fixture.whenStable();

    const component = fixture.componentInstance as unknown as { detailState: () => { status: string; error: string | null } };
    expect(component.detailState().status).toBe('error');
    expect(component.detailState().error).toBe('Invalid parameter.');
  });

  it('reports errors from the API', async () => {
    await TestBed.configureTestingModule({
      imports: [PokedexDetailPage],
      providers: [
        { provide: PokeApiClient, useValue: { getPokemon: () => throwError(() => new Error('fail')) } },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ nameOrId: '1' })) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PokedexDetailPage);
    fixture.detectChanges();
    await fixture.whenStable();

    const component = fixture.componentInstance as unknown as { detailState: () => { status: string; error: string | null } };
    expect(component.detailState().status).toBe('error');
    expect(component.detailState().error).toBe('Unable to load the detail.');
  });

  it('falls back to sprite when artwork is missing', async () => {
    const pokemon = { ...createPokemon(), artworkUrl: null, spriteUrl: 'sprite.png' };

    await TestBed.configureTestingModule({
      imports: [PokedexDetailPage],
      providers: [
        { provide: PokeApiClient, useValue: { getPokemon: () => of(pokemon) } },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ nameOrId: '1' })) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PokedexDetailPage);
    fixture.detectChanges();
    await fixture.whenStable();

    const component = fixture.componentInstance as unknown as { imageUrl: () => string | null; formatStatLabel: (value: string) => string };
    expect(component.imageUrl()).toBe('sprite.png');
    expect(component.formatStatLabel('speed')).toBe('SPD');
    expect(component.formatStatLabel('unknown')).toBe('UNKNOWN');
  });

  it('renders header metadata and type chips', async () => {
    await TestBed.configureTestingModule({
      imports: [PokedexDetailPage],
      providers: [
        { provide: PokeApiClient, useValue: { getPokemon: () => of(createPokemon()) } },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ nameOrId: '1' })) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PokedexDetailPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      detailState: () => { status: string };
    };
    const header = fixture.nativeElement.querySelector('.detail-meta');
    expect(component.detailState().status).toBe('success');
    expect(header?.textContent).toContain('#1');
    expect(header?.textContent).toContain('bulbasaur');
    expect(header?.textContent).toContain('grass');

    const facts = fixture.nativeElement.querySelector('.quick-facts');
    expect(facts?.textContent).toContain('Base exp');
    expect(facts?.textContent).toContain('Order');

    const abilities = fixture.nativeElement.querySelector('.ability-list');
    expect(abilities?.textContent).toContain('overgrow');
  });

  it('formats additional stat labels', async () => {
    await TestBed.configureTestingModule({
      imports: [PokedexDetailPage],
      providers: [
        { provide: PokeApiClient, useValue: { getPokemon: () => of(createPokemon()) } },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ nameOrId: '1' })) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PokedexDetailPage);
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as { formatStatLabel: (value: string) => string };
    expect(component.formatStatLabel('hp')).toBe('HP');
    expect(component.formatStatLabel('attack')).toBe('ATK');
    expect(component.formatStatLabel('defense')).toBe('DEF');
    expect(component.formatStatLabel('special-defense')).toBe('SP. DEF');
  });

  it('renders safely when the API returns a null payload', async () => {
    await TestBed.configureTestingModule({
      imports: [PokedexDetailPage],
      providers: [
        { provide: PokeApiClient, useValue: { getPokemon: () => of(null as unknown as Pokemon) } },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ nameOrId: '1' })) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PokedexDetailPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      spriteGallery: () => Array<unknown>;
      totalStats: () => number;
    };
    const header = fixture.nativeElement.querySelector('.detail-meta');
    expect(header?.textContent).toContain('#');
    expect(fixture.nativeElement.querySelectorAll('.chip').length).toBe(0);
    expect(fixture.nativeElement.querySelectorAll('.ability-chip').length).toBe(0);
    expect(component.spriteGallery()).toEqual([]);
    expect(component.totalStats()).toBe(0);
  });

  it('renders the loading skeleton while data resolves', async () => {
    await TestBed.configureTestingModule({
      imports: [PokedexDetailPage],
      providers: [
        { provide: PokeApiClient, useValue: { getPokemon: () => NEVER } },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ nameOrId: '1' })) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PokedexDetailPage);
    fixture.detectChanges();

    const skeleton = fixture.nativeElement.querySelector('.skeleton-detail');
    expect(skeleton).not.toBeNull();
  });

  it('returns safe defaults while loading', async () => {
    await TestBed.configureTestingModule({
      imports: [PokedexDetailPage],
      providers: [
        { provide: PokeApiClient, useValue: { getPokemon: () => NEVER } },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ nameOrId: '1' })) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PokedexDetailPage);
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      imageUrl: () => string | null;
      statRows: () => Array<unknown>;
      spriteGallery: () => Array<unknown>;
      totalStats: () => number;
    };

    expect(component.imageUrl()).toBeNull();
    expect(component.statRows()).toEqual([]);
    expect(component.spriteGallery()).toEqual([]);
    expect(component.totalStats()).toBe(0);
  });

  it('updates computed values when detail state changes', async () => {
    await TestBed.configureTestingModule({
      imports: [PokedexDetailPage],
      providers: [
        { provide: PokeApiClient, useValue: { getPokemon: () => NEVER } },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ nameOrId: '1' })) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PokedexDetailPage);
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      detailState: (value?: unknown) => { status: string; pokemon: Pokemon | null; error: string | null };
      imageUrl: () => string | null;
      statRows: () => Array<{ label: string }>;
      spriteGallery: () => Array<{ url: string }>;
      totalStats: () => number;
    };

    const detailState = signal<{ status: string; pokemon: Pokemon | null; error: string | null }>({
      status: 'success',
      pokemon: createPokemon(),
      error: null
    });

    (component as unknown as { detailState: typeof detailState }).detailState = detailState;

    expect(component.imageUrl()).toBe('artwork.png');
    expect(component.statRows().length).toBeGreaterThan(0);
    expect(component.spriteGallery().length).toBe(1);
    expect(component.totalStats()).toBe(110);

    detailState.set({
      status: 'success',
      pokemon: { ...createPokemon(), artworkUrl: null, spriteUrl: 'sprite.png', sprites: [] },
      error: null
    });

    expect(component.imageUrl()).toBe('sprite.png');
    expect(component.spriteGallery()).toEqual([]);

    detailState.set({ status: 'error', pokemon: null, error: 'fail' });

    expect(component.imageUrl()).toBeNull();
    expect(component.statRows()).toEqual([]);
    expect(component.totalStats()).toBe(0);
  });

  it('renders the error placeholder when params are invalid', async () => {
    await TestBed.configureTestingModule({
      imports: [PokedexDetailPage],
      providers: [
        { provide: PokeApiClient, useValue: { getPokemon: () => of(createPokemon()) } },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({})) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PokedexDetailPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      statRows: () => Array<unknown>;
      totalStats: () => number;
    };
    const placeholder = fixture.nativeElement.querySelector('.placeholder');
    expect(placeholder?.textContent).toContain('Invalid parameter.');
    expect(component.statRows()).toEqual([]);
    expect(component.totalStats()).toBe(0);
  });

  it('renders fallback image and ability tags in the template', async () => {
    const pokemon: Pokemon = {
      ...createPokemon(),
      artworkUrl: null,
      spriteUrl: null,
      abilities: [
        { name: 'overgrow', isHidden: false, slot: 1 },
        { name: 'chlorophyll', isHidden: true, slot: 3 }
      ]
    };

    await TestBed.configureTestingModule({
      imports: [PokedexDetailPage],
      providers: [
        { provide: PokeApiClient, useValue: { getPokemon: () => of(pokemon) } },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ nameOrId: '1' })) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PokedexDetailPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const fallback = fixture.nativeElement.querySelector('.image-fallback');
    expect(fallback?.textContent).toContain('No image');

    const hiddenTag = fixture.nativeElement.querySelector('.ability-tag');
    expect(hiddenTag?.textContent).toContain('Hidden');
  });

  it('hides panels when toggled closed', async () => {
    await TestBed.configureTestingModule({
      imports: [PokedexDetailPage],
      providers: [
        { provide: PokeApiClient, useValue: { getPokemon: () => of(createPokemon()) } },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ nameOrId: '1' })) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PokedexDetailPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const statsToggle = fixture.nativeElement.querySelector('#stats-toggle');
    const abilitiesToggle = fixture.nativeElement.querySelector('#abilities-toggle');
    const spritesToggle = fixture.nativeElement.querySelector('#sprites-toggle');

    statsToggle.dispatchEvent(new Event('click'));
    abilitiesToggle.dispatchEvent(new Event('click'));
    spritesToggle.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    const statsPanel = fixture.nativeElement.querySelector('#stats-panel');
    const abilitiesPanel = fixture.nativeElement.querySelector('#abilities-panel');
    const spritesPanel = fixture.nativeElement.querySelector('#sprites-panel');
    expect(statsPanel).toBeNull();
    expect(abilitiesPanel).toBeNull();
    expect(spritesPanel).toBeNull();
  });

  it('navigates back when browser history is available', async () => {
    const locationBack = vi.fn();
    const routerNavigate = vi.fn();

    window.history.pushState({}, '', '/pokedex/1');

    await TestBed.configureTestingModule({
      imports: [PokedexDetailPage],
      providers: [
        { provide: PokeApiClient, useValue: { getPokemon: () => of(createPokemon()) } },
        { provide: Location, useValue: { back: locationBack } },
        { provide: Router, useValue: { navigate: routerNavigate } },
        { provide: PLATFORM_ID, useValue: 'browser' },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ nameOrId: '1' })) }
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PokedexDetailPage);
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as { goBack: () => void };
    component.goBack();

    expect(locationBack).toHaveBeenCalled();
    expect(routerNavigate).not.toHaveBeenCalled();
  });

  it('falls back to the list on the server', async () => {
    const locationBack = vi.fn();
    const routerNavigate = vi.fn();

    await TestBed.configureTestingModule({
      imports: [PokedexDetailPage],
      providers: [
        { provide: PokeApiClient, useValue: { getPokemon: () => of(createPokemon()) } },
        { provide: Location, useValue: { back: locationBack } },
        { provide: Router, useValue: { navigate: routerNavigate } },
        { provide: PLATFORM_ID, useValue: 'server' },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ nameOrId: '1' })) }
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PokedexDetailPage);
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as { goBack: () => void };
    component.goBack();

    expect(routerNavigate).toHaveBeenCalledWith(['/pokedex']);
    expect(locationBack).not.toHaveBeenCalled();
  });

  it('navigates to the list when browser history is empty', async () => {
    const locationBack = vi.fn();
    const routerNavigate = vi.fn();

    await TestBed.configureTestingModule({
      imports: [PokedexDetailPage],
      providers: [
        { provide: PokeApiClient, useValue: { getPokemon: () => of(createPokemon()) } },
        { provide: Location, useValue: { back: locationBack } },
        { provide: Router, useValue: { navigate: routerNavigate } },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ nameOrId: '1' })) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PokedexDetailPage);
    fixture.detectChanges();

    Object.defineProperty(window.history, 'length', { value: 1, configurable: true });

    const component = fixture.componentInstance as unknown as { goBack: () => void };
    component.goBack();

    expect(routerNavigate).toHaveBeenCalledWith(['/pokedex']);
    expect(locationBack).not.toHaveBeenCalled();
  });
});
