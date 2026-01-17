import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { PokeApiClient } from '../../../data/poke-api/poke-api.client';
import { PokedexDetailPage } from './pokedex-detail-page';

describe('PokedexDetailPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokedexDetailPage],
      providers: [
        {
          provide: PokeApiClient,
          useValue: {
            getPokemon: () =>
              of({
                id: 1,
                name: 'bulbasaur',
                spriteUrl: null,
                artworkUrl: null,
                types: [],
                abilities: [],
                stats: []
              })
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ nameOrId: '1' }))
          }
        }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PokedexDetailPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
