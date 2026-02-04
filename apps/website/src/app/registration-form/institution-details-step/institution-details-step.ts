import { Component, input, model, output, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { HlmButton } from '@fsms/ui/button';
import { HlmInput } from '@fsms/ui/input';
import { HlmLabel } from '@fsms/ui/label';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight, lucideFingerprint, lucideGlobe, lucideMapPin } from '@ng-icons/lucide';
import { HlmIcon } from '@fsms/ui/icon';
import { HlmError, HlmFormControl, HlmFormField, HlmHint, HlmPrefix } from '@fsms/ui/form-field';
import { HlmSelect, HlmSelectContent, HlmSelectOption, HlmSelectTrigger, HlmSelectValue } from '@fsms/ui/select';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { IInstitutionDetailsInput } from '@fsms/data-access/core';

interface InstitutionDetailsFormValue {
  legalName: string;
  institutionType: string;
  accreditationNumber: string;
  streetAddress: string;
  city: string;
  stateProvince: string;
  zipPostalCode: string;
  officialWebsite: string;
}

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
  submitForm = output<IInstitutionDetailsInput>();
  back = output<void>();
  isLoading = input<boolean>(false);
  fieldErrors = input<Record<string, string[]>>({});

  institutionTypes = signal([
    { id: 'University', label: 'University' },
    { id: 'College', label: 'College' },
    { id: 'Technical', label: 'Technical Institute' },
    { id: 'community', label: 'Community College' },
    { id: 'vocational', label: 'Vocational School' },
  ]);

  formValue = model<InstitutionDetailsFormValue>({
    legalName: '',
    institutionType: '',
    accreditationNumber: '',
    streetAddress: '',
    city: '',
    stateProvince: '',
    zipPostalCode: '',
    officialWebsite: '',
  });

  public readonly institutionDetailsForm = form<InstitutionDetailsFormValue>(
    this.formValue,
    (schemaPath) => {
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
    },
  );

  isValid = model<boolean>();

  async handleSubmit(event: Event) {
    event.preventDefault();
    await submit(this.institutionDetailsForm, async () => {
      const formData = this.institutionDetailsForm().value();
      // Map institutionType to the enum format expected by the API
      const apiData: IInstitutionDetailsInput = {
        ...formData,
        institutionType: formData.institutionType as any, // Type assertion for enum
      };
      this.submitForm.emit(apiData);
      return undefined;
    });
  }
}
