import { Routes } from '@angular/router';

export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    title: 'Product Detail',
    loadComponent: () =>
      import('./pages/product-page.component').then((m) => m.ProductPageComponent)
  }
];
