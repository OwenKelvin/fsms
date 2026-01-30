import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Hero } from './hero/hero';
import { Features } from './features/features';
import { Cta } from './cta/cta';

@Component({
  imports: [RouterOutlet, Header, Hero, Features, Cta],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
