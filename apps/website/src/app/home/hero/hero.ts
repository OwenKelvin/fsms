import { Component, HostBinding } from '@angular/core';
import { HlmButton } from '@fsms/ui/button';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  imports: [HlmButton],
})
export class Hero {
  @HostBinding('class') hostClass = 'block w-full';
}
