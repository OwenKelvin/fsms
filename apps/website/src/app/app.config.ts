import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideApollo } from 'apollo-angular';
import { apolloConfig } from '@fsms/data-access/core';
import { provideNgIconLoader } from '@ng-icons/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideApollo(apolloConfig),
    provideNgIconLoader((name: string) =>
      fetch(`/images/${name}.svg`).then((r) => r.text()),
    ),
  ],
};
