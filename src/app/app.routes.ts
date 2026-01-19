import { Routes } from '@angular/router';

import { DocsPage } from './features/docs/docs-page/docs-page';
import { HomePage } from './features/home/home-page/home-page';
import { LabsFeaturePage } from './features/labs/labs-feature-page/labs-feature-page';
import { LabsIndexPage } from './features/labs/labs-index-page/labs-index-page';
import { PokedexDetailPage } from './features/pokedex/pokedex-detail-page/pokedex-detail-page';
import { PokedexListPage } from './features/pokedex/pokedex-list-page/pokedex-list-page';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomePage,
    title: 'Home'
  },
  {
    path: 'pokedex',
    component: PokedexListPage,
    title: 'Pokedex'
  },
  {
    path: 'pokedex/:nameOrId',
    component: PokedexDetailPage,
    title: 'Pokedex detail'
  },
  {
    path: 'labs',
    component: LabsIndexPage,
    title: 'Labs'
  },
  {
    path: 'labs/:feature',
    component: LabsFeaturePage,
    title: 'Lab'
  },
  {
    path: 'docs',
    component: DocsPage,
    title: 'Docs'
  }
];
