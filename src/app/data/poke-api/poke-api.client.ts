import { Injectable, TransferState, inject, makeStateKey } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Observable, finalize, map, of, shareReplay, tap } from 'rxjs';

import {
  PokemonDto,
  PokemonListResponseDto,
  TypeDetailResponseDto,
  TypeListResponseDto
} from './poke-api.dto';
import { Pokemon, PokemonList, TypeListItem } from './poke-api.models';
import { mapPokemon, mapPokemonList, mapTypeDetail, mapTypeList } from './poke-api.mappers';
import { InMemoryCache } from '../caching/in-memory-cache';

const BASE_URL = 'https://pokeapi.co/api/v2';
const ONE_HOUR_MS = 60 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const FIFTEEN_MIN_MS = 15 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class PokeApiClient {
  private readonly http = inject(HttpClient);
  private readonly transferState = inject(TransferState);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly pokemonCache = new InMemoryCache<Pokemon>(ONE_HOUR_MS);
  private readonly typesCache = new InMemoryCache<TypeListItem[]>(ONE_DAY_MS);
  private readonly typeListCache = new InMemoryCache<PokemonList>(FIFTEEN_MIN_MS);
  private readonly pokemonInFlight = new Map<string, Observable<Pokemon>>();
  private readonly typeInFlight = new Map<string, Observable<PokemonList>>();
  private typesInFlight?: Observable<TypeListItem[]>;

  /**
   * Fetches a paginated list of Pokemon with limit/offset.
   *
   * @param limit - Number of items to request.
   * @param offset - Offset for pagination.
   * @returns Observable of a paginated Pokemon list.
   */
  getPokemonList(limit: number, offset: number): Observable<PokemonList> {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset);

    return this.http
      .get<PokemonListResponseDto>(`${BASE_URL}/pokemon`, { params })
      .pipe(map((response) => mapPokemonList(response)));
  }

  /**
   * Fetches a single Pokemon by name or id with cache + dedupe.
   *
   * @param nameOrId - Pokemon name or numeric id.
   * @returns Observable of Pokemon detail.
   */
  getPokemon(nameOrId: string | number): Observable<Pokemon> {
    const key = String(nameOrId).toLowerCase();
    const cached = this.pokemonCache.get(key);
    if (cached) {
      return of(cached);
    }

    const stateKey = this.getPokemonStateKey(key);
    if (this.isBrowser() && this.transferState.hasKey(stateKey)) {
      const transferValue = this.transferState.get(stateKey, null as Pokemon | null);
      if (transferValue) {
        this.transferState.remove(stateKey);
        this.pokemonCache.set(key, transferValue);
        return of(transferValue);
      }
    }

    const inFlight = this.pokemonInFlight.get(key);
    if (inFlight) {
      return inFlight;
    }

    const request$ = this.http
      .get<PokemonDto>(`${BASE_URL}/pokemon/${nameOrId}`)
      .pipe(
        map((response) => mapPokemon(response)),
        tap((pokemon) => {
          this.pokemonCache.set(key, pokemon);
          if (this.isServer()) {
            this.transferState.set(stateKey, pokemon);
          }
        }),
        shareReplay({ bufferSize: 1, refCount: false }),
        finalize(() => this.pokemonInFlight.delete(key))
      );

    this.pokemonInFlight.set(key, request$);
    return request$;
  }

  /**
   * Fetches the list of types with cache + dedupe.
   *
   * @returns Observable of Pokemon types.
   */
  getTypes(): Observable<TypeListItem[]> {
    const cached = this.typesCache.get('types');
    if (cached) {
      return of(cached);
    }

    if (this.typesInFlight) {
      return this.typesInFlight;
    }

    const request$ = this.http.get<TypeListResponseDto>(`${BASE_URL}/type`).pipe(
      map((response) => mapTypeList(response)),
      tap((types) => this.typesCache.set('types', types)),
      shareReplay({ bufferSize: 1, refCount: false }),
      finalize(() => {
        this.typesInFlight = undefined;
      })
    );

    this.typesInFlight = request$;
    return request$;
  }

  /**
   * Fetches Pokemon list for a type with cache + dedupe.
   *
   * @param typeName - Type name (e.g. "grass").
   * @returns Observable of Pokemon list for the type.
   */
  getPokemonByType(typeName: string): Observable<PokemonList> {
    const key = typeName.toLowerCase();
    const cached = this.typeListCache.get(key);
    if (cached) {
      return of(cached);
    }

    const inFlight = this.typeInFlight.get(key);
    if (inFlight) {
      return inFlight;
    }

    const request$ = this.http.get<TypeDetailResponseDto>(`${BASE_URL}/type/${key}`).pipe(
      map((response) => {
        const items = mapTypeDetail(response);
        return { items, total: items.length };
      }),
      tap((list) => this.typeListCache.set(key, list)),
      shareReplay({ bufferSize: 1, refCount: false }),
      finalize(() => this.typeInFlight.delete(key))
    );

    this.typeInFlight.set(key, request$);
    return request$;
  }

  /**
   * Builds the transfer state key for a Pokemon detail payload.
   *
   * @param key - Normalized Pokemon name or id.
   * @returns TransferState key for Pokemon detail.
   */
  private getPokemonStateKey(key: string) {
    return makeStateKey<Pokemon>(`pokedex.pokemon.${key}`);
  }

  /**
   * Returns true when running in the browser.
   *
   * @returns True on the browser platform.
   */
  private isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Returns true when running on the server.
   *
   * @returns True on the server platform.
   */
  private isServer() {
    return isPlatformServer(this.platformId);
  }
}
