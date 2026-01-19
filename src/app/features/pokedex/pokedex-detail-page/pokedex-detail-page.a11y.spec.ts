import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import * as axe from 'axe-core';
import { of } from 'rxjs';

import { PokeApiClient } from '../../../data/poke-api/poke-api.client';
import { Pokemon } from '../../../data/poke-api/poke-api.models';
import { PokedexDetailPage } from './pokedex-detail-page';

describe('PokedexDetailPage accessibility', () => {
  it('has no WCAG A/AA violations', async () => {
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
      sprites: [{ label: 'Front', url: 'sprite.png' }],
      types: [{ name: 'grass' }],
      abilities: [{ name: 'overgrow', isHidden: false, slot: 1 }],
      stats: [
        { name: 'hp', value: 45 },
        { name: 'special-attack', value: 65 }
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

    const results = await axe.run(fixture.nativeElement, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
    });

    expect(results.violations).toHaveLength(0);
  });
});
