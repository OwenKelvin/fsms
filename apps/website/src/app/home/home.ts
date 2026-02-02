import { Component } from '@angular/core';
import { Cta } from './cta/cta';
import { Features } from './features/features';
import { Hero } from './hero/hero';
import { Header } from '../header/header';

@Component({
  imports: [Cta, Features, Hero, Header],
  template: `
    <app-header />
    <app-hero />
    <app-features />
    <app-cta />
  `,
})
export default class Home {}
