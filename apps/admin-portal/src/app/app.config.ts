import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideNgIconLoader } from '@ng-icons/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { apolloConfig } from '@fsms/data-access/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideApollo(apolloConfig),
    provideHttpClient(withFetch()),
    provideNgIconLoader((name: string) =>
      fetch(`/images/${name}.svg`).then((r) => r.text()),
    ),
  ],
};
