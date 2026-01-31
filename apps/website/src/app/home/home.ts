import { Component } from '@angular/core';
import { Cta } from './cta/cta';
import { Features } from './features/features';
import { Hero } from './hero/hero';
@Component({
  imports: [Cta, Features, Hero],
  template: `
    <app-hero />
    <app-features />
    <app-cta />
  `,
})
export default class Home {}
