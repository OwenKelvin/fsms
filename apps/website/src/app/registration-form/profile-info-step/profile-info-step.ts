import { Component, model, output, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideMail, lucideUser } from '@ng-icons/lucide';
import { email, form, FormField, required } from '@angular/forms/signals';
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
  ],
  providers: [provideIcons({ lucideMail, lucideChevronRight, lucideUser })],
  templateUrl: './profile-info-step.html',
})
export class ProfileInfoStep {
  next = output<void>();

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

  isValid = model<boolean>(false);

  onSubmit($event: Event) {
    $event.preventDefault();
    if (this.profileInfoForm().valid()) {
      this.next.emit();
    }
  }
}
