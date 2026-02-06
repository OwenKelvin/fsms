import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    loadChildren: () => import('@fsms/admin-portal-pages/auth'),
  },
];
