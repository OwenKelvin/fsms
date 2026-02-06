import { Component, computed, effect, inject, model } from '@angular/core';
import { NgIcon, provideIcons, provideNgIconLoader } from '@ng-icons/core';
import { lucideArrowRight, lucideLock, lucideMail } from '@ng-icons/lucide';
import {
  email,
  form,
  FormField,
  required,
  submit,
} from '@angular/forms/signals';

import { HlmButton } from '@fsms/ui/button';
import { HlmInput } from '@fsms/ui/input';
import { HlmLabel } from '@fsms/ui/label';
import {
  HlmError,
  HlmFormControl,
  HlmFormField,
  HlmPrefix,
} from '@fsms/ui/form-field';
import { HlmIcon } from '@fsms/ui/icon';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';

interface LoginFormComponentValue {
  email: string;
  password: string;
}

@Component({
  selector: 'fsms-admin-portal-login',
  standalone: true,
  imports: [
    FormField,
    HlmInput,
    HlmLabel,
    HlmButton,
    HlmFormField,
    HlmError,
    HlmIcon,
    HlmFormControl,
    HlmPrefix,
    NgIcon,
  ],
  providers: [
    provideIcons({
      lucideMail,
      lucideLock,
      lucideArrowRight,
    }),
    provideNgIconLoader((name) =>
      fetch(`images/${name}.svg`).then((res) => res.text()),
    ),
  ],
  templateUrl: './login.html',
})
export class Login {
  http = inject(HttpClient);
  logoSvg = toSignal(
    this.http.get('images/logo.svg', { responseType: 'text' }),
  );
  constructor() {
    effect(() => {
      const svg = this.logoSvg();
      if (svg) {
        provideIcons({
          logoSvg: svg,
        });
      }
    });
  }
  formValue = model<LoginFormComponentValue>({
    email: '',
    password: '',
  });

  public readonly loginForm = form<LoginFormComponentValue>(
    this.formValue,
    (schemaPath) => {
      required(schemaPath.email, { message: 'Email is required' });
      email(schemaPath.email, { message: 'Please enter a valid email' });
      required(schemaPath.password, { message: 'Password is required' });
    },
  );

  submitting = computed(() => this.loginForm().submitting());

  async handleSubmit(event: Event) {
    event.preventDefault();
    await submit(this.loginForm, async (loginForm) => {
      // TODO: Implement actual login logic here
      console.log('Login form submitted:', loginForm().value());
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // On success, you might navigate or show a success message
      // On error, you might set form errors
      // For now, just logging
      return undefined;
    });
  }
}
