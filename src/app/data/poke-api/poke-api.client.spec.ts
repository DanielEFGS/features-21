import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PokeApiClient } from './poke-api.client';

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
});
