import { Route } from '@angular/router';
import { AuthService } from '@fsms/data-access/auth';

export const appRoutes: Route[] = [
  {
    path: '',
    providers: [AuthService],
    children: [
      {
        path: 'auth',
        loadChildren: () => import('@fsms/admin-portal-pages/auth'),
      },
      {
        path: 'dashboard',
        loadChildren: () => import('@fsms/admin-portal-pages/dashboard'),
      },
    ],
  },
];
