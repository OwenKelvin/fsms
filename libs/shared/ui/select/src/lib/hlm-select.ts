import { Directive } from '@angular/core';
import { classes } from '@fsms/ui/utils';

@Directive({
  selector: 'hlm-select, brn-select [hlm]',
})
export class HlmSelect {
  constructor() {
    classes(() => 'w-full space-y-2');
  }
}
