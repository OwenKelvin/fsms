import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'hlm-form-control',
	template: `<ng-content />`,
	host: {
		class: 'relative flex w-full items-center',
	},
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HlmFormControl {}
