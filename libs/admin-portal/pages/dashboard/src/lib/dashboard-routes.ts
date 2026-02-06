import { Routes } from '@angular/router';


export const DashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout').then(m => m.Dashboard),
    children: [
      {
        path: 'review',
        loadChildren: () => import('@fsms/admin-portal-pages/review'),
      }
    ]
  }
]
