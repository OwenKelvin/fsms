import { Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideFingerprint,
  lucideGlobe,
  lucideMapPin,
} from '@ng-icons/lucide';
import { FormField } from '@angular/forms/signals';
import { HlmButton } from '@fsms/ui/button';
import { HlmInput } from '@fsms/ui/input';
import { HlmLabel } from '@fsms/ui/label';

@Component({
  selector: 'app-institution-details-step',
  standalone: true,
  imports: [NgIcon, FormField, HlmButton, HlmInput, HlmLabel],
  providers: [
    provideIcons({
      lucideFingerprint,
      lucideMapPin,
      lucideGlobe,
      lucideChevronLeft,
      lucideChevronRight,
    }),
  ],
  template: `
    <div>
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Institution Details</h1>
        <p class="text-muted-foreground">
          Step 2 of 4: Please provide the legal identification and location of
          your entity.
        </p>
      </div>

      <!-- Form -->
      <div class="space-y-8">
        <!-- IDENTIFICATION Section -->
        <section class="space-y-6">
          <div
            class="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
          >
            <ng-icon name="lucideFingerprint" size="18" />
            <span>IDENTIFICATION</span>
          </div>

          <!-- Institution Legal Name -->
          <div class="space-y-2">
            <label hlmLabel for="legalName">Institution Legal Name</label>
            <input
              hlmInput
              id="legalName"
              type="text"
              [formField]="form().legalName"
              placeholder="e.g. Metropolitan University of Technology"
              class="w-full"
            />
            @if (form().legalName().touched() && form().legalName().invalid()) {
              <p class="text-xs text-red-600">
                @for (error of form().legalName().errors(); track error) {
                  {{ error.message }}
                }
              </p>
            }
          </div>

          <!-- Institution Type & Accreditation Number -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label hlmLabel for="institutionType">Institution Type</label>
              <select
                [formField]="form().institutionType"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select type</option>
                <option value="university">University</option>
                <option value="college">College</option>
                <option value="technical">Technical Institute</option>
                <option value="community">Community College</option>
                <option value="vocational">Vocational School</option>
              </select>
              @if (
                form().institutionType().touched() &&
                form().institutionType().invalid()
              ) {
                <p class="text-xs text-red-600">
                  @for (
                    error of form().institutionType().errors();
                    track error
                  ) {
                    {{ error.message }}
                  }
                </p>
              }
            </div>

            <div class="space-y-2">
              <label hlmLabel for="accreditationNumber"
                >Accreditation Number</label
              >
              <input
                hlmInput
                id="accreditationNumber"
                type="text"
                [formField]="form().accreditationNumber"
                placeholder="REG-000000"
                class="w-full"
              />
              @if (
                form().accreditationNumber().touched() &&
                form().accreditationNumber().invalid()
              ) {
                <p class="text-xs text-red-600">
                  @for (
                    error of form().accreditationNumber().errors();
                    track error
                  ) {
                    {{ error.message }}
                  }
                </p>
              } @else {
                <p
                  class="text-xs text-muted-foreground flex items-center gap-1"
                >
                  <ng-icon name="lucideFingerprint" size="12" />
                  Found on your Ministry of Education certificate
                </p>
              }
            </div>
          </div>
        </section>

        <!-- LOCATION Section -->
        <section class="space-y-6">
          <div
            class="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
          >
            <ng-icon name="lucideMapPin" size="18" />
            <span>LOCATION</span>
          </div>

          <!-- Street Address -->
          <div class="space-y-2">
            <label hlmLabel for="streetAddress">Street Address</label>
            <input
              hlmInput
              id="streetAddress"
              type="text"
              [formField]="form().streetAddress"
              placeholder="123 Education Plaza"
              class="w-full"
            />
            @if (
              form().streetAddress().touched() &&
              form().streetAddress().invalid()
            ) {
              <p class="text-xs text-red-600">
                @for (error of form().streetAddress().errors(); track error) {
                  {{ error.message }}
                }
              </p>
            }
          </div>

          <!-- City, State, ZIP -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="space-y-2">
              <label hlmLabel for="city">City</label>
              <input
                hlmInput
                id="city"
                type="text"
                [formField]="form().city"
                class="w-full"
              />
              @if (form().city().touched() && form().city().invalid()) {
                <p class="text-xs text-red-600">
                  @for (error of form().city().errors(); track error) {
                    {{ error.message }}
                  }
                </p>
              }
            </div>

            <div class="space-y-2">
              <label hlmLabel for="stateProvince">State / Province</label>
              <input
                hlmInput
                id="stateProvince"
                type="text"
                [formField]="form().stateProvince"
                class="w-full"
              />
              @if (
                form().stateProvince().touched() &&
                form().stateProvince().invalid()
              ) {
                <p class="text-xs text-red-600">
                  @for (error of form().stateProvince().errors(); track error) {
                    {{ error.message }}
                  }
                </p>
              }
            </div>

            <div class="space-y-2">
              <label hlmLabel for="zipPostalCode">ZIP / Postal Code</label>
              <input
                hlmInput
                id="zipPostalCode"
                type="text"
                [formField]="form().zipPostalCode"
                class="w-full"
              />
              @if (
                form().zipPostalCode().touched() &&
                form().zipPostalCode().invalid()
              ) {
                <p class="text-xs text-red-600">
                  @for (error of form().zipPostalCode().errors(); track error) {
                    {{ error.message }}
                  }
                </p>
              }
            </div>
          </div>
        </section>

        <!-- ONLINE PRESENCE Section -->
        <section class="space-y-6">
          <div
            class="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
          >
            <ng-icon name="lucideGlobe" size="18" />
            <span>ONLINE PRESENCE</span>
          </div>

          <!-- Official Website -->
          <div class="space-y-2">
            <label hlmLabel for="officialWebsite">Official Website</label>
            <div class="relative">
              <span
                class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm"
              >
                https://
              </span>
              <input
                hlmInput
                id="officialWebsite"
                type="text"
                [formField]="form().officialWebsite"
                placeholder="www.university.edu"
                class="w-full pl-16"
              />
            </div>
            @if (
              form().officialWebsite().touched() &&
              form().officialWebsite().invalid()
            ) {
              <p class="text-xs text-red-600">
                @for (error of form().officialWebsite().errors(); track error) {
                  {{ error.message }}
                }
              </p>
            }
          </div>
        </section>

        <!-- Form Actions -->
        <div
          class="flex items-center justify-between pt-8 border-t border-gray-200"
        >
          <button
            hlmBtn
            variant="ghost"
            type="button"
            (click)="back.emit()"
            class="flex items-center gap-2"
          >
            <ng-icon name="lucideChevronLeft" size="18" />
            Back to Profile Info
          </button>

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
export class InstitutionDetailsStep {
  form = input.required<any>();
  isValid = input.required<boolean>();
  next = output<void>();
  back = output<void>();
}
