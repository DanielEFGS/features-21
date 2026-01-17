import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'docs',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'pokedex',
    renderMode: RenderMode.Server
  },
  {
    path: 'pokedex/:nameOrId',
    renderMode: RenderMode.Server
  },
  {
    path: 'labs/**',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
