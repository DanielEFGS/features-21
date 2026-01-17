import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { PokeApiClient } from '../../../data/poke-api/poke-api.client';
import { POKEDEX_DETAIL_CONCURRENCY } from '../../../core/config/pokedex-config';
import { PokedexListPage } from './pokedex-list-page';

describe('PokedexListPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokedexListPage],
      providers: [
        provideRouter([]),
        { provide: POKEDEX_DETAIL_CONCURRENCY, useValue: 2 },
        {
          provide: PokeApiClient,
          useValue: {
            getPokemonList: () => of({ items: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }], total: 1 }),
            getPokemon: () =>
              of({
                id: 1,
                name: 'bulbasaur',
                spriteUrl: null,
                artworkUrl: null,
                types: [],
                abilities: [],
                stats: []
              }),
            getPokemonByType: () => of({ items: [], total: 0 }),
            getTypes: () => of([])
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of(convertToParamMap({ page: '1', pageSize: '8' }))
          }
        }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PokedexListPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
