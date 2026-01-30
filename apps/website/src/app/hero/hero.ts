import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
})
export class Hero {
  @HostBinding('class') hostClass = 'flex';
}
