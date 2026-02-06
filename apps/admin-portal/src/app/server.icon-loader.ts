import { provideNgIconLoader } from '@ng-icons/core';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const serverIconLoader = provideNgIconLoader(async (name: string) => {
  const iconPath = join(
    process.cwd(),
    'dist/apps/admin-portal/browser/images',
    `${name}.svg`,
  );
  return readFile(iconPath, 'utf-8');
});
