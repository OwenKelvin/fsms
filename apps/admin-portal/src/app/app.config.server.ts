import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { provideNgIconLoader } from '@ng-icons/core';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideNgIconLoader(async (name: string) => {
      const iconPath = join(
        process.cwd(),
        'dist/apps/admin-portal/browser/images', // adjust path if needed
        `${name}.svg`,
      );
      return readFile(iconPath, 'utf-8');
    }),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
