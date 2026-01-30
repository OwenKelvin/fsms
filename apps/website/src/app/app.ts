import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Hero } from './hero/hero';
import { Features } from './features/features';
import { Cta } from './cta/cta';
import { Footer } from './footer/footer';

@Component({
  imports: [RouterOutlet, Header, Hero, Features, Cta, Footer],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
