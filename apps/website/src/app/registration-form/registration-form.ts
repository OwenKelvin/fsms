import { Component, computed, signal } from '@angular/core';
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
  currentStep = signal(0);

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
  }

  submitRegistration() {
    if (this.currentStepValid()) {
      console.log('Submitting registration:', this.registrationFormData());
      // Handle submission
    }
  }
}
