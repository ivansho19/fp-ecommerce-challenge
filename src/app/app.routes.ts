import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('./layout/shell/shell.component').then((m) => m.ShellComponent),
		children: [
			{
				path: '',
				loadChildren: () =>
					import('./features/home/home.routes').then((m) => m.HOME_ROUTES)
			},
			{
				path: 'product/:slug',
				loadChildren: () =>
					import('./features/product/product.routes').then((m) => m.PRODUCT_ROUTES)
			}
		]
	},
	{ path: '**', redirectTo: '' }
];
