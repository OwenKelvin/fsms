import { Routes } from '@angular/router';

export const ReviewRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'queue',
  },
  {
    path: 'queue',
    loadComponent: () =>
      import('./queue/review-queue.component').then(
        (m) => m.ReviewQueueComponent
      ),
  },
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./detail/registration-detail.component').then(
        (m) => m.RegistrationDetailComponent
      ),
  },
];
