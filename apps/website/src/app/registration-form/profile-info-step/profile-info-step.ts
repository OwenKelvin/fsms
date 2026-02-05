import {
  Component,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideMail, lucideTriangleAlert, lucideUser } from '@ng-icons/lucide';
import {
  email,
  FieldTree,
  form,
  FormField,
  required,
  submit,
} from '@angular/forms/signals';
import { BrnSelect, BrnSelectImports } from '@spartan-ng/brain/select';

import { HlmButton } from '@fsms/ui/button';
import { HlmInput } from '@fsms/ui/input';
import { HlmLabel } from '@fsms/ui/label';
import {
  HlmError,
  HlmFormControl,
  HlmFormField,
  HlmHint,
  HlmPrefix,
} from '@fsms/ui/form-field';
import {
  HlmSelect,
  HlmSelectContent,
  HlmSelectOption,
  HlmSelectTrigger,
  HlmSelectValue,
} from '@fsms/ui/select';
import { HlmIcon } from '@fsms/ui/icon';
import { IProfileInfoInput } from '@fsms/data-access/core';
import { RegistrationService } from '@fsms/data-access/registration';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { HlmAlert, HlmAlertDescription, HlmAlertIcon, HlmAlertTitle } from '@fsms/ui/alert';

interface ProfileInfoFormValue {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
}

@Component({
  selector: 'app-profile-info-step',
  standalone: true,
  imports: [
    NgIcon,
    FormField,
    HlmInput,
    HlmLabel,
    HlmButton,
    BrnSelectImports,
    HlmHint,
    HlmButton,
    HlmFormField,
    HlmSelect,
    HlmSelectTrigger,
    HlmError,
    BrnSelect,
    HlmSelectContent,
    HlmSelectOption,
    HlmSelectValue,
    HlmIcon,
    HlmFormControl,
    HlmPrefix,
    HlmAlert,
    HlmAlertIcon,
    HlmAlertTitle,
    HlmAlertDescription,
  ],
  providers: [provideIcons({ lucideMail, lucideChevronRight, lucideUser, lucideTriangleAlert })],
  templateUrl: './profile-info-step.html',
})
export class ProfileInfoStep {
  registrationId = model<string | undefined>();
  formSubmitted = output<void>();
  registrationService = inject(RegistrationService);
  fieldErrors = input<Record<string, string[]>>({});

  jobTitles = signal([
    { id: 'registrar', label: 'Registrar' },
    { id: 'dean', label: 'Dean' },
    { id: 'director', label: 'Director' },
    { id: 'administrator', label: 'Administrator' },
    { id: 'president', label: 'President' },
    { id: 'vice-president', label: 'Vice President' },
  ]);

  formValue = model<ProfileInfoFormValue>({
    firstName: '',
    lastName: '',
    jobTitle: '',
    email: '',
  });

  public readonly profileInfoForm = form<ProfileInfoFormValue>(
    this.formValue,
    (schemaPath) => {
      required(schemaPath.firstName, { message: 'First name is required' });
      required(schemaPath.lastName, { message: 'Last name is required' });
      required(schemaPath.jobTitle, { message: 'Job title is required' });
      required(schemaPath.email, { message: 'Email is required' });
      email(schemaPath.email, { message: 'Please enter a valid email' });
    },
  );

  submitting = computed(() => this.profileInfoForm().submitting());

  submitProfileInfoForm = async (
    profileInfoForm: FieldTree<ProfileInfoFormValue>,
  ) => {
    try {
      const result = await lastValueFrom(
        this.registrationService.submitProfileInfo(
          profileInfoForm().value(),
          this.registrationId() ?? undefined,
        ),
      );
      if (result.registrationId) {
        this.registrationId.set(result.registrationId);
        this.formSubmitted.emit()
      }
      return undefined;
    } catch (e) {
      const errorMessage = (e as HttpErrorResponse).message;
      return [
        {
          fieldTree: profileInfoForm,
          kind: 'server',
          message: errorMessage || 'An error occurred',
        },
      ];
    }
  };

  async handleSubmit(event: Event) {
    event.preventDefault();
    await submit(this.profileInfoForm, this.submitProfileInfoForm);
  }
}
