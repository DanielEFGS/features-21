import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';

type PokemonDto = {
  id: number;
  name: string;
  types: Array<{ type: { name: string } }>;
};

type PokemonView = {
  id: number;
  name: string;
  types: string[];
};

/**
 * Checks if the payload matches the expected Pokemon DTO shape.
 * @param payload Raw payload value.
 * @returns True when the payload matches the expected shape.
 */
const isPokemonDto = (payload: unknown): payload is PokemonDto => {
  if (!payload || typeof payload !== 'object') return false;
  const dto = payload as { id?: unknown; name?: unknown; types?: unknown };
  if (typeof dto.id !== 'number' || typeof dto.name !== 'string' || !Array.isArray(dto.types)) {
    return false;
  }

  return dto.types.every((entry) => {
    if (!entry || typeof entry !== 'object') return false;
    const entryValue = entry as { type?: unknown };
    if (!entryValue.type || typeof entryValue.type !== 'object') return false;
    const typeValue = entryValue.type as { name?: unknown };
    return typeof typeValue.name === 'string';
  });
};

/**
 * Read-only demo used in the httpResource lab.
 */
@Component({
  selector: 'app-httpresource-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './httpresource-demo.html',
  styleUrl: './httpresource-demo.css'
})
export class HttpResourceDemoComponent {
  readonly pendingQuery = signal('pikachu');
  readonly query = signal('pikachu');

  readonly requestConfig = computed(() => ({
    url: `https://pokeapi.co/api/v2/pokemon/${this.query().trim().toLowerCase()}`,
    method: 'GET' as const
  }));

  readonly pokemonResource = httpResource<PokemonView>(() => this.requestConfig(), {
    parse: (payload) => {
      if (!isPokemonDto(payload)) {
        throw new Error('Invalid response shape.');
      }
      return {
        id: payload.id,
        name: payload.name,
        types: payload.types.map((entry) => entry.type.name)
      };
    }
  });

  readonly status = computed(() => this.pokemonResource.status());
  readonly pokemon = computed(() => this.pokemonResource.value() ?? null);
  readonly errorMessage = computed(() =>
    this.pokemonResource.error()
      ? $localize`:@@httpDemoError:Unable to load the Pokemon. Try another name.`
      : ''
  );
  readonly isLoading = computed(() => this.status() === 'loading');
  readonly isEmptyQuery = computed(() => this.pendingQuery().trim().length === 0);

  /**
   * Updates the pending query input.
   * @param value Input value.
   */
  updatePending(value: string): void {
    this.pendingQuery.set(value);
  }

  /**
   * Applies the pending query and reloads the resource.
   */
  applyQuery(): void {
    const next = this.pendingQuery().trim().toLowerCase();
    if (!next) return;
    this.query.set(next);
    this.pokemonResource.reload();
  }
}
