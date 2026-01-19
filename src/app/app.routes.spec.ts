import { routes } from './app.routes';

function findRoute(path: string) {
  return routes.find((route) => route.path === path);
}

describe('app routes', () => {
  it('defines core feature routes', () => {
    expect(findRoute('')).toBeTruthy();
    expect(findRoute('pokedex')).toBeTruthy();
    expect(findRoute('pokedex/:nameOrId')).toBeTruthy();
    expect(findRoute('labs')).toBeTruthy();
    expect(findRoute('labs/:feature')).toBeTruthy();
    expect(findRoute('docs')).toBeTruthy();
  });
});
