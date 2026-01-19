import { RenderMode } from '@angular/ssr';
import { serverRoutes } from './app.routes.server';

function findRoute(path: string) {
  return serverRoutes.find((route) => route.path === path);
}

describe('server routes', () => {
  it('configures render modes', () => {
    expect(findRoute('')?.renderMode).toBe(RenderMode.Prerender);
    expect(findRoute('docs')?.renderMode).toBe(RenderMode.Prerender);
    expect(findRoute('pokedex')?.renderMode).toBe(RenderMode.Server);
    expect(findRoute('pokedex/:nameOrId')?.renderMode).toBe(RenderMode.Server);
    expect(findRoute('labs/**')?.renderMode).toBe(RenderMode.Client);
  });
});
