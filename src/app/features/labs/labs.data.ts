import { LabCatalogItem, LabContent } from './labs.models';

/** Catalog cards shown on the labs index page. */
export const LAB_CATALOG: LabCatalogItem[] = [
  {
    id: 'signals',
    title: 'Signals',
    status: 'done',
    level: 'Beginner',
    duration: '30-40 min',
    summary: 'Model local state with signals, derive values with computed, and use effects for side effects.'
  },
  {
    id: 'httpresource',
    title: 'httpResource',
    status: 'done',
    level: 'Intermediate',
    duration: '35-45 min',
    summary: 'Reactive data fetching with resources, loading states, and abortable requests.'
  },
  {
    id: 'rxjs-interop',
    title: 'RxJS Interop',
    status: 'done',
    level: 'Intermediate',
    duration: '30-40 min',
    summary: 'Bridge signals with observables using toSignal and toObservable.'
  },
  {
    id: 'routing',
    title: 'Routing',
    status: 'done',
    level: 'Intermediate',
    duration: '40-50 min',
    summary: 'Lazy routes, route data, and guards with modern routing patterns.'
  },
  {
    id: 'di',
    title: 'DI',
    status: 'done',
    level: 'Intermediate',
    duration: '30-40 min',
    summary: 'Inject services with inject(), tokens, and route-level providers.'
  },
  {
    id: 'forms',
    title: 'Forms',
    status: 'done',
    level: 'Intermediate',
    duration: '40-50 min',
    summary: 'Signal Forms with model-driven validation, field state, and schema rules.'
  },
  {
    id: 'animations',
    title: 'Animations',
    status: 'done',
    level: 'Beginner',
    duration: '25-35 min',
    summary: 'Enter/leave animations, reusable CSS motion, and route transitions.'
  },
  {
    id: 'style-guide',
    title: 'Style Guide',
    status: 'done',
    level: 'Beginner',
    duration: '20-30 min',
    summary: 'Apply naming, structure, and lint rules consistently across features.'
  },
  {
    id: 'tailwind',
    title: 'Tailwind',
    status: 'done',
    level: 'Beginner',
    duration: '30-40 min',
    summary: 'Build clean UI with utility-first patterns and reuse shared primitives.'
  },
  {
    id: 'a11y-aria',
    title: 'A11y & Aria',
    status: 'done',
    level: 'Intermediate',
    duration: '30-40 min',
    summary: 'Use Angular Aria and CDK focus helpers to keep UI accessible.'
  },
  {
    id: 'pwa',
    title: 'PWA',
    extra: true,
    status: 'done',
    level: 'Intermediate',
    duration: '30-40 min',
    summary: 'App shell caching, install flows, and update prompts (no API caching).'
  },
  {
    id: 'testing',
    title: 'Testing',
    extra: true,
    status: 'done',
    level: 'Intermediate',
    duration: '30-40 min',
    summary: 'Unit patterns with Vitest: SSR-safe specs, HTTP mocks, router harness.'
  },
  {
    id: 'performance',
    title: 'Performance',
    extra: true,
    status: 'done',
    level: 'Advanced',
    duration: '35-45 min',
    summary: 'Budgets, defer/lazy strategies, and asset/network guardrails.'
  },
  {
    id: 'custom-build',
    title: 'Custom build',
    extra: true,
    status: 'done',
    level: 'Advanced',
    duration: '35-45 min',
    summary: 'Design a custom build pipeline with cache strategy and SSR checks.'
  },
  {
    id: 'cdk',
    title: 'CDK',
    extra: true,
    status: 'done',
    level: 'Intermediate',
    duration: '30-40 min',
    summary: 'CDK overlays, focus tools, and portals for reusable primitives.'
  }
];

/** Lab content map keyed by route id. */
export const LAB_CONTENT: Record<string, LabContent> = {
  signals: {
    id: 'signals',
    title: 'Signals',
    tagline: 'Build a quick compare panel powered by signals.',
    status: 'done',
    level: 'Beginner',
    duration: '30-40 min',
    summary:
      'Signals are the native reactive state primitive in Angular. You will model selection state, derive values with computed, and use effects only for side effects.',
    outcomes: [
      'Model local state with signals.',
      'Use computed to derive values without template logic.',
      'Use effect for non-reactive side effects only.',
      'Update signals immutably with set and update.',
      'Recognize when derived state belongs in computed.'
    ],
    prerequisites: [
      'Standalone components and OnPush change detection.',
      'Modern control flow (@if, @for).',
      'Basic Pokedex layout and navigation.',
      'Use NgOptimizedImage for static images.'
    ],
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        summary: 'Signals give you synchronous state with automatic dependency tracking.',
        paragraphs: [
          'A signal holds a value. A computed derives new values from signals. An effect reacts to changes to run side effects.',
          'The goal is to move state and derivations out of templates so that UI stays simple and predictable.'
        ]
      },
      {
        id: 'core-apis',
        title: 'Core APIs',
        summary: 'signal, computed, and effect cover most local state needs.',
        bullets: [
          'signal(value): creates a stateful value you can read and write.',
          'computed(fn): derives a value when any dependency changes.',
          'effect(fn): runs side effects when dependencies change.'
        ],
        callouts: [
          {
            tone: 'tip',
            title: 'Use effect sparingly',
            text: 'Effects are for non-reactive APIs like storage, analytics, or DOM writes. Do not use them to compute state.'
          }
        ]
      },
      {
        id: 'derived-state',
        title: 'Derived state',
        summary: 'Compute labels, filters, and limits with computed.',
        paragraphs: [
          'Derived state keeps your template clean and makes logic easier to test.',
          'Avoid inline filtering, sorting, or conditionals in the template.'
        ],
        code: [
          {
            title: 'Computed selection summary',
            language: 'ts',
            snippet:
              "readonly selectedCount = computed(() => this.selectedNames().length);\n\nreadonly summaryText = computed(() => {\n  const count = this.selectedCount();\n  return `Selected: ${count}/3`;\n});"
          }
        ]
      },
      {
        id: 'effects',
        title: 'Effects and side effects',
        summary: 'Persist selection to storage in a safe, client-only effect.',
        paragraphs: [
          'Effects run whenever a dependency changes. Guard access to browser APIs to keep SSR safe.',
          'If you can derive the value, use computed instead of effect.'
        ],
        code: [
          {
            title: 'Persist selection in sessionStorage',
            language: 'ts',
            snippet:
              "readonly persistSelection = effect(() => {\n  const value = this.selectedNames();\n  if (typeof sessionStorage === 'undefined') return;\n  sessionStorage.setItem('lab-signals-selection', JSON.stringify(value));\n});"
          }
        ]
      },
      {
        id: 'linked-signal',
        title: 'Dependent state with linkedSignal',
        summary: 'Use linkedSignal when state depends on another signal value.',
        paragraphs: [
          'linkedSignal lets you derive a signal value that can still be updated locally.',
          'Use it when you want a default that changes with inputs but still allows user interaction.'
        ],
        callouts: [
          {
            tone: 'note',
            title: 'Optional for this lab',
            text: 'linkedSignal is a great follow-up after you master signal, computed, and effect.'
          }
        ]
      }
    ],
    exercise: {
      title: 'Exercise: Quick compare panel',
      goal: 'Create a compact comparison panel that lets users select up to three Pokemon.',
      tasks: [
        'Create a signal list of available Pokemon (mock data is fine).',
        'Create a signal list of selected names.',
        'Derive summary text and limit state with computed.',
        'Disable the Add button when the limit is reached.',
        'Persist selection to sessionStorage with an effect guarded for SSR.'
      ],
      success: [
        'The summary updates immediately on selection.',
        'The Add button locks at three items.',
        'Removing an item unlocks the Add button.',
        'No template filtering logic is needed.'
      ],
      stretch: [
        'Add a clear all action with update.',
        'Show a short status message when the limit is reached.'
      ]
    },
    references: [
      { label: 'Signals guide', url: 'https://angular.dev/guide/signals' },
      { label: 'Computed', url: 'https://angular.dev/guide/signals#computed-signals' },
      { label: 'Effects', url: 'https://angular.dev/guide/signals/effect' },
      { label: 'linkedSignal', url: 'https://angular.dev/guide/signals/linked-signal' }
    ]
  },
  httpresource: {
    id: 'httpresource',
    title: 'httpResource',
    tagline: 'Build a reactive Pokemon lookup with resource state.',
    status: 'done',
    level: 'Intermediate',
    duration: '35-45 min',
    summary:
      'Use httpResource to fetch data reactively, model loading and error states, and parse responses into UI-friendly shapes.',
    outcomes: [
      'Create a request config with computed.',
      'Fetch data with httpResource and parse it.',
      'Render loading, error, empty, and success states.',
      'Trigger reloads in a controlled way.'
    ],
    prerequisites: [
      'HttpClient basics and providers.',
      'Signals and computed.',
      'Modern control flow (@if, @for).'
    ],
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        summary: 'httpResource wraps HttpClient with reactive state and status tracking.',
        paragraphs: [
          'A resource exposes value, status, and error signals that are easy to bind in templates.',
          'When input signals change, the request re-runs automatically.'
        ]
      },
      {
        id: 'core-apis',
        title: 'Core APIs',
        summary: 'Use resource.value, resource.status, and resource.error to drive UI state.',
        bullets: [
          'httpResource(() => config): creates a reactive request.',
          'resource.value(): current payload (undefined while loading).',
          'resource.status(): idle, loading, error, or success.',
          'resource.reload(): force a refetch.'
        ]
      },
      {
        id: 'optimization',
        title: 'Optimization strategies',
        summary: 'Control how often inputs change to avoid unnecessary requests.',
        bullets: [
          'Use a pending input signal and apply it on button click or Enter.',
          'Debounce input with RxJS and toSignal when typing should auto-search.',
          'Disable the Load button while loading to avoid queueing.'
        ],
        code: [
          {
            title: 'Apply pending input',
            language: 'ts',
            snippet:
              "readonly pendingQuery = signal('pikachu');\nreadonly query = signal('pikachu');\n\napplyQuery(): void {\n  const next = this.pendingQuery().trim().toLowerCase();\n  if (!next) return;\n  this.query.set(next);\n  this.pokemonResource.reload();\n}"
          },
          {
            title: 'Debounce typing with RxJS',
            language: 'ts',
            snippet:
              "const input$ = new Subject<string>();\nreadonly query = toSignal(input$.pipe(debounceTime(400)), { initialValue: 'pikachu' });"
          },
          {
            title: 'Disable while loading',
            language: 'html',
            snippet:
              "<button type=\"button\" (click)=\"applyQuery()\" [disabled]=\"status() === 'loading'\">\n  Load\n</button>"
          }
        ]
      },
      {
        id: 'parsing',
        title: 'Parsing and view models',
        summary: 'Parse payloads into the shape your UI needs.',
        paragraphs: [
          'Use parse to map DTOs into view models.',
          'Keep parsing next to the resource to reduce template logic.'
        ],
        code: [
          {
            title: 'Parse a Pokemon payload',
            language: 'ts',
            snippet:
              "readonly pokemonResource = httpResource<PokemonView>(() => this.requestConfig(), {\n  parse: (payload) => ({\n    id: (payload as PokemonDto).id,\n    name: (payload as PokemonDto).name,\n    types: (payload as PokemonDto).types.map((entry) => entry.type.name)\n  })\n});"
          }
        ]
      },
      {
        id: 'ui-states',
        title: 'UI states',
        summary: 'Keep user feedback clear for loading, error, and empty states.',
        paragraphs: [
          'Derive status with computed and render it directly in the template.',
          'Use a neutral empty state before the first request.'
        ]
      }
    ],
    exercise: {
      title: 'Exercise: Pokemon lookup',
      goal: 'Fetch a Pokemon by name and render its types.',
      tasks: [
        'Create a query signal and computed request config.',
        'Use httpResource with parse to build a view model.',
        'Add loading, error, empty, and success states.',
        'Add a Load button that triggers reload.'
      ],
      success: [
        'Changing the query fetches a new Pokemon.',
        'Errors show a clear message.',
        'The UI stays stable during loading.'
      ],
      stretch: [
        'Add a clear action that resets the view.',
        'Display the last successful result on error.'
      ]
    },
    references: [
      { label: 'httpResource guide', url: 'https://angular.dev/guide/http/http-resource' },
      { label: 'HttpClient', url: 'https://angular.dev/guide/http' }
    ]
  },
  'rxjs-interop': {
    id: 'rxjs-interop',
    title: 'RxJS Interop',
    tagline: 'Bridge RxJS streams and signals for UI-friendly state.',
    status: 'done',
    level: 'Intermediate',
    duration: '30-40 min',
    summary:
      'Use RxJS interop helpers to move between Observables and signals, bridge outputs, and unsubscribe safely.',
    outcomes: [
      'Create signals from Observables with toSignal.',
      'Convert signals to Observables with toObservable.',
      'Use output interop for Observable-backed outputs.',
      'Avoid memory leaks with takeUntilDestroyed.'
    ],
    prerequisites: [
      'Signals and computed basics.',
      'RxJS fundamentals (Observable, Subject, pipe).',
      'Component outputs and event handling.'
    ],
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        summary: 'RxJS interop keeps streams and signals in sync without manual subscriptions.',
        paragraphs: [
          'Use interop helpers when you need RxJS for timing or cancellation, but want signals for template state.',
          'The core tools are toSignal, toObservable, output interop helpers, and takeUntilDestroyed.'
        ]
      },
      {
        id: 'to-signal',
        title: 'Create a signal with toSignal',
        summary: 'Convert an Observable into a signal with a predictable initial value.',
        bullets: [
          'Provide initialValue so the template renders a stable value.',
          'Use requireSync only when the Observable emits synchronously.',
          'Create toSignal inside an injection context (component or service).'
        ],
        code: [
          {
            title: 'Debounced input to signal',
            language: 'ts',
            snippet:
              "private readonly input$ = new Subject<string>();\n\nreadonly query = toSignal(\n  this.input$.pipe(debounceTime(300), distinctUntilChanged()),\n  { initialValue: '' }\n);"
          }
        ],
        callouts: [
          {
            tone: 'tip',
            title: 'Prefer signals for UI',
            text: 'Use toSignal to keep template bindings synchronous and predictable.'
          }
        ]
      },
      {
        id: 'to-observable',
        title: 'Create an Observable with toObservable',
        summary: 'Expose a signal as an Observable for RxJS composition.',
        paragraphs: [
          'toObservable keeps RxJS pipelines compatible with signal state.',
          'Use it to build operators like map, filter, or debounce before rendering.'
        ],
        code: [
          {
            title: 'Normalize a query stream',
            language: 'ts',
            snippet:
              "const normalized$ = toObservable(this.query).pipe(\n  map((value) => value.trim().toLowerCase())\n);"
          }
        ]
      },
      {
        id: 'output-interop',
        title: 'Output interop',
        summary: 'Bridge component outputs and RxJS Observables.',
        bullets: [
          'outputFromObservable turns an Observable into an OutputRef.',
          'outputToObservable converts an OutputRef into an Observable.',
          'Prefer output() when you emit imperatively without RxJS.'
        ],
        code: [
          {
            title: 'Observable-backed output',
            language: 'ts',
            snippet:
              "private readonly actions$ = new Subject<string>();\nreadonly action = outputFromObservable(this.actions$);\nreadonly action$ = outputToObservable(this.action);"
          }
        ]
      },
      {
        id: 'take-until-destroyed',
        title: 'Unsubscribe with takeUntilDestroyed',
        summary: 'Clean up subscriptions without manual Subjects.',
        paragraphs: [
          'takeUntilDestroyed completes the stream when the component is destroyed.',
          'Pass a DestroyRef when you are outside an injection context.'
        ],
        code: [
          {
            title: 'Auto-cleanup subscription',
            language: 'ts',
            snippet:
              "this.action$\n  .pipe(takeUntilDestroyed(this.destroyRef))\n  .subscribe(() => {\n    this.appliedCount.update((count) => count + 1);\n  });"
          }
        ]
      }
    ],
    exercise: {
      title: 'Exercise: Signal-backed search helper',
      goal: 'Build a debounced search helper that emits output events.',
      tasks: [
        'Create an input Subject and map it into a signal with toSignal.',
        'Expose the signal as an Observable with toObservable and normalize the value.',
        'Emit an output using outputFromObservable.',
        'Listen to the output with outputToObservable.',
        'Use takeUntilDestroyed for any manual subscription.'
      ],
      success: [
        'Typing updates the debounced query signal.',
        'The normalized Observable stays in sync with the signal.',
        'Output events appear in the log panel.',
        'No manual destroy Subject is needed.'
      ],
      stretch: [
        'Add a clear button that resets the input and query.',
        'Keep only the last five output events.'
      ]
    },
    references: [
      { label: 'RxJS interop', url: 'https://angular.dev/ecosystem/rxjs-interop' },
      { label: 'Output interop', url: 'https://angular.dev/ecosystem/rxjs-interop/output-interop' },
      {
        label: 'takeUntilDestroyed',
        url: 'https://angular.dev/ecosystem/rxjs-interop/take-until-destroyed'
      }
    ]
  },
  routing: {
    id: 'routing',
    title: 'Routing',
    tagline: 'Map URLs to standalone views with modern router helpers.',
    status: 'done',
    level: 'Intermediate',
    duration: '40-50 min',
    summary:
      'Focus on new routing guidance: testing navigation, rendering strategies, and router behavior customization.',
    outcomes: [
      'Define routes with standalone lazy loading.',
      'Read route state with reactive signals.',
      'Use guards and resolvers for access and data.',
      'Configure router behavior and scrolling.',
      'Understand CSR, SSR, and SSG trade-offs.'
    ],
    prerequisites: [
      'Standalone components and provideRouter.',
      'Signals and computed basics.',
      'Basic RxJS and route params.'
    ],
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        summary: 'Routing keeps SPA navigation fast and URL-driven.',
        paragraphs: [
          'Angular Router swaps views without full page reloads and keeps navigation state in the URL.',
          'It integrates with rendering strategies and supports guards, resolvers, and testing tools.'
        ]
      },
      {
        id: 'testing',
        title: 'Testing routing and navigation',
        summary: 'Use RouterTestingHarness for fast navigation tests.',
        bullets: [
          'RouterTestingHarness navigates without a full app shell.',
          'Provide routes directly in the test setup.',
          'Assert on the rendered element after navigation.'
        ],
        code: [
          {
            title: 'Navigate with RouterTestingHarness',
            language: 'ts',
            snippet:
              "await TestBed.configureTestingModule({\n  providers: [provideRouter(routes)]\n}).compileComponents();\n\nconst harness = await RouterTestingHarness.create();\nawait harness.navigateByUrl('/labs/pokedex');\nexpect(harness.routeNativeElement?.textContent).toContain('Pokedex');"
          }
        ]
      },
      {
        id: 'rendering',
        title: 'Rendering strategies',
        summary: 'Pick CSR, SSR, or SSG based on content and interactivity.',
        bullets: [
          'CSR is best for highly interactive areas with minimal SEO needs.',
          'SSR improves first paint and indexing for dynamic content.',
          'SSG is ideal for stable marketing or docs pages.'
        ],
        callouts: [
          {
            tone: 'note',
            title: 'Labs stay CSR',
            text: 'Labs are intentionally client-only to keep experimentation fast and isolated.'
          }
        ]
      },
      {
        id: 'custom-behavior',
        title: 'Customizing route behavior',
        summary: 'Enable helper features for inputs, scrolling, and view transitions.',
        bullets: [
          'withComponentInputBinding binds route params directly to inputs.',
          'withInMemoryScrolling enables anchor scrolling and scroll restoration.',
          'Add router feature helpers in provideRouter once at bootstrap.'
        ],
        code: [
          {
            title: 'Router feature helpers',
            language: 'ts',
            snippet:
              "provideRouter(\n  routes,\n  withComponentInputBinding(),\n  withInMemoryScrolling({ anchorScrolling: 'enabled' })\n);"
          }
        ]
      }
    ],
    exercise: {
      title: 'Exercise: Lab hub routing',
      goal: 'Route between /labs and /labs/:id with guard + resolver.',
      tasks: [
        'Define standalone routes for list and detail.',
        'Add RouterOutlet and routerLink navigation.',
        'Use a guard to block invalid ids.',
        'Use a resolver to preload lab metadata.',
        'Add in-memory scrolling for anchor links.'
      ],
      success: [
        'Navigating to /labs shows the list.',
        'Valid ids render detail content.',
        'Invalid ids redirect to /labs.',
        'Anchor links scroll correctly.'
      ],
      stretch: [
        'Add a not-found route for invalid paths.',
        'Expose params as inputs with withComponentInputBinding.'
      ]
    },
    references: [
      { label: 'Routing overview', url: 'https://angular.dev/guide/routing' },
      { label: 'Testing routing', url: 'https://angular.dev/guide/routing/testing' },
      { label: 'Rendering strategies', url: 'https://angular.dev/guide/routing/rendering-strategies' },
      { label: 'Router configuration', url: 'https://angular.dev/guide/routing/route-config' }
    ]
  },
  di: {
    id: 'di',
    title: 'Dependency Injection',
    tagline: 'Share logic with services and keep dependencies explicit.',
    status: 'done',
    level: 'Intermediate',
    duration: '30-40 min',
    summary:
      'Learn how DI wires services with inject(), scopes them with providers, and keeps state reusable.',
    outcomes: [
      'Create services with @Injectable.',
      'Inject dependencies with inject().',
      'Understand injection context boundaries.',
      'Scope services with component or route providers.',
      'Recognize when to rely on root providers.'
    ],
    prerequisites: [
      'Standalone components and signals.',
      'Basic TypeScript class usage.',
      'Familiarity with component lifecycle.'
    ],
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        summary: 'DI supplies shared services without manual instantiation.',
        paragraphs: [
          'Angular creates and caches services based on where they are provided.',
          'You request dependencies with inject() instead of new.'
        ]
      },
      {
        id: 'services',
        title: 'Creating and using services',
        summary: 'Services bundle reusable logic and state.',
        bullets: [
          'Use @Injectable to mark a class as DI-friendly.',
          "providedIn: 'root' registers a singleton provider.",
          'Services are tree-shakable when unused.'
        ],
        code: [
          {
            title: 'Service with root provider',
            language: 'ts',
            snippet:
              "import { Injectable, signal } from '@angular/core';\n\n@Injectable({ providedIn: 'root' })\nexport class LabNotesService {\n  readonly notes = signal<string[]>([]);\n}"
          }
        ]
      },
      {
        id: 'inject',
        title: 'Injecting dependencies with inject()',
        summary: 'Use inject() in field initializers or constructors.',
        paragraphs: [
          'inject() is the preferred API for standalone components and services.',
          'It works in class fields, constructors, and provider factories.'
        ],
        code: [
          {
            title: 'Inject in a component field',
            language: 'ts',
            snippet:
              "import { Component, inject } from '@angular/core';\n\n@Component({\n  selector: 'app-notes',\n  templateUrl: './notes.html',\n  styleUrl: './notes.css'\n})\nexport class NotesComponent {\n  private readonly notesService = inject(LabNotesService);\n}"
          }
        ]
      },
      {
        id: 'providers',
        title: 'Defining dependency providers',
        summary: 'Providers control lifetime and scope.',
        bullets: [
          'Root providers share a single instance app-wide.',
          'Component providers create isolated instances per subtree.',
          'Route providers scope services to a route branch.'
        ],
        code: [
          {
            title: 'Component-scoped provider',
            language: 'ts',
            snippet:
              "@Component({\n  selector: 'app-notes-host',\n  providers: [LabNotesService],\n  template: '<app-notes></app-notes>'\n})\nexport class NotesHostComponent {}"
          }
        ]
      },
      {
        id: 'injection-context',
        title: 'Injection context',
        summary: 'inject() only works in contexts owned by Angular.',
        bullets: [
          'Use inject() in constructors or field initializers.',
          'Pass DestroyRef when using takeUntilDestroyed outside components.',
          'Avoid calling inject() in event handlers or plain functions.'
        ]
      }
    ],
    exercise: {
      title: 'Exercise: Notes service',
      goal: 'Share notes between components using DI.',
      tasks: [
        "Create a service with @Injectable({ providedIn: 'root' }).",
        'Inject it into two components with inject().',
        'Add a component provider to isolate notes in one section.',
        'Render notes in a list with clear empty state.'
      ],
      success: [
        'The shared section sees notes added from either component.',
        'The isolated section shows its own notes only.',
        'The template stays simple and signal-driven.'
      ],
      stretch: [
        'Add a clear button in the service.',
        'Expose note count as a computed signal.'
      ]
    },
    references: [
      { label: 'DI overview', url: 'https://angular.dev/guide/di' },
      { label: 'Creating services', url: 'https://angular.dev/guide/di/creating-and-using-services' },
      { label: 'Dependency providers', url: 'https://angular.dev/guide/di/dependency-providers' }
    ]
  },
  forms: {
    id: 'forms',
    title: 'Signal Forms',
    tagline: 'Build a trainer contact form with model-driven validation.',
    status: 'done',
    level: 'Intermediate',
    duration: '40-50 min',
    summary:
      'Signal Forms are experimental and model-driven. Use a signal-backed model, FormField bindings, schema validation, and field state signals to guide the UI.',
    outcomes: [
      'Create a signal-based form model with a static shape.',
      'Build a FieldTree with form() and schema validation rules.',
      'Bind native inputs using the FormField directive.',
      'Show validation feedback with field state signals.',
      'Apply model design best practices and migration helpers.'
    ],
    prerequisites: [
      'Signals and computed basics.',
      'Standalone components and OnPush.',
      'Modern control flow (@if, @for).',
      'Comfort with native form elements.'
    ],
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        summary: 'Signal Forms derive form structure and state from a signal model.',
        paragraphs: [
          'You model the shape of your form with a writable signal, then create a FieldTree with form().',
          'Validation lives in a schema callback so rules stay centralized and type-safe.'
        ],
        callouts: [
          {
            tone: 'warn',
            title: 'Experimental API',
            text: 'Signal Forms are experimental as of v21. Use them in labs or controlled environments.'
          }
        ]
      },
      {
        id: 'model-tree',
        title: 'Form model and field tree',
        summary: 'The model defines field structure, type safety, and defaults.',
        bullets: [
          'Initialize every field with an empty value.',
          'Avoid optional properties or undefined values.',
          'Keep the model focused on a single form purpose.'
        ],
        code: [
          {
            title: 'Create the model and form',
            language: 'ts',
            snippet:
              "type TrainerContactModel = {\n  name: string;\n  email: string;\n  acceptTerms: boolean;\n};\n\nreadonly model = signal<TrainerContactModel>({\n  name: '',\n  email: '',\n  acceptTerms: false\n});\n\nreadonly trainerForm = form(this.model, (schema) => {\n  required(schema.name, { message: 'Name is required.' });\n  required(schema.email, { message: 'Email is required.' });\n  email(schema.email, { message: 'Enter a valid email.' });\n  required(schema.acceptTerms, { message: 'Accept the terms.' });\n});"
          }
        ]
      },
      {
        id: 'binding',
        title: 'Bind fields with FormField',
        summary: 'FormField keeps native inputs in sync with the FieldTree.',
        paragraphs: [
          'FormField handles two-way binding between the field state and the input value.',
          'You can bind inputs, textareas, radio groups, and select elements.'
        ],
        code: [
          {
            title: 'Bind inputs',
            language: 'html',
            snippet:
              "<label>\n  Name\n  <input type=\"text\" [formField]=\"trainerForm.name\" />\n</label>\n\n<label>\n  Email\n  <input type=\"email\" [formField]=\"trainerForm.email\" />\n</label>\n\n<label>\n  <input type=\"checkbox\" [formField]=\"trainerForm.acceptTerms\" />\n  I accept the terms\n</label>"
          }
        ]
      },
      {
        id: 'validation',
        title: 'Schema validation',
        summary: 'Validators live in a single schema callback.',
        bullets: [
          'Use required, email, minLength, maxLength, min, max, or pattern.',
          'Provide custom messages in the validator options.',
          'Keep validation logic out of templates and controls.'
        ],
        code: [
          {
            title: 'Validation rules',
            language: 'ts',
            snippet:
              "readonly trainerForm = form(this.model, (schema) => {\n  required(schema.email, { message: 'Email is required.' });\n  email(schema.email, { message: 'Enter a valid email.' });\n});"
          }
        ]
      },
      {
        id: 'field-state',
        title: 'Field state signals',
        summary: 'Use touched, dirty, and errors to render feedback.',
        paragraphs: [
          'Each field exposes state signals like touched(), dirty(), valid(), and errors().',
          'Combine them to show errors only after interaction.'
        ],
        code: [
          {
            title: 'Show errors after touch',
            language: 'html',
            snippet:
              "@if (trainerForm.email().touched() && trainerForm.email().invalid()) {\n  <ul class=\"field-errors\">\n    @for (error of trainerForm.email().errors(); track error) {\n      <li>{{ error.message }}</li>\n    }\n  </ul>\n}"
          }
        ]
      },
      {
        id: 'model-design',
        title: 'Model design best practices',
        summary: 'Avoid undefined and keep a stable shape.',
        bullets: [
          'Use empty values instead of undefined (\"\", 0, false, null).',
          'Keep form models focused on a single purpose.',
          'Prefer static shapes and hide or disable fields in the schema.'
        ],
        callouts: [
          {
            tone: 'tip',
            title: 'Empty values',
            text: 'Use null for complex values when the UI needs an explicit empty state.'
          }
        ]
      },
      {
        id: 'comparison',
        title: 'Comparison with other approaches',
        summary: 'Pick the form type based on your project needs.',
        bullets: [
          'Signal Forms: signal model, schema validation, experimental.',
          'Reactive Forms: FormControl/FormGroup, stable, flexible.',
          'Template-driven: directives in templates, minimal typing.'
        ]
      },
      {
        id: 'migration',
        title: 'Migration helpers',
        summary: 'Use compatForm to bridge Reactive Forms into Signal Forms.',
        bullets: [
          'Wrap FormControl or FormGroup instances inside a signal model.',
          'Use compatForm to build a FieldTree with legacy controls.'
        ],
        code: [
          {
            title: 'Top-down migration with compatForm',
            language: 'ts',
            snippet:
              "const passwordControl = new FormControl('', { validators: [Validators.required], nonNullable: true });\nconst userModel = signal({ email: '', password: passwordControl });\nconst formState = compatForm(userModel);"
          }
        ]
      }
    ],
    exercise: {
      title: 'Exercise: Trainer contact form',
      goal: 'Build a contact form with validation and field-state messaging.',
      tasks: [
        'Create a form model signal with name, email, and acceptTerms.',
        'Define schema validation with required and email validators.',
        'Bind inputs using FormField.',
        'Show field errors only after touch or submit attempt.',
        'Disable Save until the form is valid.'
      ],
      success: [
        'Inputs stay in sync with the model signal.',
        'Errors appear only after interaction.',
        'Save remains disabled until all fields pass validation.',
        'Reset returns the model to defaults.'
      ],
      stretch: [
        'Add a prefill action for demo data.',
        'Show a status line that reacts to validity.'
      ]
    },
    references: [
      { label: 'Signal Forms overview', url: 'https://angular.dev/guide/forms/signals/overview' },
      { label: 'Forms with signals', url: 'https://angular.dev/essentials/signal-forms' },
      { label: 'Form models', url: 'https://angular.dev/guide/forms/signals/models' },
      { label: 'Model design', url: 'https://angular.dev/guide/forms/signals/model-design' },
      { label: 'Validation', url: 'https://angular.dev/guide/forms/signals/validation' },
      { label: 'Field state management', url: 'https://angular.dev/guide/forms/signals/field-state-management' },
      { label: 'Comparison', url: 'https://angular.dev/guide/forms/signals/comparison' },
      { label: 'Migration', url: 'https://angular.dev/guide/forms/signals/migration' }
    ]
  },
  animations: {
    id: 'animations',
    title: 'Animations',
    tagline: 'Add clear, purposeful motion with animate.enter and animate.leave.',
    status: 'done',
    level: 'Beginner',
    duration: '25-35 min',
    summary:
      'Use the compiler-provided animate.enter/animate.leave APIs with CSS animations and transitions, then layer in optional route view transitions.',
    outcomes: [
      'Apply enter and leave animations to elements.',
      'Create reusable CSS animations with keyframes and transitions.',
      'Stagger list animations with delay.',
      'Understand how to enable view transitions for routes.',
      'Avoid common animation pitfalls in Angular.'
    ],
    prerequisites: [
      'Standalone components and OnPush.',
      'Modern control flow (@if, @for).',
      'Basic CSS transitions and keyframes.'
    ],
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        summary: 'Animation helpers built into Angular for enter/leave motion.',
        paragraphs: [
          'animate.enter and animate.leave apply CSS classes at the right time when elements appear or leave.',
          'These APIs are supported by the compiler and work with control flow and signal-driven state.'
        ],
        callouts: [
          {
            tone: 'note',
            title: 'Compiler APIs',
            text: 'animate.enter/animate.leave are not directives; they are compiler-supported bindings.'
          }
        ]
      },
      {
        id: 'enter-leave',
        title: 'Enter and leave animations',
        summary: 'Attach classes for entry and exit motion.',
        bullets: [
          'animate.enter adds classes when an element enters the DOM.',
          'animate.leave adds classes before the element is removed.',
          'Classes are removed after the longest animation completes.'
        ],
        code: [
          {
            title: 'Enter and leave bindings',
            language: 'html',
            snippet:
              "@if (isOpen()) {\n  <div class=\"toast\" animate.enter=\"toast-enter\" animate.leave=\"toast-leave\">\n    Saved.\n  </div>\n}"
          }
        ]
      },
      {
        id: 'css-animations',
        title: 'Reusable CSS animations',
        summary: 'Compose keyframes and transitions in shared styles.',
        bullets: [
          'Use @keyframes for reusable motion.',
          'Use transitions with @starting-style to provide a from-state.',
          'Keep durations short and consistent.'
        ],
        code: [
          {
            title: 'Keyframes and transitions',
            language: 'css',
            snippet:
              ".toast-enter { animation: toast-in 220ms ease-out; }\n.toast-leave { animation: toast-out 180ms ease-in; }\n\n@keyframes toast-in {\n  from { opacity: 0; transform: translateY(12px); }\n  to { opacity: 1; transform: translateY(0); }\n}"
          }
        ]
      },
      {
        id: 'lists',
        title: 'Staggered lists',
        summary: 'Use delay based on index for a cascading effect.',
        paragraphs: [
          'Staggering creates a readable, progressive reveal for list items.',
          'Use a CSS variable to scale delays by index.'
        ],
        code: [
          {
            title: 'Stagger delay',
            language: 'css',
            snippet:
              ".toast-item {\n  transition-delay: calc(40ms * var(--index));\n  @starting-style { opacity: 0; transform: translateY(8px); }\n}"
          }
        ]
      },
      {
        id: 'callbacks',
        title: 'Callbacks and third-party libraries',
        summary: 'Use animationComplete when handling leave with functions.',
        bullets: [
          'Use (animate.leave) to call a function during exit.',
          'Call animationComplete() to allow Angular to remove the element.',
          'Configure MAX_ANIMATION_TIMEOUT for fallback cleanup.'
        ]
      },
      {
        id: 'compatibility',
        title: 'Compatibility',
        summary: 'Avoid mixing legacy animations with the new APIs.',
        bullets: [
          'Do not use legacy @angular/animations alongside animate.enter/leave in the same component.',
          'Content projection across different animation types can also cause issues.'
        ]
      },
      {
        id: 'routes',
        title: 'Route transition animations',
        summary: 'Enable view transitions for route changes.',
        bullets: [
          'Enable with withViewTransitions() in provideRouter.',
          'Style ::view-transition-old/new in global CSS.',
          'Use onViewTransitionCreated to skip transitions on same-route updates.'
        ],
        callouts: [
          {
            tone: 'note',
            title: 'Developer preview',
            text: 'View transitions are in developer preview and only work in supported browsers.'
          }
        ]
      }
    ],
    exercise: {
      title: 'Exercise: Toast queue',
      goal: 'Build a toast list with entry, exit, and staggered motion.',
      tasks: [
        'Create a list of toast items controlled by a signal.',
        'Apply animate.enter and animate.leave classes.',
        'Stagger list items using a delay based on index.',
        'Add a clear all action that triggers leave animations.'
      ],
      success: [
        'New toasts slide and fade in.',
        'Removed toasts animate out before disappearing.',
        'List items stagger instead of popping in.',
        'Reduced motion users see minimal animation.'
      ],
      stretch: [
        'Add a route transition and customize it with view-transition CSS.',
        'Use animate.leave with a callback and animationComplete().'
      ]
    },
    references: [
      { label: 'Animations overview', url: 'https://angular.dev/guide/animations' },
      { label: 'Complex CSS animations', url: 'https://angular.dev/guide/animations/css' },
      { label: 'Route transitions', url: 'https://angular.dev/guide/routing/route-transition-animations' }
    ]
  },
  'style-guide': {
    id: 'style-guide',
    title: 'Style Guide',
    tagline: 'Make naming and structure predictable across the codebase.',
    status: 'done',
    level: 'Beginner',
    duration: '20-30 min',
    summary:
      'Apply consistent naming, file structure, and component APIs so teams can navigate features quickly and refactor safely.',
    outcomes: [
      'Use one project prefix (app-, f21-, etc.) and kebab-case for selectors.',
      'Name classes with PascalCase and a Component suffix.',
      'Colocate files by feature with shared names.',
      'Keep component APIs small and typed.'
    ],
    prerequisites: [
      'Standalone components and OnPush.',
      'Signals and computed basics.',
      'Modern control flow (@if, @for).'
    ],
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        summary: 'A style guide is a consistency contract.',
        paragraphs: [
          'Consistent naming and structure make code review and refactoring faster.',
          'Apply a small set of rules everywhere to reduce mental overhead.'
        ]
      },
      {
        id: 'naming',
        title: 'Naming conventions',
        summary: 'Selectors, classes, and files should be predictable.',
        bullets: [
          'Selector: pick one unique prefix (app-, f21-, etc.) and use it consistently with kebab-case.',
          'Class: PascalCase with Component suffix.',
          'Files: kebab-case with matching .ts/.html/.css/.spec.ts names.'
        ],
        callouts: [
          {
            tone: 'note',
            title: 'One prefix per project',
            text: 'Document a single, unique prefix for the codebase and keep every selector aligned to it.'
          }
        ],
        code: [
          {
            title: 'Naming example',
            language: 'text',
            snippet:
              'Selector: app-trainer-profile\nClass: TrainerProfileComponent\nFiles: trainer-profile.ts/.html/.css/.spec.ts'
          }
        ]
      },
      {
        id: 'structure',
        title: 'Feature-first structure',
        summary: 'Group by feature, not by file type.',
        bullets: [
          'Keep all files for a component together.',
          'Store shared UI in shared/ and feature-specific UI in features/<feature>/.',
          'Avoid deep nesting that hides files from navigation.'
        ]
      },
      {
        id: 'apis',
        title: 'Component API design',
        summary: 'Typed inputs and outputs keep components reusable.',
        bullets: [
          'Use input() and output() with explicit types.',
          'Move derivations into computed signals.',
          'Avoid heavy logic inside templates.'
        ]
      },
      {
        id: 'linting',
        title: 'Lint + format',
        summary: 'Automate consistency with tooling.',
        bullets: [
          'Formatting keeps diffs small and readable.',
          'Lint enforces naming and catches unused code.',
          'Tests confirm behavior stays stable.'
        ]
      }
    ],
    exercise: {
      title: 'Exercise: Trainer profile feature',
      goal: 'Create a small feature that follows naming and structure rules.',
      tasks: [
        'Create a trainer-profile folder under features.',
        'Add trainer-profile.ts/.html/.css/.spec.ts with matching names.',
        'Expose a typed input() and output() pair.',
        'Move view logic into computed signals.'
      ],
      success: [
        'Names follow the app- prefix and kebab-case conventions.',
        'Files are colocated under the feature.',
        'Inputs and outputs are typed.',
        'Templates remain simple and readable.'
      ],
      stretch: [
        'Add a small shared UI component and reuse it.',
        'Create a lint rule checklist for review.'
      ]
    },
    references: [
      { label: 'Angular style guide', url: 'https://angular.dev/style-guide' },
      { label: 'Components guide', url: 'https://angular.dev/guide/components' },
      { label: 'Signals guide', url: 'https://angular.dev/guide/signals' }
    ]
  },
  tailwind: {
    id: 'tailwind',
    title: 'Tailwind',
    tagline: 'Integrate Tailwind with Angular and apply utilities safely.',
    status: 'done',
    level: 'Beginner',
    duration: '30-40 min',
    summary:
      'Use Angular CLI’s Tailwind integration, import the base layers, and apply utility classes with simple bindings instead of ngClass.',
    outcomes: [
      'Install Tailwind via ng add or manual PostCSS setup.',
      'Import Tailwind layers in global styles.',
      'Compose utility classes with string/class bindings (no ngClass).',
      'Keep labs running in CSR without affecting SSR.'
    ],
    prerequisites: [
      'Standalone components and OnPush.',
      'Modern control flow (@if, @for).',
      'Basic familiarity with utility classes (spacing, border, color).'
    ],
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        summary: 'Tailwind is a utility-first CSS framework that pairs well with Angular.',
        paragraphs: [
          'Use the Angular CLI integration for a one-command setup that configures Tailwind and PostCSS.',
          'Utilities are applied directly in templates; favor simple bindings over dynamic ngClass logic.'
        ]
      },
      {
        id: 'setup',
        title: 'Setup options',
        summary: 'Pick the automated path first; know the manual steps for reference.',
        bullets: [
          'Automated: ng add @angular/tailwindcss installs deps, configures PostCSS, and imports layers.',
          'Manual: install tailwindcss/postcss, add postcss.config.cjs, import @tailwind base/components/utilities in styles.css.'
        ],
        code: [
          {
            title: 'Automated install',
            language: 'bash',
            snippet: 'ng add @angular/tailwindcss'
          },
          {
            title: 'Manual PostCSS config',
            language: 'json',
            snippet: '{\n  "plugins": {\n    "tailwindcss/postcss": {}\n  }\n}'
          },
          {
            title: 'Import layers',
            language: 'css',
            snippet: '@tailwind base;\n@tailwind components;\n@tailwind utilities;'
          }
        ]
      },
      {
        id: 'usage',
        title: 'Applying utilities',
        summary: 'Bind class strings instead of ngClass for predictable output.',
        bullets: [
          'Keep class lists short and readable (spacing, radius, shadow, text).',
          'Avoid ngClass; use [class] or literal class strings.',
          'Show the composed class string so others can copy/paste.'
        ],
        callouts: [
          {
            tone: 'tip',
            title: 'Restart after install',
            text: 'If styles do not appear, restart the dev server to clear cached builds.'
          }
        ]
      },
      {
        id: 'csr',
        title: 'CSR only for labs',
        summary: 'Labs stay client-rendered, so Tailwind usage here does not affect SSR routes.',
        bullets: [
          'Route /labs/** stays CSR; keep Tailwind experiments contained.',
          'If you enable Tailwind globally, verify SSR pages still match hydrated output.'
        ]
      }
    ],
    exercise: {
      title: 'Exercise: Utility preview card',
      goal: 'Build a preview card that toggles Tailwind utilities and shows the final class string.',
      tasks: [
        'Add toggles for padding, radius, shadow, and accent background.',
        'Bind a computed class string (no ngClass).',
        'Render the preview card with the active classes.',
        'Display the class string for copy/paste.'
      ],
      success: [
        'Toggling options updates both the card and the class string.',
        'No ngClass usage; simple bindings only.',
        'Tailwind layers are imported once globally.'
      ],
      stretch: [
        'Add a reduced-motion toggle that removes shadows/transitions.',
        'Provide two themes (light/dark) via class switches.'
      ]
    },
    references: [
      { label: 'Tailwind with Angular', url: 'https://angular.dev/guide/tailwind' },
      { label: 'Tailwind install (Vite)', url: 'https://tailwindcss.com/docs/installation/using-vite' }
    ]
  },
  'a11y-aria': {
    id: 'a11y-aria',
    title: 'A11y & Aria',
    tagline: 'Keep UI keyboard-friendly with Angular Aria and CDK helpers.',
    status: 'done',
    level: 'Intermediate',
    duration: '30-40 min',
    summary:
      'Plan and validate accessibility: labels, focus, contrast, and announcements backed by Angular Aria and CDK utilities.',
    outcomes: [
      'Apply a single focus order that works with keyboard and screen readers.',
      'Use Angular Aria helpers to wire labels, lists, and disclosure patterns.',
      'Verify contrast and live announcements for dynamic content.'
    ],
    prerequisites: [
      'Standalone components and OnPush.',
      'Basic familiarity with focus management and form labeling.',
      'Ability to run AXE or equivalent checks locally.'
    ],
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        summary: 'Accessibility is required, not optional.',
        paragraphs: [
          'Angular Aria and CDK give you primitives for focus, keyboard navigation, and labeling.',
          'A single, predictable focus order with clear labels keeps the UI usable for everyone.'
        ]
      },
      {
        id: 'focus',
        title: 'Focus and keyboard',
        summary: 'Plan tab order and focus restoration.',
        bullets: [
          'Add autofocus responsibly (e.g., cdkFocusInitial) and restore focus after dialogs close.',
          'Use arrow-key navigation only where it matches the pattern (listbox, menu).',
          'Never trap focus without an escape path.'
        ]
      },
      {
        id: 'announcements',
        title: 'Announcements and validation',
        summary: 'Communicate dynamic changes.',
        bullets: [
          'Use aria-live or status regions for async results and errors.',
          'Link labels with for/id and aria-describedby for helper text.',
          'Respect reduced motion and keep contrast AA or better.'
        ]
      },
      {
        id: 'implementation',
        title: 'Implementation checklist',
        summary: 'Wire Angular Aria primitives with predictable focus and labels.',
        bullets: [
          'Add aria-label/aria-labelledby for interactive elements and form fields.',
          'Use cdkFocusInitial and FocusTrap only when the pattern requires focus containment.',
          'Prefer button elements over divs for actions; keep tab order logical.',
          'Expose status updates via aria-live without stealing focus.'
        ],
        callouts: [
          {
            tone: 'tip',
            title: 'Respect user motion prefs',
            text: 'Wrap animations with prefers-reduced-motion queries or disable them for users that opt out.'
          }
        ]
      },
      {
        id: 'testing',
        title: 'Testing and verification',
        summary: 'Catch regressions with keyboard runs and automation.',
        bullets: [
          'Tab through the page to ensure no traps and visible focus.',
          'Run AXE (or similar) to catch label/contrast/landmark issues.',
          'Manually toggle reduced-motion and high-contrast settings to validate fallbacks.'
        ],
        callouts: [
          {
            tone: 'note',
            title: 'SSR safety',
            text: 'Keep direct DOM access inside browser guards; Aria utilities are client-friendly but avoid document/window in SSR paths.'
          }
        ]
      }
    ],
    exercise: {
      title: 'Exercise: Accessible filter panel',
      goal: 'Wire a small filter panel that passes AXE checks.',
      tasks: [
        'Label inputs and connect helper/error text with aria-describedby.',
        'Ensure focus moves to the panel header when it opens and returns on close.',
        'Add a live region that announces result counts after filters change.'
      ],
      success: [
        'Tab order is predictable and loops are avoided.',
        'Labels and descriptions are announced by screen readers.',
        'Live region updates do not steal focus.'
      ],
      stretch: [
        'Add keyboard shortcuts that mirror visible controls.',
        'Add reduced-motion styling for users who prefer it.'
      ]
    },
    references: [
      { label: 'Angular Aria overview', url: 'https://angular.dev/guide/aria/overview' },
      { label: 'Angular Aria components', url: 'https://angular.dev/guide/aria/components' },
      { label: 'Accessibility checklist', url: 'https://angular.dev/guide/accessibility' },
      { label: 'CDK Focus management', url: 'https://material.angular.io/cdk/a11y/overview' }
    ]
  },
  pwa: {
    id: 'pwa',
    title: 'PWA',
    extra: true,
    tagline: 'Make the app installable with an app-shell cache and clear update flow.',
    status: 'done',
    level: 'Intermediate',
    duration: '30-40 min',
    summary:
      'This extra lab focuses on installability, app-shell caching, and update UX. It stays scoped: cache only static assets (no API caching) and document the update path.',
    outcomes: [
      'Enable the Angular service worker and app-shell cache.',
      'Keep API responses out of the cache for predictability.',
      'Provide a clear update flow when a new SW is available.',
      'Validate PWA manifests and offline fallbacks.'
    ],
    prerequisites: [
      'Standalone components and OnPush.',
      'Basic service worker concepts (scope, lifecycle).',
      'Access to devtools Application tab for verification.'
    ],
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        summary: 'Installability hinges on manifest + service worker + HTTPS.',
        paragraphs: [
          'The Angular service worker can pre-cache an app shell for fast repeats and offline fallback.',
          'Keep the scope tight: cache static assets, but avoid caching API data to reduce staleness and quota usage.'
        ],
        callouts: [
          {
            tone: 'note',
            title: 'Extra content',
            text: 'PWA is outside the Angular 21 novelty focus; treat it as optional enrichment.'
          }
        ]
      },
      {
        id: 'app-shell',
        title: 'App shell caching',
        summary: 'Pre-cache the shell so navigation works offline.',
        bullets: [
          'Use `ng add @angular/pwa` to scaffold the manifest and service worker config.',
          'Default asset groups cache index.html, CSS, JS, and icons.',
          'Do not add API URLs to the service worker config for this app.'
        ]
      },
      {
        id: 'manifest',
        title: 'Manifest and icons',
        summary: 'Manifest metadata controls install prompts.',
        bullets: [
          'Set `name`, `short_name`, `start_url`, and `display`.',
          'Provide icons in multiple sizes (192/512).',
          'Keep the scope aligned with the app route (e.g., `/`).'
        ]
      },
      {
        id: 'updates',
        title: 'Update flow',
        summary: 'New service worker versions should be explicit to users.',
        bullets: [
          'Use SwUpdate to listen for available updates and prompt the user.',
          'On accept, call `activateUpdate()` then reload.',
          'Document the expected UX: toast/banner/button.'
        ],
        code: [
          {
            title: 'Prompt for updates',
            language: 'ts',
            snippet:
              "const swUpdate = inject(SwUpdate);\n\nonInit(() => {\n  swUpdate.versionUpdates.subscribe((event) => {\n    if (event.type === 'VERSION_READY') {\n      this.showUpdatePrompt.set(true);\n    }\n  });\n});\n\napplyUpdate(): void {\n  swUpdate.activateUpdate().then(() => location.reload());\n}"
          }
        ]
      },
      {
        id: 'caching-rules',
        title: 'Caching rules',
        summary: 'Keep dynamic data out of the cache.',
        bullets: [
          'Do not cache PokéAPI responses; rely on client caching layer instead.',
          'Avoid `dataGroups` for external APIs unless you control cache TTLs.',
          'Verify cache contents via devtools Application > Cache Storage.'
        ]
      },
      {
        id: 'testing',
        title: 'Testing and validation',
        summary: 'Validate installability and offline fallback.',
        bullets: [
          'Use Lighthouse PWA checks for manifest + SW presence.',
          'Simulate offline and reload to verify shell renders.',
          'Confirm update flow by bumping version and observing the prompt.'
        ]
      }
    ],
    exercise: {
      title: 'Exercise: App shell with update prompt',
      goal: 'Enable the Angular service worker, keep APIs uncached, and surface an update prompt.',
      tasks: [
        'Run `ng add @angular/pwa` and inspect the generated `ngsw-config.json`.',
        'Ensure no API URLs are in `dataGroups` (shell-only caching).',
        'Add an update banner or toast that calls activateUpdate() then reloads.',
        'Validate installability and offline shell rendering in devtools.'
      ],
      success: [
        'App installs and launches offline to the shell.',
        'API requests are not served from the SW cache.',
        'Update prompt appears when a new version is available.'
      ],
      stretch: [
        'Add a lightweight offline fallback page for navigation errors.',
        'Log update events to analytics for observability.'
      ]
    },
    references: [
      { label: 'Angular PWA guide', url: 'https://angular.dev/guide/pwa' },
      { label: 'Service worker config', url: 'https://angular.dev/guide/pwa/config' },
      { label: 'SwUpdate API', url: 'https://angular.dev/api/service-worker/SwUpdate' }
    ]
  },
  testing: {
    id: 'testing',
    title: 'Testing',
    extra: true,
    tagline: 'Write SSR-safe specs with Vitest and cover routing + hydration branches.',
    status: 'done',
    level: 'Intermediate',
    duration: '30-40 min',
    summary:
      'Extra lab focused on testing patterns: SSR-safe specs, Http mocking, router harness, and hydration-aware assertions.',
    outcomes: [
      'Author SSR-safe specs without touching window/document.',
      'Mock HTTP and component inputs cleanly.',
      'Test routing with RouterTestingHarness.',
      'Cover hydration-specific branches when needed.'
    ],
    prerequisites: ['Vitest basics.', 'Standalone components.', 'Modern Angular testing utilities.'],
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        summary: 'Tests must work in SSR-like environments.',
        paragraphs: [
          'Avoid window/document in tests unless guarded.',
          'Use Angular testing harnesses for routing and components.',
          'Keep tests deterministic: mock HTTP and provide test doubles.'
        ],
        callouts: [
          {
            tone: 'note',
            title: 'Extra content',
            text: 'Testing lab is optional and outside the Angular 21 novelty focus.'
          }
        ]
      },
      {
        id: 'setup',
        title: 'Test setup',
        summary: 'Configure the test module with only what you need.',
        bullets: [
          'Import the component under test; avoid global modules.',
          'ProvideRouter with the minimal routes required.',
          'Mock providers with useValue/useFactory as needed.'
        ]
      },
      {
        id: 'http',
        title: 'HTTP mocking',
        summary: 'Use HttpTestingController for HttpClient consumers.',
        bullets: [
          'Inject HttpTestingController to flush responses.',
          'Assert no outstanding requests in afterEach.',
          'Prefer typed DTO fixtures to keep assertions stable.'
        ]
      },
      {
        id: 'routing-tests',
        title: 'Routing tests',
        summary: 'Use RouterTestingHarness to navigate fast.',
        bullets: [
          'Provide routes inline for the spec.',
          'Use harness.navigateByUrl and assert rendered content.',
          'Keep tests focused: one route change per spec when possible.'
        ],
        code: [
          {
            title: 'Harness navigation',
            language: 'ts',
            snippet:
              "const harness = await RouterTestingHarness.create({ routes });\nawait harness.navigateByUrl('/labs/testing');\nexpect(harness.routeNativeElement?.textContent).toContain('Testing');"
          }
        ]
      },
      {
        id: 'hydration',
        title: 'Hydration branches',
        summary: 'Guard client-only APIs and assert both code paths.',
        bullets: [
          'Use feature flags or guards for window/document.',
          'Mock isServer side to cover SSR/hydration branches.',
          'Avoid relying on canvas or media APIs in tests.'
        ]
      }
    ],
    exercise: {
      title: 'Exercise: SSR-safe spec',
      goal: 'Write a component spec that mocks HTTP, routes, and client-only APIs safely.',
      tasks: [
        'Set up TestBed with the component and minimal providers.',
        'Mock HttpClient calls with HttpTestingController.',
        'Use RouterTestingHarness to render a route.',
        'Add a guard for window/document usage and assert both branches.'
      ],
      success: [
        'Spec passes without accessing window/document directly.',
        'HTTP requests are flushed and verified.',
        'Route renders the expected content.',
        'Hydration/client branch is covered by guards or mocks.'
      ],
      stretch: [
        'Add a2a11y check with axe-core integration in the test.',
        'Snapshot only stable text (avoid brittle markup snapshots).'
      ]
    },
    references: [
      { label: 'Angular testing', url: 'https://angular.dev/guide/testing' },
      { label: 'RouterTestingHarness', url: 'https://angular.dev/api/router/testing/RouterTestingHarness' },
      { label: 'HttpTestingController', url: 'https://angular.dev/api/common/http/testing/HttpTestingController' }
    ]
  },
  performance: {
    id: 'performance',
    title: 'Performance',
    extra: true,
    tagline: 'Keep the bundle lean and ship only what each view needs.',
    status: 'done',
    level: 'Advanced',
    duration: '35-45 min',
    summary:
      'Extra lab focused on practical levers: budgets, defer views, critical assets, and network hygiene. Scope stays educational.',
    outcomes: [
      'Define JS/CSS budgets and monitor them.',
      'Use defer/lazy patterns for non-critical views.',
      'Plan image/font loading to avoid layout shift.',
      'Control concurrency and caching discipline.'
    ],
    prerequisites: [
      'SSR/hydration basics.',
      'Understanding of bundle outputs and network waterfall.',
      'Familiarity with defer blocks and route render modes.'
    ],
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        summary: 'Performance is about shipping less and waiting less.',
        paragraphs: [
          'Set guardrails (budgets), then use defer, caching, and loading hints to prioritize critical content.',
          'Measure with devtools network panel and Angular build output.'
        ],
        callouts: [
          {
            tone: 'note',
            title: 'Extra content',
            text: 'This lab is optional and outside the Angular 21 novelty focus.'
          }
        ]
      },
      {
        id: 'budgets',
        title: 'Budgets',
        summary: 'Define limits and fail builds when exceeded.',
        bullets: [
          'Set JS/CSS budgets in angular.json or via tooling.',
          'Track bundle sizes per route when possible.',
          'Investigate regressions before merging.'
        ]
      },
      {
        id: 'defer',
        title: 'Defer non-critical work',
        summary: 'Delay secondary UI until needed.',
        bullets: [
          'Use defer or lazy routes for offscreen/secondary panels.',
          'Avoid hydrating hidden UI until requested.',
          'Prefer streaming data over blocking render.'
        ]
      },
      {
        id: 'assets',
        title: 'Assets and fonts',
        summary: 'Control images and fonts to avoid layout shifts.',
        bullets: [
          'Use NgOptimizedImage with width/height set.',
          'Preconnect font/CDN origins; use font-display: swap.',
          'Lazy-load non-critical media; keep hero assets light.'
        ]
      },
      {
        id: 'network',
        title: 'Network discipline',
        summary: 'Reduce duplicate and concurrent heavy requests.',
        bullets: [
          'Limit concurrent detail fetches (already 8 in this app).',
          'Dedupe identical requests in the data layer.',
          'Do not cache API responses in the service worker.'
        ]
      }
    ],
    exercise: {
      title: 'Exercise: Performance guardrails',
      goal: 'Add budgets, identify defer candidates, and propose asset/loading fixes.',
      tasks: [
        'Define JS/CSS budgets and note current bundle sizes.',
        'List components/routes to defer or lazy-load.',
        'Add two concrete asset/loading improvements (e.g., NgOptimizedImage, font preconnect).'
      ],
      success: [
        'Budgets defined with thresholds.',
        'At least one defer/lazy action identified.',
        'Asset/loading plan reduces LCP risk.'
      ],
      stretch: [
        'Add a reduced-concurrency profile for slow networks.',
        'Capture before/after bundle numbers for visibility.'
      ]
    },
    references: [
      { label: 'Performance guide', url: 'https://angular.dev/guide/performance' },
      { label: 'Defer views', url: 'https://angular.dev/guide/defer' },
      { label: 'Images', url: 'https://angular.dev/guide/images' }
    ]
  },
    'custom-build': {
    id: 'custom-build',
    title: 'Custom build',
    extra: true,
    tagline: 'Design a custom build pipeline without breaking SSR or DX.',
    status: 'done',
    level: 'Advanced',
    duration: '35-45 min',
    summary:
      'Extra lab about build customization: define goals, compare options, and capture risks so the team knows when to stay on CLI defaults.',
    outcomes: [
      'List goals and constraints before changing the build.',
      'Compare CLI defaults vs custom pipeline tradeoffs.',
      'Plan cache/artifact strategy for CI.',
      'Document SSR/CSR compatibility checks.'
    ],
    prerequisites: ['Comfort with CLI builders and CI.', 'Basic knowledge of Vite/ESBuild pipelines.'],
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        summary: 'Customize builds only when you have a clear goal.',
        paragraphs: [
          'Common goals: faster CI, custom transforms, monorepo integration.',
          'Tradeoffs: more maintenance, more breakage risk for SSR/hydration.',
          'Start with defaults; change only with measurement.'
        ],
        callouts: [
          {
            tone: 'note',
            title: 'Extra content',
            text: 'This lab is optional and not part of the Angular 21 novelty focus.'
          }
        ]
      },
      {
        id: 'goals',
        title: 'Goals and constraints',
        summary: 'Write down what success looks like.',
        bullets: [
          'Target metrics: build time, bundle size, dev server latency.',
          'Constraints: SSR parity, source maps, a11y checks.',
          'Decide owners for build maintenance.'
        ]
      },
      {
        id: 'pipeline',
        title: 'Pipeline outline',
        summary: 'Describe steps and tools.',
        bullets: [
          'Entry: lint -> test -> build (SSR/CSR as needed).',
          'Tools: Angular CLI (Vite), optional custom plugins.',
          'Artifacts: dist outputs + coverage reports.'
        ]
      },
      {
        id: 'caching',
        title: 'Caching and artifacts',
        summary: 'Speed up CI without stale outputs.',
        bullets: [
          'Cache node_modules and .angular/cache keyed by lockfile.',
          'Upload dist artifacts for deploy steps.',
          'Invalidate cache on builder or config changes.'
        ]
      },
      {
        id: 'compatibility',
        title: 'Compatibility checks',
        summary: 'Keep SSR/CSR consistent.',
        bullets: [
          'Run SSR build + smoke render; watch for hydration errors.',
          'Ensure renderMode settings survive custom steps.',
          'Keep testing and linting in the pipeline.'
        ]
      }
    ],
    exercise: {
      title: 'Exercise: Build strategy outline',
      goal: 'Draft a custom build pipeline with risks and validation steps.',
      tasks: [
        'State goals/constraints (time, size, SSR).',
        'List pipeline steps with tools and artifacts.',
        'Define cache keys and invalidation rules.',
        'Add SSR/CSR validation steps (smoke render).'
      ],
      success: [
        'Goals and constraints are explicit.',
        'Pipeline steps are clear and tied to artifacts.',
        'Cache strategy is documented with invalidation rules.',
        'SSR/CSR checks are part of the plan.'
      ],
      stretch: [
        'Add a rollback plan for failed builds.',
        'Document observability (logs, metrics) for the pipeline.'
      ]
    },
    references: [{ label: 'CLI builders', url: 'https://angular.dev/guide/cli-builder' }]
  },
  cdk: {
    id: 'cdk',
    title: 'CDK',
    extra: true,
    tagline: 'Compose overlays, focus helpers, and portals with CDK.',
    status: 'done',
    level: 'Intermediate',
    duration: '30-40 min',
    summary: 'Use CDK primitives (overlay, focus management, portals) to build accessible UI building blocks.',
    outcomes: [
      'Create lightweight overlays with escape/overlay click handling.',
      'Apply focus helpers (cdkFocusInitial, FocusTrap) for keyboard UX.',
      'Render portals to move content without breaking semantics.'
    ],
    prerequisites: ['Standalone components.', 'Basic accessibility patterns.'],
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        summary: 'CDK provides primitives for overlays, focus, and portals.',
        paragraphs: [
          'Prefer CDK building blocks over bespoke DOM hacks.',
          'Keep overlays accessible: focus trapping, escape to close, and labelled content.'
        ],
        callouts: [
          {
            tone: 'note',
            title: 'Extra content',
            text: 'Optional lab; use when you need reusable primitives.'
          }
        ]
      },
      {
        id: 'overlay',
        title: 'Overlays',
        summary: 'Place floating UI with keyboard support.',
        bullets: [
          'Use Overlay + OverlayRef to attach/detach panes.',
          'Close on escape or backdrop click.',
          'Restore focus to the trigger after close.'
        ]
      },
      {
        id: 'focus',
        title: 'Focus helpers',
        summary: 'Keep keyboard navigation predictable.',
        bullets: [
          'Use cdkFocusInitial for the first actionable control.',
          'Use FocusTrap to keep focus inside modal-like surfaces.',
          'Avoid trapping focus without a close path.'
        ]
      },
      {
        id: 'portal',
        title: 'Portals',
        summary: 'Render content elsewhere without breaking structure.',
        bullets: [
          'Use Portal/PortalOutlet to move content.',
          'Keep aria-label/aria-labelledby intact when moving content.',
          'Prefer portals over manual DOM moves.'
        ]
      }
    ],
    exercise: {
      title: 'Exercise: Overlay with focus trap',
      goal: 'Build a small overlay that traps focus and restores it on close.',
      tasks: [
        'Create an overlay opened by a button; backdrop closes it.',
        'Trap focus inside and set cdkFocusInitial on the primary action.',
        'Restore focus to the trigger when closed.'
      ],
      success: [
        'Overlay closes on escape/backdrop.',
        'Focus stays inside while open and returns to trigger on close.',
        'Content remains labelled for screen readers.'
      ],
      stretch: ['Render overlay content via a portal.', 'Add inert/offscreen state while closed.']
    },
    references: [{ label: 'CDK overview', url: 'https://material.angular.io/cdk/categories' }]
  }
};
