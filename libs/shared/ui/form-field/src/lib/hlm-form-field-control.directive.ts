import { Directive, signal } from '@angular/core';

@Directive({
  selector: '[hlmFormFieldControl]',
  standalone: true,
})
export class HlmFormFieldControlDirective {
  public readonly hasPrefix = signal(false);
}
