import { Routes } from '@angular/router';


export const ReviewRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'queue',
  },
  {
    path: 'queue',
    loadComponent: () => import('./queue/queue').then((m) => m.Dashboard),
  },
];
