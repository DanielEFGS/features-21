/**
 * Read-only code samples used by the httpResource demo tabs.
 */
export const HTTPRESOURCE_DEMO_CODE = {
  html: `<section class="demo">
  <header class="demo-header">
    <div>
      <p class="eyebrow">httpResource</p>
      <h3>Pokemon lookup</h3>
      <p class="subtitle">Fetch a Pokemon by name and watch the resource state update.</p>
    </div>
  </header>

  <div class="search-row">
    <label class="field-label" for="pokemon-name">Pokemon name</label>
    <div class="input-row">
      <input
        #nameInput
        id="pokemon-name"
        type="text"
        [value]="pendingQuery()"
        (input)="updatePending(nameInput.value)"
        autocomplete="off"
      />
      <button type="button" (click)="applyQuery()" [disabled]="isLoading() || isEmptyQuery()">
        Load
      </button>
    </div>
  </div>

  @if (status() === 'loading') {
    <p class="status">Loading...</p>
  } @else if (status() === 'error') {
    <p class="status status--error">{{ errorMessage() }}</p>
  } @else if (pokemon()) {
    <article class="pokemon-card">
      <div class="pokemon-header">
        <h4>{{ pokemon()!.name }}</h4>
        <span class="pokemon-id">#{{ pokemon()!.id }}</span>
      </div>
      <ul class="type-list">
        @for (type of pokemon()!.types; track type) {
          <li>{{ type }}</li>
        }
      </ul>
    </article>
  } @else {
    <p class="status">Search for a Pokemon to begin.</p>
  }
</section>
`,
  ts: `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
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
    url: \`https://pokeapi.co/api/v2/pokemon/\${this.query().trim().toLowerCase()}\`,
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
    this.pokemonResource.error() ? 'Unable to load the Pokemon. Try another name.' : ''
  );
  readonly isLoading = computed(() => this.status() === 'loading');
  readonly isEmptyQuery = computed(() => this.pendingQuery().trim().length === 0);

  updatePending(value: string): void {
    this.pendingQuery.set(value);
  }

  applyQuery(): void {
    const next = this.pendingQuery().trim().toLowerCase();
    if (!next) return;
    this.query.set(next);
    this.pokemonResource.reload();
  }
}
`,
  css: `.demo {
  display: grid;
  gap: 1rem;
}

.demo-header h3 {
  margin: 0.3rem 0 0;
  font-size: 1rem;
  font-weight: 700;
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.65rem;
  color: var(--ink-600);
}

.subtitle {
  margin: 0.35rem 0 0;
  font-size: 0.85rem;
  color: var(--ink-600);
}

.search-row {
  display: grid;
  gap: 0.4rem;
}

.field-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.input-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.input-row input {
  flex: 1;
  min-width: 160px;
  border: 2px solid var(--ink-900);
  padding: 0.4rem 0.6rem;
  font-size: 0.85rem;
}

.input-row button {
  border: 2px solid var(--ink-900);
  background: #fff;
  padding: 0.35rem 0.75rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 2px 2px 0 var(--ink-900);
}

.input-row button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.status {
  margin: 0;
  font-weight: 600;
}

.status--error {
  color: #b42318;
}

.pokemon-card {
  border: 2px solid var(--ink-900);
  background: var(--paper-2);
  padding: 0.75rem;
  display: grid;
  gap: 0.6rem;
}

.pokemon-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
}

.pokemon-header h4 {
  margin: 0;
  font-size: 0.95rem;
  text-transform: capitalize;
}

.pokemon-id {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--ink-600);
}

.type-list {
  margin: 0;
  padding-left: 1rem;
  list-style: square;
  display: grid;
  gap: 0.3rem;
}
`
};
