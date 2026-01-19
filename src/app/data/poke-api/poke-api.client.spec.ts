import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { PokeApiClient } from './poke-api.client';
import { Pokemon } from './poke-api.models';

describe('PokeApiClient', () => {
  it('should map pokemon list response', () => {
    TestBed.configureTestingModule({
      providers: [PokeApiClient, provideHttpClient(), provideHttpClientTesting()]
    });

    const client = TestBed.inject(PokeApiClient);
    const httpMock = TestBed.inject(HttpTestingController);

    client.getPokemonList(1, 0).subscribe((result) => {
      expect(result.total).toBe(1);
      expect(result.items[0]?.name).toBe('bulbasaur');
    });

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon?limit=1&offset=0');
    req.flush({
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }]
    });

    httpMock.verify();
  });

  it('should cache types response', () => {
    TestBed.configureTestingModule({
      providers: [PokeApiClient, provideHttpClient(), provideHttpClientTesting()]
    });

    const client = TestBed.inject(PokeApiClient);
    const httpMock = TestBed.inject(HttpTestingController);

    client.getTypes().subscribe((result) => {
      expect(result.length).toBe(1);
    });

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/type');
    req.flush({
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' }]
    });

    client.getTypes().subscribe((result) => {
      expect(result[0]?.name).toBe('grass');
    });

    httpMock.expectNone('https://pokeapi.co/api/v2/type');
    httpMock.verify();
  });

  it('dedupes in-flight type requests', () => {
    TestBed.configureTestingModule({
      providers: [PokeApiClient, provideHttpClient(), provideHttpClientTesting()]
    });

    const client = TestBed.inject(PokeApiClient);
    const httpMock = TestBed.inject(HttpTestingController);

    let firstResult: string | undefined;
    let secondResult: string | undefined;

    client.getTypes().subscribe((result) => {
      firstResult = result[0]?.name;
    });
    client.getTypes().subscribe((result) => {
      secondResult = result[0]?.name;
    });

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/type');
    req.flush({
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'fire', url: 'https://pokeapi.co/api/v2/type/10/' }]
    });

    expect(firstResult).toBe('fire');
    expect(secondResult).toBe('fire');
    httpMock.verify();
  });

  it('should cache pokemon by type response', () => {
    TestBed.configureTestingModule({
      providers: [PokeApiClient, provideHttpClient(), provideHttpClientTesting()]
    });

    const client = TestBed.inject(PokeApiClient);
    const httpMock = TestBed.inject(HttpTestingController);

    client.getPokemonByType('grass').subscribe((result) => {
      expect(result.total).toBe(1);
    });

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/type/grass');
    req.flush({
      id: 12,
      name: 'grass',
      pokemon: [
        { slot: 1, pokemon: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' } }
      ]
    });

    client.getPokemonByType('grass').subscribe((result) => {
      expect(result.items[0]?.name).toBe('bulbasaur');
    });

    httpMock.expectNone('https://pokeapi.co/api/v2/type/grass');
    httpMock.verify();
  });

  it('dedupes in-flight pokemon-by-type requests', () => {
    TestBed.configureTestingModule({
      providers: [PokeApiClient, provideHttpClient(), provideHttpClientTesting()]
    });

    const client = TestBed.inject(PokeApiClient);
    const httpMock = TestBed.inject(HttpTestingController);

    let firstResult = 0;
    let secondResult = 0;

    client.getPokemonByType('water').subscribe((result) => {
      firstResult = result.total;
    });
    client.getPokemonByType('water').subscribe((result) => {
      secondResult = result.total;
    });

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/type/water');
    req.flush({
      id: 11,
      name: 'water',
      pokemon: [
        { slot: 1, pokemon: { name: 'squirtle', url: 'https://pokeapi.co/api/v2/pokemon/7/' } }
      ]
    });

    expect(firstResult).toBe(1);
    expect(secondResult).toBe(1);
    httpMock.verify();
  });

  it('caches pokemon detail responses', () => {
    TestBed.configureTestingModule({
      providers: [PokeApiClient, provideHttpClient(), provideHttpClientTesting()]
    });

    const client = TestBed.inject(PokeApiClient);
    const httpMock = TestBed.inject(HttpTestingController);

    client.getPokemon('1').subscribe((result) => {
      expect(result.name).toBe('bulbasaur');
    });

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/1');
    req.flush({
      id: 1,
      name: 'bulbasaur',
      base_experience: 0,
      height: 0,
      weight: 0,
      is_default: true,
      order: 1,
      abilities: [],
      forms: [],
      game_indices: [],
      held_items: [],
      location_area_encounters: '',
      moves: [],
      species: { name: 'bulbasaur', url: '' },
      sprites: { front_default: null, front_shiny: null, back_default: null, back_shiny: null },
      stats: [],
      types: []
    });

    client.getPokemon('1').subscribe((result) => {
      expect(result.id).toBe(1);
    });

    httpMock.expectNone('https://pokeapi.co/api/v2/pokemon/1');
    httpMock.verify();
  });

  it('dedupes in-flight pokemon detail requests', () => {
    TestBed.configureTestingModule({
      providers: [PokeApiClient, provideHttpClient(), provideHttpClientTesting()]
    });

    const client = TestBed.inject(PokeApiClient);
    const httpMock = TestBed.inject(HttpTestingController);

    let firstName: string | undefined;
    let secondName: string | undefined;

    client.getPokemon('25').subscribe((result) => {
      firstName = result.name;
    });
    client.getPokemon('25').subscribe((result) => {
      secondName = result.name;
    });

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/25');
    req.flush({
      id: 25,
      name: 'pikachu',
      base_experience: 0,
      height: 0,
      weight: 0,
      is_default: true,
      order: 25,
      abilities: [],
      forms: [],
      game_indices: [],
      held_items: [],
      location_area_encounters: '',
      moves: [],
      species: { name: 'pikachu', url: '' },
      sprites: { front_default: null, front_shiny: null, back_default: null, back_shiny: null },
      stats: [],
      types: []
    });

    expect(firstName).toBe('pikachu');
    expect(secondName).toBe('pikachu');
    httpMock.verify();
  });

  it('uses transfer state on the browser', () => {
    TestBed.configureTestingModule({
      providers: [PokeApiClient, provideHttpClient(), provideHttpClientTesting()]
    });

    const client = TestBed.inject(PokeApiClient);
    const transferState = TestBed.inject(TransferState);
    const httpMock = TestBed.inject(HttpTestingController);

    const stateKey = makeStateKey<Pokemon>('pokedex.pokemon.25');
    transferState.set(stateKey, {
        id: 25,
        name: 'pikachu',
        baseExperience: 0,
        height: 0,
        weight: 0,
        isDefault: true,
        order: 1,
        spriteUrl: null,
        artworkUrl: null,
        sprites: [],
        types: [],
        abilities: [],
        stats: []
      }
    );

    client.getPokemon(25).subscribe((result) => {
      expect(result.name).toBe('pikachu');
    });

    httpMock.expectNone('https://pokeapi.co/api/v2/pokemon/25');
    httpMock.verify();
  });

  it('falls back to HTTP when transfer state is empty', () => {
    TestBed.configureTestingModule({
      providers: [PokeApiClient, provideHttpClient(), provideHttpClientTesting()]
    });

    const client = TestBed.inject(PokeApiClient);
    const transferState = TestBed.inject(TransferState);
    const httpMock = TestBed.inject(HttpTestingController);

    const stateKey = makeStateKey<Pokemon>('pokedex.pokemon.133');
    transferState.set(stateKey, null as unknown as Pokemon);

    client.getPokemon(133).subscribe((result) => {
      expect(result.name).toBe('eevee');
    });

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/133');
    req.flush({
      id: 133,
      name: 'eevee',
      base_experience: 0,
      height: 0,
      weight: 0,
      is_default: true,
      order: 133,
      abilities: [],
      forms: [],
      game_indices: [],
      held_items: [],
      location_area_encounters: '',
      moves: [],
      species: { name: 'eevee', url: '' },
      sprites: { front_default: null, front_shiny: null, back_default: null, back_shiny: null },
      stats: [],
      types: []
    });

    httpMock.verify();
  });

  it('stores transfer state on the server', () => {
    TestBed.configureTestingModule({
      providers: [
        PokeApiClient,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    });

    const client = TestBed.inject(PokeApiClient);
    const transferState = TestBed.inject(TransferState);
    const httpMock = TestBed.inject(HttpTestingController);

    client.getPokemon(7).subscribe((result) => {
      expect(result.id).toBe(7);
    });

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/7');
    req.flush({
      id: 7,
      name: 'squirtle',
      base_experience: 0,
      height: 0,
      weight: 0,
      is_default: true,
      order: 7,
      abilities: [],
      forms: [],
      game_indices: [],
      held_items: [],
      location_area_encounters: '',
      moves: [],
      species: { name: 'squirtle', url: '' },
      sprites: { front_default: null, front_shiny: null, back_default: null, back_shiny: null },
      stats: [],
      types: []
    });

    expect(transferState.hasKey(makeStateKey<Pokemon>('pokedex.pokemon.7'))).toBe(true);
    httpMock.verify();
  });
});
