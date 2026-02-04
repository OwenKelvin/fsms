import { Component, computed, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBuilding2,
  lucideCheck,
  lucideFileText,
  lucideShieldCheck,
  lucideUser,
} from '@ng-icons/lucide';
import { HlmButton } from '@fsms/ui/button';
import { ProfileInfoStep } from './profile-info-step/profile-info-step';
import { InstitutionDetailsStep } from './institution-details-step/institution-details-step';
import { DocumentsStep } from './documents-step/documents-step';
import { AdminCredentialsStep } from './admin-credentials-step/admin-credentials-step';
import { Header } from '../header/header';
import { RegistrationService } from '@fsms/data-access/registration';
import {
  IAdminCredentialsInput,
  IDocumentType,
  IInstitutionDetailsInput,
  IProfileInfoInput,
} from '@fsms/data-access/core';

interface Step {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  completed: boolean;
}

interface ProfileInfoFormValue {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
}

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

interface DocumentsFormValue {
  accreditationCertificate: File | null;
  operatingLicense: File | null;
}

interface AdminCredentialsFormValue {
  username: string;
  password: string;
  confirmPassword: string;
  enableTwoFactor: boolean;
}

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [
    NgIcon,
    HlmButton,
    ProfileInfoStep,
    InstitutionDetailsStep,
    DocumentsStep,
    AdminCredentialsStep,
    Header,
  ],
  providers: [
    RegistrationService,
    provideIcons({
      lucideCheck,
      lucideUser,
      lucideBuilding2,
      lucideFileText,
      lucideShieldCheck,
    }),
  ],
  templateUrl: './registration-form.html',
})
export default class RegistrationForm {
  private registrationService = inject(RegistrationService);

  currentStep = signal(0);
  registrationId = signal<number | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  fieldErrors = signal<Record<string, string[]>>({});

  steps = signal<Step[]>([
    {
      id: 'profile',
      title: 'Profile Info',
      subtitle: 'Personal details',
      icon: 'lucideUser',
      completed: false,
    },
    {
      id: 'institution',
      title: 'Institution Details',
      subtitle: 'Official information',
      icon: 'lucideBuilding2',
      completed: false,
    },
    {
      id: 'documents',
      title: 'Documents',
      subtitle: 'Upload verification',
      icon: 'lucideFileText',
      completed: false,
    },
    {
      id: 'credentials',
      title: 'Admin Credentials',
      subtitle: 'Access setup',
      icon: 'lucideShieldCheck',
      completed: false,
    },
  ]);

  profileInfoValue = signal<ProfileInfoFormValue>({
    firstName: '',
    lastName: '',
    jobTitle: '',
    email: '',
  });
  profileInfoValid = signal(false);

  institutionDetailsValue = signal<InstitutionDetailsFormValue>({
    legalName: '',
    institutionType: '',
    accreditationNumber: '',
    streetAddress: '',
    city: '',
    stateProvince: '',
    zipPostalCode: '',
    officialWebsite: '',
  });
  institutionDetailsValid = signal(false);

  documentsValue = signal<DocumentsFormValue>({
    accreditationCertificate: null,
    operatingLicense: null,
  });
  documentsValid = signal(false);

  adminCredentialsValue = signal<AdminCredentialsFormValue>({
    username: '',
    password: '',
    confirmPassword: '',
    enableTwoFactor: true,
  });
  adminCredentialsValid = signal(false);

  registrationFormData = computed(() => ({
    ...this.profileInfoValue(),
    ...this.institutionDetailsValue(),
    ...this.documentsValue(),
    ...this.adminCredentialsValue(),
  }));

  currentStepValid = computed(() => {
    const step = this.currentStep();
    switch (step) {
      case 0:
        return this.profileInfoValid();
      case 1:
        return this.institutionDetailsValid();
      case 2:
        return this.documentsValid();
      case 3:
        return this.adminCredentialsValid();
      default:
        return false;
    }
  });

  nextStep() {
    if (this.currentStep() < this.steps().length - 1) {
      this.steps.update((steps) => {
        const newSteps = [...steps];
        newSteps[this.currentStep()].completed = true;
        return newSteps;
      });
      this.currentStep.update((step) => step + 1);
    }
  }

  previousStep() {
    if (this.currentStep() > 0) {
      this.currentStep.update((step) => step - 1);
    }
  }

  saveAndContinue() {
    if (this.currentStepValid()) {
      this.nextStep();
    }
  }

  saveAndExit() {
    console.log('Saving and exiting:', this.registrationFormData());
    // TODO: Implement save draft functionality
  }

  onProfileInfoSubmit(data: IProfileInfoInput) {
    this.isLoading.set(true);
    this.error.set(null);
    this.fieldErrors.set({});

    this.registrationService
      .submitProfileInfo(data, this.registrationId() ?? undefined)
      .subscribe({
        next: (response) => {
          if (response.registrationId) {
            this.registrationId.set(response.registrationId);
          }
          this.profileInfoValue.set(data);
          this.isLoading.set(false);
          this.nextStep();
        },
        error: (err) => {
          this.isLoading.set(false);
          
          // Handle structured validation errors
          if (err.validationErrors) {
            this.fieldErrors.set(err.validationErrors);
            this.error.set('Please fix the validation errors below');
          } else {
            this.error.set(err.message || 'Failed to submit profile information');
          }
          console.error('Profile info submission error:', err);
        },
      });
  }

  onInstitutionDetailsSubmit(data: IInstitutionDetailsInput) {
    const regId = this.registrationId();
    if (!regId) {
      this.error.set('Registration ID not found. Please start from step 1.');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.fieldErrors.set({});

    this.registrationService.submitInstitutionDetails(regId, data).subscribe({
      next: (response) => {
        // Map the API response back to form value format
        this.institutionDetailsValue.set({
          ...data,
          officialWebsite: data.officialWebsite || '',
        });
        this.isLoading.set(false);
        this.nextStep();
      },
      error: (err) => {
        this.isLoading.set(false);
        
        if (err.validationErrors) {
          this.fieldErrors.set(err.validationErrors);
          this.error.set('Please fix the validation errors below');
        } else {
          this.error.set(err.message || 'Failed to submit institution details');
        }
        console.error('Institution details submission error:', err);
      },
    });
  }

  onDocumentsSubmit(data: DocumentsFormValue) {
    const regId = this.registrationId();
    if (!regId) {
      this.error.set('Registration ID not found. Please start from step 1.');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.fieldErrors.set({});

    // Upload accreditation certificate
    const accreditationUpload$ = data.accreditationCertificate
      ? this.registrationService.uploadDocument(data.accreditationCertificate, {
          registrationId: regId,
          documentType: IDocumentType.AccreditationCertificate,
        })
      : null;

    // Upload operating license
    const licenseUpload$ = data.operatingLicense
      ? this.registrationService.uploadDocument(data.operatingLicense, {
          registrationId: regId,
          documentType: IDocumentType.OperatingLicense,
        })
      : null;

    // Upload both documents
    const uploads = [accreditationUpload$, licenseUpload$].filter(Boolean);

    if (uploads.length === 0) {
      this.error.set('Please upload at least one document');
      this.isLoading.set(false);
      return;
    }

    // Use a simple counter to track uploads
    let completed = 0;
    const total = uploads.length;
    let hasError = false;

    uploads.forEach((upload$) => {
      upload$!.subscribe({
        next: () => {
          completed++;
          if (completed === total && !hasError) {
            this.documentsValue.set(data);
            this.isLoading.set(false);
            this.nextStep();
          }
        },
        error: (err) => {
          if (!hasError) {
            hasError = true;
            this.isLoading.set(false);
            
            if (err.validationErrors) {
              this.fieldErrors.set(err.validationErrors);
              this.error.set('Please fix the validation errors below');
            } else {
              this.error.set(err.message || 'Failed to upload documents');
            }
            console.error('Document upload error:', err);
          }
        },
      });
    });
  }

  onAdminCredentialsSubmit(data: IAdminCredentialsInput) {
    const regId = this.registrationId();
    if (!regId) {
      this.error.set('Registration ID not found. Please start from step 1.');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.fieldErrors.set({});

    this.registrationService.submitAdminCredentials(regId, data).subscribe({
      next: (response) => {
        // Map back to form value format
        this.adminCredentialsValue.set({
          username: data.username,
          password: data.password,
          confirmPassword: data.passwordConfirmation,
          enableTwoFactor: data.enableTwoFactor || true,
        });
        this.isLoading.set(false);
        // Mark the last step as completed
        this.steps.update((steps) => {
          const newSteps = [...steps];
          newSteps[this.currentStep()].completed = true;
          return newSteps;
        });
        // TODO: Navigate to success page or show success message
        console.log('Registration completed successfully!', response);
      },
      error: (err) => {
        this.isLoading.set(false);
        
        if (err.validationErrors) {
          this.fieldErrors.set(err.validationErrors);
          this.error.set('Please fix the validation errors below');
        } else {
          this.error.set(err.message || 'Failed to submit admin credentials');
        }
        console.error('Admin credentials submission error:', err);
      },
    });
  }

  submitRegistration() {
    // This method is now handled by onAdminCredentialsSubmit
    console.log('Submitting registration:', this.registrationFormData());
  }

  getFieldErrorKeys(): string[] {
    return Object.keys(this.fieldErrors());
  }
}
