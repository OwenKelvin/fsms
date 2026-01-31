import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./home/home'),
  },
  {
    path: 'register',
    loadComponent: () => import('./registration-form/registration-form'),
  },
];
