import { Component, computed, inject, model } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowRight,
  lucideLock,
  lucideMail,
  lucideTriangleAlert,
} from '@ng-icons/lucide';
import {
  email,
  FieldTree,
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
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@fsms/data-access/auth';
import { lastValueFrom } from 'rxjs';
import { formatGraphqlError } from '@fsms/data-access/core';
import {
  HlmAlert,
  HlmAlertDescription,
  HlmAlertIcon,
  HlmAlertTitle,
} from '@fsms/ui/alert';

interface LoginFormValue {
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
    HlmAlert,
    HlmAlertDescription,
    HlmAlertIcon,
    HlmAlertTitle,
  ],
  providers: [
    provideIcons({
      lucideMail,
      lucideLock,
      lucideArrowRight,
      lucideTriangleAlert,
    }),
  ],
  templateUrl: './login.html',
})
export class Login {
  http = inject(HttpClient);
  authService = inject(AuthService);
  formValue = model<LoginFormValue>({
    email: '',
    password: '',
  });

  public readonly loginForm = form<LoginFormValue>(
    this.formValue,
    (schemaPath) => {
      required(schemaPath.email, { message: 'Email is required' });
      email(schemaPath.email, { message: 'Please enter a valid email' });
      required(schemaPath.password, { message: 'Password is required' });
    },
  );

  submitting = computed(() => this.loginForm().submitting());

  submitLoginForm = async (loginForm: FieldTree<LoginFormValue>) => {
    try {
      const result = await lastValueFrom(
        this.authService.loginWithPassword(loginForm().value()),
      );

      console.log({ result });

      return undefined;
    } catch (e) {
      return formatGraphqlError(e, loginForm);
    }
  };

  async handleSubmit(event: Event) {
    event.preventDefault();
    await submit(this.loginForm, this.submitLoginForm);
  }
}
