import { Directive } from '@angular/core';
import { BrnSeparator } from '@spartan-ng/brain/separator';
import { hlmSeparatorClass } from '@fsms/ui/separator';
import { classes } from '@fsms/ui/utils';
@Directive({
	selector: 'div[hlmItemSeparator]',
	hostDirectives: [{ directive: BrnSeparator, inputs: ['orientation'] }],
	host: { 'data-slot': 'item-separator' },
})
export class HlmItemSeparator {
	constructor() {
		classes(() => [hlmSeparatorClass, 'my-0']);
	}
}
