import {
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import {
  FieldTree,
  form,
  FormField,
  required,
  submit,
} from '@angular/forms/signals';
import { HlmButton } from '@fsms/ui/button';
import { HlmInput } from '@fsms/ui/input';
import { HlmLabel } from '@fsms/ui/label';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideFingerprint,
  lucideGlobe,
  lucideMapPin,
} from '@ng-icons/lucide';
import { HlmIcon } from '@fsms/ui/icon';
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
import { BrnSelect, BrnSelectImports } from '@spartan-ng/brain/select';
import {
  formatGraphqlError,
  IInstitutionDetailsInput,
  IInstitutionType
} from '@fsms/data-access/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RegistrationService } from '@fsms/data-access/registration';
import { lastValueFrom, map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-institution-details-step',
  standalone: true,
  imports: [
    NgIcon,
    FormField,
    HlmButton,
    HlmInput,
    HlmLabel,
    HlmIcon,
    HlmFormField,
    HlmError,
    HlmSelect,
    HlmSelectOption,
    HlmHint,
    BrnSelectImports,
    HlmSelectContent,
    HlmSelectTrigger,
    HlmSelectValue,
    HlmFormControl,
    HlmPrefix,
    BrnSelect,
    JsonPipe,
  ],
  providers: [
    provideIcons({
      lucideFingerprint,
      lucideMapPin,
      lucideGlobe,
      lucideChevronLeft,
      lucideChevronRight,
    }),
  ],
  templateUrl: 'institution-details-step.html',
})
export class InstitutionDetailsStep {
  registrationId = input.required<string>();
  formSubmitted = output<void>();
  registrationService = inject(RegistrationService);
  back = output<void>();

  institutionTypes = toSignal(
    this.registrationService
      .getInstitutionTypes()
      .pipe(map((res) => res.data?.institutionTypes ?? [])),
    { initialValue: [] },
  );

  formValue = model<Required<IInstitutionDetailsInput>>({
    legalName: '',
    institutionType: IInstitutionType.University,
    accreditationNumber: '',
    streetAddress: '',
    city: '',
    stateProvince: '',
    zipPostalCode: '',
    officialWebsite: '',
  });

  public readonly institutionDetailsForm = form<
    Required<IInstitutionDetailsInput>
  >(this.formValue, (schemaPath) => {
    required(schemaPath.legalName, {
      message: 'Institution legal name is required',
    });
    required(schemaPath.institutionType, {
      message: 'Institution type is required',
    });
    required(schemaPath.accreditationNumber, {
      message: 'Accreditation number is required',
    });
    required(schemaPath.streetAddress, {
      message: 'Street address is required',
    });
    required(schemaPath.city, { message: 'City is required' });
    required(schemaPath.stateProvince, {
      message: 'State/Province is required',
    });
    required(schemaPath.zipPostalCode, {
      message: 'ZIP/Postal code is required',
    });
    required(schemaPath.officialWebsite, {
      message: 'Official website is required',
    });
  });

  submitting = computed(() => this.institutionDetailsForm().submitting());

  submitProfileInfoForm = async (
    institutionDetailsForm: FieldTree<IInstitutionDetailsInput>,
  ) => {
    try {
      const result = await lastValueFrom(
        this.registrationService.submitInstitutionDetails(
          this.registrationId(),
          institutionDetailsForm().value(),
        ),
      );
      if (result.registrationId) {
        this.formSubmitted.emit();
      }
      return undefined;
    } catch (e) {
      return formatGraphqlError(e, institutionDetailsForm)
    }
  };

  async handleSubmit(event: Event) {
    event.preventDefault();
    await submit(this.institutionDetailsForm, this.submitProfileInfoForm);
  }
}
