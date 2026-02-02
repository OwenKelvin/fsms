import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
} from '@angular/core';
import { HlmFormFieldControlDirective } from './hlm-form-field-control.directive';
import { HlmPrefix } from './hlm-prefix';

@Component({
  selector: 'hlm-form-control',
  template: `<ng-content />`,
  host: {
    class: 'relative flex w-full items-center',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmFormControl implements AfterContentInit {
  @ContentChild(HlmPrefix)
  private _prefix?: HlmPrefix;

  @ContentChild(HlmFormFieldControlDirective)
  private _controlDirective?: HlmFormFieldControlDirective;

  ngAfterContentInit() {
    if (this._prefix && this._controlDirective) {
      this._controlDirective.hasPrefix.set(true);
    }
  }
}
