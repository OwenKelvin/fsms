import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./home/home'),
  },
  {
    path: 'register',
    loadComponent: () => import('./institution-form/institution-form'),
  },
];
