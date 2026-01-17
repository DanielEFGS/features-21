import type { IStaticMethods } from 'preline/dist';

declare global {
  interface Window {
    // Optional third-party libraries.
    _?: unknown;
    $?: typeof import('jquery');
    jQuery?: typeof import('jquery');
    DataTable?: unknown;
    Dropzone?: unknown;
    VanillaCalendarPro?: unknown;

    // Preline UI.
    HSStaticMethods?: IStaticMethods;
  }
}

export {};
