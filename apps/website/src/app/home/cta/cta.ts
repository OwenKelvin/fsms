import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cta',
  templateUrl: './cta.html',
  standalone: true,
  imports: [RouterLink],
})
export class Cta {}
