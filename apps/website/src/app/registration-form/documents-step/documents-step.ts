import { Component, effect, input, model, output, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideAward,
  lucideChevronLeft,
  lucideChevronRight,
  lucideScale,
  lucideUploadCloud,
} from '@ng-icons/lucide';
import { NgClass } from '@angular/common';
import { HlmButton } from '@fsms/ui/button';
import { form, required, submit } from '@angular/forms/signals';
import { HlmError } from '@fsms/ui/form-field';

interface DocumentsFormValue {
  accreditationCertificate: File | null;
  operatingLicense: File | null;
}

@Component({
  selector: 'app-documents-step',
  standalone: true,
  imports: [NgIcon, NgClass, HlmButton, HlmError],
  providers: [
    provideIcons({
      lucideAward,
      lucideScale,
      lucideUploadCloud,
      lucideChevronLeft,
      lucideChevronRight,
    }),
  ],
  template: `
    <form (submit)="handleSubmit($event)">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Verification Documents</h1>
        <p class="text-muted-foreground">
          Step 3 of 4: Please upload the required legal documents to verify your
          institution.
        </p>
      </div>

      <!-- Form -->
      <div class="space-y-8">
        <!-- ACCREDITATION CERTIFICATE -->
        <section class="space-y-4">
          <div class="flex items-center justify-between">
            <div
              class="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
            >
              <ng-icon name="lucideAward" size="18" />
              <span>ACCREDITATION CERTIFICATE</span>
            </div>
            <span
              class="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded"
              >REQUIRED</span
            >
          </div>

          <p class="text-sm text-muted-foreground">
            Official document issued by the national or regional education
            authority.
          </p>

          <!-- Upload Area -->
          <div
            class="border-2 border-dashed rounded-xl p-12 text-center transition-colors"
            [class.border-gray-300]="!accreditationFile()"
            [class.border-primary]="accreditationFile()"
            [ngClass]="{ 'class.bg-primary/5': accreditationFile() }"
          >
            <ng-icon
              name="lucideUploadCloud"
              size="48"
              class="mx-auto mb-4 text-gray-400"
            />
            <p class="text-sm font-medium mb-1">
              @if (accreditationFile()) {
                {{ accreditationFile()?.name }}
              } @else {
                Drag and drop your file here
              }
            </p>
            <p class="text-xs text-muted-foreground mb-4">
              or click to browse your computer
            </p>
            <input
              type="file"
              #accreditationInput
              (change)="onFileSelected($event, 'accreditation')"
              accept=".pdf,.jpg,.png"
              class="hidden"
            />
            <button
              hlmBtn
              variant="outline"
              type="button"
              (click)="accreditationInput.click()"
            >
              Browse Files
            </button>
            <p class="text-xs text-muted-foreground mt-4">
              PDF, JPG, PNG · MAX 10MB
            </p>
          </div>
          @if (
            documentsForm.accreditationCertificate().touched() &&
            documentsForm.accreditationCertificate().invalid()
          ) {
            <p class="text-xs text-red-600">
              @for (
                error of documentsForm.accreditationCertificate().errors();
                track error
              ) {
                {{ error.message }}
              }
            </p>
          }
        </section>

        <!-- LEGAL OPERATING LICENSE -->
        <section class="space-y-4">
          <div class="flex items-center justify-between">
            <div
              class="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
            >
              <ng-icon name="lucideScale" size="18" />
              <span>LEGAL OPERATING LICENSE</span>
            </div>
            <span
              class="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded"
              >REQUIRED</span
            >
          </div>

          <p class="text-sm text-muted-foreground">
            Current business license or legal permit allowing educational
            activities.
          </p>

          <!-- Upload Area -->
          <div
            class="border-2 border-dashed rounded-xl p-12 text-center transition-colors"
            [class.border-gray-300]="!licenseFile()"
            [class.border-primary]="licenseFile()"
            [ngClass]="{ 'class.bg-primary/5': licenseFile() }"
          >
            <ng-icon
              name="lucideUploadCloud"
              size="48"
              class="mx-auto mb-4 text-gray-400"
            />
            <p class="text-sm font-medium mb-1">
              @if (licenseFile()) {
                {{ licenseFile()?.name }}
              } @else {
                Drag and drop your file here
              }
            </p>
            <p class="text-xs text-muted-foreground mb-4">
              or click to browse your computer
            </p>
            <input
              type="file"
              #licenseInput
              (change)="onFileSelected($event, 'license')"
              accept=".pdf,.jpg,.png"
              class="hidden"
            />
            <button
              hlmBtn
              variant="outline"
              type="button"
              (click)="licenseInput.click()"
            >
              Browse Files
            </button>
            <p class="text-xs text-muted-foreground mt-4">
              PDF, JPG, PNG · MAX 10MB
            </p>
          </div>
          @for (
              error of documentsForm.operatingLicense().errors();
            track error
            ) {
            <hlm-error>{{ error.message }}</hlm-error>
          }
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
            Back to Institution Details
          </button>

          <button
            hlmBtn
            type="submit"
            [disabled]="!documentsForm().valid() || isLoading()"
            class="flex items-center gap-2"
          >
            @if (isLoading()) {
              Uploading...
            } @else {
              Save & Continue
              <ng-icon name="lucideChevronRight" size="18" />
            }
          </button>
        </div>
      </div>
    </form>
  `,
})
export class DocumentsStep {
  submitForm = output<DocumentsFormValue>();
  back = output<void>();
  isLoading = input<boolean>(false);

  accreditationFile = signal<File | null>(null);
  licenseFile = signal<File | null>(null);
  formValue = model<DocumentsFormValue>({
    accreditationCertificate: null,
    operatingLicense: null,
  });

  public readonly documentsForm = form<DocumentsFormValue>(
    this.formValue,
    (schemaPath) => {
      required(schemaPath.accreditationCertificate, {
        message: 'Accreditation certificate is required',
      });
      required(schemaPath.operatingLicense, {
        message: 'Operating license is required',
      });
    },
  );

  isValid = model<boolean>();

  onFileSelected(event: Event, type: 'accreditation' | 'license') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (type === 'accreditation') {
        this.accreditationFile.set(file);
        this.documentsForm.accreditationCertificate().value.set(file);
      } else {
        this.licenseFile.set(file);
        this.documentsForm.operatingLicense().value.set(file);
      }
    }
  }

  async handleSubmit(event: Event) {
    event.preventDefault();
    await submit(this.documentsForm, async () => {
      const formData = this.documentsForm().value();
      this.submitForm.emit(formData);
      return undefined;
    });
  }
}
