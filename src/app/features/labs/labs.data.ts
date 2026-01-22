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
    status: 'in-progress',
    level: 'Beginner',
    duration: '25-35 min',
    summary: 'Simple, purposeful motion that improves clarity and feedback.'
  },
  {
    id: 'style-guide',
    title: 'Style Guide',
    status: 'planned',
    level: 'Beginner',
    duration: '20-30 min',
    summary: 'Apply naming, structure, and lint rules consistently across features.'
  },
  {
    id: 'tailwind',
    title: 'Tailwind',
    status: 'planned',
    level: 'Beginner',
    duration: '30-40 min',
    summary: 'Build clean UI with utility-first patterns and reuse shared primitives.'
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
  }
};
