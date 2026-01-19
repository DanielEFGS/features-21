import { describe, expect, it } from 'vitest';

import {
  mapNamedResource,
  mapPokemon,
  mapPokemonList,
  mapTypeDetail,
  mapTypeList
} from './poke-api.mappers';
import type {
  NamedApiResourceDto,
  PokemonDto,
  PokemonListResponseDto,
  TypeDetailResponseDto,
  TypeListResponseDto
} from './poke-api.dto';

describe('poke-api mappers', () => {
  it('maps named resources', () => {
    const dto: NamedApiResourceDto = { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' };

    expect(mapNamedResource(dto)).toEqual(dto);
  });

  it('maps pokemon list responses', () => {
    const dto: PokemonListResponseDto = {
      count: 2,
      next: null,
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' }
      ]
    };

    expect(mapPokemonList(dto)).toEqual({
      total: 2,
      items: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' }
      ]
    });
  });

  it('maps type list responses', () => {
    const dto: TypeListResponseDto = {
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'fire', url: 'https://pokeapi.co/api/v2/type/10/' }]
    };

    expect(mapTypeList(dto)).toEqual([{ name: 'fire', url: 'https://pokeapi.co/api/v2/type/10/' }]);
  });

  it('maps type detail responses to pokemon list items', () => {
    const dto: TypeDetailResponseDto = {
      id: 10,
      name: 'fire',
      pokemon: [
        {
          pokemon: { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
          slot: 1
        }
      ]
    } as TypeDetailResponseDto;

    expect(mapTypeDetail(dto)).toEqual([
      { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' }
    ]);
  });

  it('maps pokemon detail payloads with sprites and stats', () => {
    const dto: PokemonDto = {
      id: 25,
      name: 'pikachu',
      base_experience: 112,
      height: 4,
      weight: 60,
      is_default: true,
      order: 35,
      abilities: [
        {
          ability: { name: 'static', url: 'https://pokeapi.co/api/v2/ability/9/' },
          is_hidden: false,
          slot: 1
        }
      ],
      forms: [],
      game_indices: [],
      held_items: [],
      location_area_encounters: '',
      moves: [],
      species: { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon-species/25/' },
      sprites: {
        front_default: 'front.png',
        front_shiny: 'front-shiny.png',
        back_default: null,
        back_shiny: null,
        other: {
          'official-artwork': {
            front_default: 'art.png',
            front_shiny: 'art-shiny.png'
          }
        }
      },
      stats: [
        { base_stat: 55, effort: 0, stat: { name: 'attack', url: '' } }
      ],
      types: [
        { slot: 1, type: { name: 'electric', url: '' } }
      ]
    } as PokemonDto;

    const result = mapPokemon(dto);

    expect(result).toMatchObject({
      id: 25,
      name: 'pikachu',
      baseExperience: 112,
      height: 4,
      weight: 60,
      isDefault: true,
      order: 35,
      spriteUrl: 'front.png',
      artworkUrl: 'art.png',
      types: [{ name: 'electric' }],
      abilities: [{ name: 'static', isHidden: false, slot: 1 }],
      stats: [{ name: 'attack', value: 55 }]
    });

    expect(result.sprites.some((sprite) => sprite.label === 'Front' && sprite.url === 'front.png')).toBe(true);
    expect(result.sprites.some((sprite) => sprite.label === 'Artwork' && sprite.url === 'art.png')).toBe(true);
    expect(result.sprites.some((sprite) => sprite.label === 'Front shiny' && sprite.url === 'front-shiny.png')).toBe(true);
  });
});
