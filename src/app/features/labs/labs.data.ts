import { LabCatalogItem, LabContent } from './labs.models';

/** Catalog cards shown on the labs index page. */
export const LAB_CATALOG: LabCatalogItem[] = [
  {
    id: 'signals',
    title: 'Signals',
    status: 'in-progress',
    level: 'Beginner',
    duration: '30-40 min',
    summary: 'Model local state with signals, derive values with computed, and use effects for side effects.'
  },
  {
    id: 'httpresource',
    title: 'httpResource',
    status: 'planned',
    level: 'Intermediate',
    duration: '35-45 min',
    summary: 'Reactive data fetching with resources, loading states, and abortable requests.'
  },
  {
    id: 'rxjs-interop',
    title: 'RxJS Interop',
    status: 'planned',
    level: 'Intermediate',
    duration: '30-40 min',
    summary: 'Bridge signals with observables using toSignal and toObservable.'
  },
  {
    id: 'routing',
    title: 'Routing',
    status: 'planned',
    level: 'Intermediate',
    duration: '40-50 min',
    summary: 'Lazy routes, route data, and guards with modern routing patterns.'
  },
  {
    id: 'di',
    title: 'DI',
    status: 'planned',
    level: 'Intermediate',
    duration: '30-40 min',
    summary: 'Inject services with inject(), tokens, and route-level providers.'
  },
  {
    id: 'forms',
    title: 'Forms',
    status: 'planned',
    level: 'Intermediate',
    duration: '40-50 min',
    summary: 'Reactive forms with signals and strict typing.'
  },
  {
    id: 'animations',
    title: 'Animations',
    status: 'planned',
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
    status: 'in-progress',
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
  }
};
