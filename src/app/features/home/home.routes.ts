import { Routes } from '@angular/router';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    title: 'Challenge | Frontend FP Ecommerce',
    loadComponent: () =>
      import('./pages/home-page.component').then((m) => m.HomePageComponent)
  }
];
