import { Component, computed, input, model, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheckCircle,
  lucideChevronLeft,
  lucideLock,
  lucideShieldCheck,
  lucideUser,
} from '@ng-icons/lucide';
import { form, FormField, minLength, required, submit, validate } from '@angular/forms/signals';
import { HlmLabel } from '@fsms/ui/label';
import { HlmInput } from '@fsms/ui/input';
import { HlmButton } from '@fsms/ui/button';
import { HlmError, HlmFormControl, HlmHint, HlmPrefix } from '@fsms/ui/form-field';
import { IAdminCredentialsInput } from '@fsms/data-access/core';

interface AdminCredentialsFormValue {
  username: string;
  password: string;
  confirmPassword: string;
  enableTwoFactor: boolean;
}

@Component({
  selector: 'app-admin-credentials-step',
  standalone: true,
  imports: [
    NgIcon,
    FormField,
    HlmLabel,
    HlmInput,
    HlmButton,
    HlmFormControl,
    HlmPrefix,
    HlmError,
    HlmHint,
  ],
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
    <form (submit)="handleSubmit($event)">
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
            <hlm-form-control>
              <hlm-prefix>
                <span class="text-muted-foreground text-sm">&#64;</span>
              </hlm-prefix>
              <input
                hlmInput
                id="username"
                type="text"
                [formField]="adminCredentialsForm.username"
                placeholder="Enter username"
                class="w-full"
              />
            </hlm-form-control>

            @for (
                error of adminCredentialsForm.username().errors();
              track error
              ) {
              <hlm-error>{{ error.message }}</hlm-error>
            }

            <hlm-hint>
              Must be unique and at least 6 characters.
            </hlm-hint>
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
                [formField]="adminCredentialsForm.password"
                placeholder="••••••••"
                class="w-full"
              />
              @for (
                  error of adminCredentialsForm.password().errors();
                track error
                ) {
                <hlm-error>{{ error.message }}</hlm-error>
              }
            </div>

            <div class="space-y-2">
              <label hlmLabel for="confirmPassword">Confirm Password</label>
              <input
                hlmInput
                id="confirmPassword"
                type="password"
                [formField]="adminCredentialsForm.confirmPassword"
                placeholder="••••••••"
                class="w-full"
              />
              @for (
                  error of adminCredentialsForm.confirmPassword().errors();
                track error
                ) {
                <hlm-error>{{ error.message }}</hlm-error>
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
                [formField]="adminCredentialsForm.enableTwoFactor"
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
            type="submit"
            [disabled]="!adminCredentialsForm().valid() || isLoading()"
            class="flex items-center gap-2"
          >
            @if (isLoading()) {
              Submitting...
            } @else {
              Submit Registration
              <ng-icon name="lucideCheckCircle" size="18" />
            }
          </button>
        </div>
      </div>
    </form>
  `,
})
export class AdminCredentialsStep {
  submitForm = output<IAdminCredentialsInput>();
  back = output<void>();
  isLoading = input<boolean>(false);

  formValue = model<AdminCredentialsFormValue>({
    username: '',
    password: '',
    confirmPassword: '',
    enableTwoFactor: true,
  });

  public readonly adminCredentialsForm = form<AdminCredentialsFormValue>(
    this.formValue,
    (schemaPath) => {
      required(schemaPath.username, { message: 'Username is required' });
      minLength(schemaPath.username, 6, {
        message: 'Username must be at least 6 characters',
      });
      required(schemaPath.password, { message: 'Password is required' });
      minLength(schemaPath.password, 8, {
        message: 'Password must be at least 8 characters',
      });
      required(schemaPath.confirmPassword, {
        message: 'Please confirm your password',
      });
      validate(schemaPath.confirmPassword, ({ value, valueOf }) => {
        if (value() !== valueOf(schemaPath.password)) {
          return {
            kind: 'mismatch',
            message: 'Passwords do not match',
          };
        }
        return undefined;
      });
    },
  );

  passwordStrength = computed(() => {
    const pwd = this.adminCredentialsForm.password().value() || '';
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

  isValid = model<boolean>();

  async handleSubmit(event: Event) {
    event.preventDefault();
    await submit(this.adminCredentialsForm, async () => {
      const formData = this.adminCredentialsForm().value();
      // Map to API format
      const apiData: IAdminCredentialsInput = {
        username: formData.username,
        password: formData.password,
        passwordConfirmation: formData.confirmPassword,
        enableTwoFactor: formData.enableTwoFactor,
      };
      this.submitForm.emit(apiData);
      return undefined;
    });
  }
}
