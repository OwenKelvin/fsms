import { Component, input, output, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideMail, lucideUser } from '@ng-icons/lucide';
import { FormField } from '@angular/forms/signals';
import { BrnSelect, BrnSelectImports } from '@spartan-ng/brain/select';

import { HlmButton } from '@fsms/ui/button';
import { HlmInput } from '@fsms/ui/input';
import { HlmLabel } from '@fsms/ui/label';
import {
  HlmError,
  HlmFormControl,
  HlmFormField,
  HlmPrefix,
  HlmHint
} from '@fsms/ui/form-field';
import {
  HlmSelect,
  HlmSelectContent,
  HlmSelectOption,
  HlmSelectTrigger,
  HlmSelectValue
} from '@fsms/ui/select';
import { HlmIcon } from '@fsms/ui/icon';

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
  template: `
    <div>
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Profile Information</h1>
        <p class="text-muted-foreground">
          Step 1 of 4: Tell us about yourself. You are registering as the
          primary point of contact for your institution.
        </p>
      </div>

      <!-- Form -->
      <div class="space-y-6">
        <!-- First Name & Last Name -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-8">
          <hlm-form-field>
            <label hlmLabel for="firstName">First Name</label>
            <hlm-form-control>
              <hlm-prefix>
                <ng-icon hlmIcon name="lucideUser" />
              </hlm-prefix>
              <input
                hlmInput
                id="firstName"
                type="text"
                [formField]="form().firstName"
                placeholder="e.g. John"
                class="w-full"
              />
            </hlm-form-control>
            @for (error of form().firstName().errors(); track error) {
              <hlm-error>{{ error.message }}</hlm-error>
            }
          </hlm-form-field>

          <hlm-form-field>
            <label hlmLabel for="lastName">Last Name</label>
            <hlm-form-control>
              <hlm-prefix>
                <ng-icon hlmIcon name="lucideUser" />
              </hlm-prefix>
              <input
                hlmInput
                id="lastName"
                type="text"
                [formField]="form().lastName"
                placeholder="e.g. Smith"
                class="w-full"
              />
            </hlm-form-control>
            @for (error of form().lastName().errors(); track error) {
              <hlm-error>{{ error.message }}</hlm-error>
            }
          </hlm-form-field>

          <!-- Job Title / Role -->
          <hlm-form-field>
            <label hlmLabel for="jobTitle">Job Title / Role</label>
            <hlm-form-control>
              <hlm-prefix>
                <ng-icon name="lucideUser" />
              </hlm-prefix>
              <hlm-select
                class="w-full"
                placeholder="Select your role"
                [formField]="form().jobTitle"
              >
                <hlm-select-trigger class="w-full">
                  <hlm-select-value />
                </hlm-select-trigger>
                <hlm-select-content>
                  @for (jobTitle of jobTitles(); track jobTitle.id) {
                    <hlm-option [value]="$any(jobTitle.id)">{{
                        jobTitle.label
                      }}
                    </hlm-option>
                  }
                </hlm-select-content>
              </hlm-select>
            </hlm-form-control>
            @for (error of form().jobTitle().errors(); track error) {
              <hlm-error>
                {{ error.message }}
              </hlm-error>
            }
          </hlm-form-field>

          <!-- Professional Email Address -->
          <hlm-form-field>
            <label hlmLabel for="email">Professional Email Address</label>
            <hlm-form-control>
              <hlm-prefix>
                <ng-icon
                  hlmIcon
                  name="lucideMail"
                  class="text-muted-foreground"
                />
              </hlm-prefix>
              <input
                hlmInput
                id="email"
                type="email"
                [formField]="form().email"
                placeholder="john.smith@university.edu"
                class="w-full"
              />
            </hlm-form-control>

            @for (error of form().email().errors(); track error) {
              <hlm-error>
                {{ error.message }}
              </hlm-error>
            }

            <hlm-hint>
              Please use your official institutional email address for
              verification.
            </hlm-hint>

          </hlm-form-field>
        </div>

        <!-- Form Actions -->
        <div class="flex items-center justify-between pt-8">
          <p class="text-sm italic text-muted-foreground">
            All fields are required
          </p>

          <div>
            <button
              hlmBtn
              type="button"
              (click)="next.emit()"
              [disabled]="!isValid()"
              class="flex items-center gap-2"
            >
              Save & Continue
              <ng-icon hlmIcon name="lucideChevronRight" size="base" />
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProfileInfoStep {
  form = input.required<any>();
  isValid = input.required<boolean>();
  next = output<void>();

  jobTitles = signal([
    { id: 'registrar', label: 'Registrar' },
    { id: 'dean', label: 'Dean' },
    { id: 'director', label: 'Director' },
    { id: 'administrator', label: 'Administrator' },
    { id: 'president', label: 'President' },
    { id: 'vice-president', label: 'Vice President' },
  ]);
}
