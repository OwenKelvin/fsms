import { Routes } from '@angular/router';
import { ReviewRoutes } from '@fsms/admin-portal-pages/review';


export const DashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout').then(m => m.Dashboard),
    children: [
      {
        path: 'review',
        children: ReviewRoutes
      }
    ]
  }
]
