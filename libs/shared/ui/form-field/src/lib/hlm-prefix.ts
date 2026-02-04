import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideHlmIconConfig } from '@fsms/ui/icon';

@Component({
  selector: 'hlm-prefix',
  template: ` <ng-content /> `,
  host: {
    class:
      'pointer-events-none absolute text-muted-foreground left-3 flex items-center',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideHlmIconConfig({
      size: 'sm',
    }),
  ],
})
export class HlmPrefix {}
