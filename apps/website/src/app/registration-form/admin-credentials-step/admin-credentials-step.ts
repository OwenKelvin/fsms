import { Component, computed, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheckCircle,
  lucideChevronLeft,
  lucideLock,
  lucideShieldCheck,
  lucideUser,
} from '@ng-icons/lucide';
import { FormField } from '@angular/forms/signals';
import { HlmLabel } from '@fsms/ui/label';
import { HlmInput } from '@fsms/ui/input';
import { HlmButton } from '@fsms/ui/button';

@Component({
  selector: 'app-admin-credentials-step',
  standalone: true,
  imports: [NgIcon, FormField, HlmLabel, HlmInput, HlmButton],
  providers: [
    provideIcons({
      lucideUser,
      lucideLock,
      lucideShieldCheck,
      lucideChevronLeft,
      lucideCheckCircle,
    }),
  ],
  template: `
    <div>
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Admin Credentials</h1>
        <p class="text-muted-foreground">
          Step 4 of 4: Set up the primary administrative account to manage your
          institution's portal.
        </p>
      </div>

      <!-- Form -->
      <div class="space-y-8">
        <!-- ACCOUNT IDENTITY Section -->
        <section class="space-y-6">
          <div
            class="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
          >
            <ng-icon name="lucideUser" size="18" />
            <span>ACCOUNT IDENTITY</span>
          </div>

          <!-- Username -->
          <div class="space-y-2">
            <label hlmLabel for="username">Username</label>
            <div class="relative">
              <span
                class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm"
                >&#64;</span
              >
              <input
                hlmInput
                id="username"
                type="text"
                [formField]="form().username"
                placeholder="admin_metrouni"
                class="w-full pl-8"
              />
            </div>
            @if (form().username().touched() && form().username().invalid()) {
              <p class="text-xs text-red-600">
                @for (error of form().username().errors(); track error) {
                  {{ error.message }}
                }
              </p>
            } @else {
              <p class="text-xs text-muted-foreground">
                Must be unique and at least 6 characters.
              </p>
            }
          </div>
        </section>

        <!-- SECURITY Section -->
        <section class="space-y-6">
          <div
            class="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
          >
            <ng-icon name="lucideLock" size="18" />
            <span>SECURITY</span>
          </div>

          <!-- Password & Confirm Password -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label hlmLabel for="password">Password</label>
              <input
                hlmInput
                id="password"
                type="password"
                [formField]="form().password"
                placeholder="••••••••"
                class="w-full"
              />
              @if (form().password().touched() && form().password().invalid()) {
                <p class="text-xs text-red-600">
                  @for (error of form().password().errors(); track error) {
                    {{ error.message }}
                  }
                </p>
              }
            </div>

            <div class="space-y-2">
              <label hlmLabel for="confirmPassword">Confirm Password</label>
              <input
                hlmInput
                id="confirmPassword"
                type="password"
                [formField]="form().confirmPassword"
                placeholder="••••••••"
                class="w-full"
              />
              @if (
                form().confirmPassword().touched() &&
                form().confirmPassword().invalid()
              ) {
                <p class="text-xs text-red-600">
                  @for (
                    error of form().confirmPassword().errors();
                    track error
                  ) {
                    {{ error.message }}
                  }
                </p>
              }
              @if (
                form().password().value() !==
                  form().confirmPassword().value() &&
                form().confirmPassword().touched()
              ) {
                <p class="text-xs text-red-600">Passwords do not match</p>
              }
            </div>
          </div>

          <!-- Password Strength -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span
                class="font-medium"
                [class.text-green-600]="passwordStrength() >= 65"
              >
                {{ passwordStrengthLabel() }}
              </span>
              <span class="text-muted-foreground"
                >{{ passwordStrength() }}%</span
              >
            </div>
            <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full transition-all duration-300 rounded-full"
                [class.bg-red-500]="passwordStrength() < 35"
                [class.bg-yellow-500]="
                  passwordStrength() >= 35 && passwordStrength() < 65
                "
                [class.bg-green-500]="passwordStrength() >= 65"
                [style.width.%]="passwordStrength()"
              ></div>
            </div>
          </div>

          <!-- Two-Factor Authentication -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <input
                type="checkbox"
                [formField]="form().enableTwoFactor"
                class="mt-0.5"
              />
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-medium text-sm"
                    >Enable Two-Factor Authentication (Recommended)</span
                  >
                  <span
                    class="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded"
                  >
                    HIGHLY SECURE
                  </span>
                </div>
                <p class="text-xs text-muted-foreground">
                  Protect your account with an extra layer of security. We will
                  send a code to your mobile device or email whenever you log
                  in.
                </p>
              </div>
            </div>
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
            Back to Documents
          </button>

          <button
            hlmBtn
            type="button"
            (click)="submitted.emit()"
            [disabled]="!isValid()"
            class="flex items-center gap-2"
          >
            Submit Registration
            <ng-icon name="lucideCheckCircle" size="18" />
          </button>
        </div>
      </div>
    </div>
  `,
})
export class AdminCredentialsStep {
  form = input.required<any>();
  isValid = input.required<boolean>();
  submitted = output<void>();
  back = output<void>();

  passwordStrength = computed(() => {
    const pwd = this.form().password().value() || '';
    let strength = 0;

    if (pwd.length >= 8) strength += 25;
    if (pwd.length >= 12) strength += 15;
    if (/[a-z]/.test(pwd)) strength += 15;
    if (/[A-Z]/.test(pwd)) strength += 15;
    if (/[0-9]/.test(pwd)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 15;

    return Math.min(strength, 100);
  });

  passwordStrengthLabel = computed(() => {
    const strength = this.passwordStrength();
    if (strength < 35) return 'WEAK PASSWORD';
    if (strength < 65) return 'MODERATE PASSWORD';
    return 'STRONG PASSWORD';
  });
}
