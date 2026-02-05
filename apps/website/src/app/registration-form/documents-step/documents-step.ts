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
import {
  lucideAward,
  lucideChevronLeft,
  lucideChevronRight,
  lucideScale,
  lucideTriangleAlert,
  lucideUploadCloud,
} from '@ng-icons/lucide';
import { HlmButton } from '@fsms/ui/button';
import { FieldTree, form, required, submit } from '@angular/forms/signals';
import { HlmError } from '@fsms/ui/form-field';
import {
  formatGraphqlError,
  IDocumentType,
} from '@fsms/data-access/core';
import { RegistrationService } from '@fsms/data-access/registration';
import { forkJoin, lastValueFrom } from 'rxjs';
import { HlmAlert, HlmAlertDescription, HlmAlertIcon, HlmAlertTitle } from '@fsms/ui/alert';
import { HlmIcon } from '@fsms/ui/icon';

interface DocumentsFormValue {
  accreditationCertificate: File | null;
  operatingLicense: File | null;
}

@Component({
  selector: 'app-documents-step',
  standalone: true,
  imports: [
    NgIcon,
    HlmButton,
    HlmError,
    HlmAlert,
    HlmAlertDescription,
    HlmAlertIcon,
    HlmAlertTitle,
    HlmIcon,
  ],
  providers: [
    provideIcons({
      lucideAward,
      lucideScale,
      lucideUploadCloud,
      lucideChevronLeft,
      lucideChevronRight,
      lucideTriangleAlert,
    }),
  ],
  templateUrl: './documents-step.html',
})
export class DocumentsStep {
  formSubmitted = output<void>();
  back = output<void>();
  registrationId = input.required<string>();
  registrationService = inject(RegistrationService);

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

  submitting = computed(() => this.documentsForm().submitting());

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

  submitDocumentsForm = async (
    documentsForm: FieldTree<DocumentsFormValue>,
  ) => {
    const regId = this.registrationId();

    const { accreditationCertificate, operatingLicense } =
      documentsForm().value();

    const uploads$ = [];
    if (accreditationCertificate) {
      uploads$.push(
        this.registrationService.uploadDocument(accreditationCertificate, {
          registrationId: regId,
          documentType: IDocumentType.AccreditationCertificate,
        }),
      );
    }
    if (operatingLicense) {
      uploads$.push(
        this.registrationService.uploadDocument(operatingLicense, {
          registrationId: regId,
          documentType: IDocumentType.OperatingLicense,
        }),
      );
    }

    if (uploads$.length === 0) {
      return [
        {
          fieldTree: documentsForm,
          kind: 'nonFieldErrors',
          message: 'Please upload at least one document.'
        }];
    }

    try {
      await lastValueFrom(forkJoin(uploads$));
      this.formSubmitted.emit();
      return undefined;
    } catch (e) {
      return formatGraphqlError(e, documentsForm);
    }
  };

  async handleSubmit(event: Event) {
    event.preventDefault();
    await submit(this.documentsForm, this.submitDocumentsForm);
  }
}

