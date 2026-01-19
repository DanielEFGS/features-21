import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import * as axe from 'axe-core';
import { BehaviorSubject, of } from 'rxjs';

import { POKEDEX_DETAIL_CONCURRENCY } from '../../../core/config/pokedex-config';
import { PokeApiClient } from '../../../data/poke-api/poke-api.client';
import { Pokemon, PokemonList } from '../../../data/poke-api/poke-api.models';
import { PokedexListPage } from './pokedex-list-page';

describe('PokedexListPage accessibility', () => {
  it('has no WCAG A/AA violations', async () => {
    const queryParams$ = new BehaviorSubject(convertToParamMap({ page: '1', pageSize: '8' }));
    const pokemon: Pokemon = {
      id: 1,
      name: 'bulbasaur',
      baseExperience: 64,
      height: 7,
      weight: 69,
      isDefault: true,
      order: 1,
      spriteUrl: 'sprite.png',
      artworkUrl: 'artwork.png',
      sprites: [],
      types: [{ name: 'grass' }],
      abilities: [],
      stats: []
    };
    const list: PokemonList = {
      items: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
      total: 1
    };

    await TestBed.configureTestingModule({
      imports: [PokedexListPage],
      providers: [
        provideRouter([]),
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: POKEDEX_DETAIL_CONCURRENCY, useValue: 2 },
        {
          provide: PokeApiClient,
          useValue: {
            getPokemonList: () => of(list),
            getPokemonByType: () => of(list),
            getPokemon: () => of(pokemon),
            getTypes: () => of([{ name: 'grass', url: '' }])
          }
        },
        { provide: ActivatedRoute, useValue: { queryParamMap: queryParams$.asObservable() } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PokedexListPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const results = await axe.run(fixture.nativeElement, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
    });

    expect(results.violations).toHaveLength(0);
    queryParams$.complete();
  });
});
