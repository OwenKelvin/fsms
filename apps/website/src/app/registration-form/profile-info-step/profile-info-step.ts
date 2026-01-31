import { Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideMail } from '@ng-icons/lucide';
import { FormField } from '@angular/forms/signals';
import { BrnSelectImports } from '@spartan-ng/brain/select';

import { HlmButton } from '@fsms/ui/button';
import { HlmInput } from '@fsms/ui/input';
import { HlmLabel } from '@fsms/ui/label';

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
    HlmButton,
  ],
  providers: [provideIcons({ lucideMail, lucideChevronRight })],
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label hlmLabel for="firstName">First Name</label>
            <input
              hlmInput
              id="firstName"
              type="text"
              [formField]="form().firstName"
              placeholder="e.g. John"
              class="w-full"
            />
            @if (form().firstName().touched() && form().firstName().invalid()) {
              <p class="text-xs text-red-600">
                @for (error of form().firstName().errors(); track error) {
                  {{ error.message }}
                }
              </p>
            }
          </div>

          <div class="space-y-2">
            <label hlmLabel for="lastName">Last Name</label>
            <input
              hlmInput
              id="lastName"
              type="text"
              [formField]="form().lastName"
              placeholder="e.g. Smith"
              class="w-full"
            />
            @if (form().lastName().touched() && form().lastName().invalid()) {
              <p class="text-xs text-red-600">
                @for (error of form().lastName().errors(); track error) {
                  {{ error.message }}
                }
              </p>
            }
          </div>
        </div>

        <!-- Job Title / Role -->
        <div class="space-y-2">
          <label hlmLabel for="jobTitle">Job Title / Role</label>
          <select
            [formField]="form().jobTitle"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select your role</option>
            <option value="registrar">Registrar</option>
            <option value="dean">Dean</option>
            <option value="director">Director</option>
            <option value="administrator">Administrator</option>
            <option value="president">President</option>
            <option value="vice-president">Vice President</option>
          </select>
          @if (form().jobTitle().touched() && form().jobTitle().invalid()) {
            <p class="text-xs text-red-600">
              @for (error of form().jobTitle().errors(); track error) {
                {{ error.message }}
              }
            </p>
          }
        </div>

        <!-- Professional Email Address -->
        <div class="space-y-2">
          <label hlmLabel for="email">Professional Email Address</label>
          <div class="relative">
            <ng-icon
              name="lucideMail"
              size="18"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              hlmInput
              id="email"
              type="email"
              [formField]="form().email"
              placeholder="john.smith@university.edu"
              class="w-full pl-10"
            />
          </div>
          @if (form().email().touched() && form().email().invalid()) {
            <p class="text-xs text-red-600">
              @for (error of form().email().errors(); track error) {
                {{ error.message }}
              }
            </p>
          } @else {
            <p class="text-xs text-muted-foreground">
              Please use your official institutional email address for
              verification.
            </p>
          }
        </div>

        <!-- Form Actions -->
        <div class="flex items-center justify-between pt-8">
          <p class="text-sm italic text-muted-foreground">
            All fields are required
          </p>

          <button
            hlmBtn
            type="button"
            (click)="next.emit()"
            [disabled]="!isValid()"
            class="flex items-center gap-2"
          >
            Save & Continue
            <ng-icon name="lucideChevronRight" size="18" />
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ProfileInfoStep {
  form = input.required<any>();
  isValid = input.required<boolean>();
  next = output<void>();
}
