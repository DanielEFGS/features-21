import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Location } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';

import { PokeApiClient } from '../../../data/poke-api/poke-api.client';
import { Pokemon } from '../../../data/poke-api/poke-api.models';
import { TextureLayerDirective } from '../../../shared/texture-layer/texture-layer.directive';

type DetailStatus = 'loading' | 'success' | 'error';

interface DetailState {
  status: DetailStatus;
  pokemon: Pokemon | null;
  error: string | null;
}

@Component({
  selector: 'app-pokedex-detail-page',
  imports: [TextureLayerDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pokedex-detail-page.html',
  styleUrl: './pokedex-detail-page.css'
})
export class PokedexDetailPage {
  private static readonly STAT_MAX = 255;
  private readonly client = inject(PokeApiClient);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly nameOrId$ = this.route.paramMap.pipe(
    map((params) => params.get('nameOrId'))
  );

  private readonly initialState: DetailState = {
    status: 'loading',
    pokemon: null,
    error: null
  };

  protected readonly detailState = toSignal(
    this.nameOrId$.pipe(
      switchMap((nameOrId) => {
        if (!nameOrId) {
          return of<DetailState>({
            status: 'error',
            pokemon: null,
            error: 'Invalid parameter.'
          });
        }

        return this.client.getPokemon(nameOrId).pipe(
          map(
            (pokemon): DetailState => ({
              status: 'success',
              pokemon,
              error: null
            })
          ),
          startWith(this.initialState),
          catchError(() =>
            of<DetailState>({
              status: 'error',
              pokemon: null,
              error: 'Unable to load the detail.'
            })
          )
        );
      })
    ),
    { initialValue: this.initialState }
  );

  /* istanbul ignore next */
  protected readonly imageUrl = computed(() => {
    const pokemon = this.detailState().pokemon;
    return pokemon?.artworkUrl ?? pokemon?.spriteUrl ?? null;
  });

  /* istanbul ignore next */
  protected readonly statRows = computed(() => {
    const pokemon = this.detailState().pokemon;
    if (!pokemon) {
      return [];
    }

    return pokemon.stats.map((stat) => ({
      name: stat.name,
      label: this.formatStatLabel(stat.name),
      value: stat.value,
      percent: Math.min(
        100,
        Math.round((stat.value / PokedexDetailPage.STAT_MAX) * 100)
      )
    }));
  });

  /* istanbul ignore next */
  protected readonly spriteGallery = computed(() => {
    return this.detailState().pokemon?.sprites ?? [];
  });

  /* istanbul ignore next */
  protected readonly totalStats = computed(() => {
    const pokemon = this.detailState().pokemon;
    if (!pokemon) {
      return 0;
    }

    return pokemon.stats.reduce((total, stat) => total + stat.value, 0);
  });

  /* istanbul ignore next */
  protected readonly statsExpanded = signal(true);
  /* istanbul ignore next */
  protected readonly abilitiesExpanded = signal(true);
  /* istanbul ignore next */
  protected readonly spritesExpanded = signal(true);

  /**
   * Toggles the base stats disclosure panel.
   */
  protected toggleStatsExpanded() {
    this.statsExpanded.update((value) => !value);
  }

  /**
   * Toggles the abilities disclosure panel.
   */
  protected toggleAbilitiesExpanded() {
    this.abilitiesExpanded.update((value) => !value);
  }

  /**
   * Toggles the sprites disclosure panel.
   */
  protected toggleSpritesExpanded() {
    this.spritesExpanded.update((value) => !value);
  }

  /**
   * Formats the stat labels for display.
   *
   * @param name - Raw stat name from the API.
   * @returns Human-friendly stat label.
   */
  protected formatStatLabel(name: string): string {
    switch (name) {
      case 'hp':
        return 'HP';
      case 'attack':
        return 'ATK';
      case 'defense':
        return 'DEF';
      case 'special-attack':
        return 'SP. ATK';
      case 'special-defense':
        return 'SP. DEF';
      case 'speed':
        return 'SPD';
      default:
        return name.toUpperCase();
    }
  }

  /**
   * Converts height from decimeters to meters.
   *
   * @param value - Height in decimeters.
   * @returns Height in meters.
   */
  protected formatHeight(value: number): string {
    return `${(value / 10).toFixed(1)} m`;
  }

  /**
   * Converts weight from hectograms to kilograms.
   *
   * @param value - Weight in hectograms.
   * @returns Weight in kilograms.
   */
  protected formatWeight(value: number): string {
    return `${(value / 10).toFixed(1)} kg`;
  }

  /**
   * Navigates back when history is available, otherwise returns to the list.
   */
  protected goBack() {
    if (isPlatformBrowser(this.platformId) && window.history.length > 1) {
      this.location.back();
      return;
    }

    this.router.navigate(['/pokedex']);
  }
}
