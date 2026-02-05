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
  IInstitutionType,
} from '@fsms/data-access/core';
import { HlmIcon } from '@fsms/ui/icon';

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
    HlmIcon,
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
  currentStep = signal(0);
  registrationId = signal<string | null>(null);

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

  institutionDetailsValue = signal<Required<IInstitutionDetailsInput>>({
    legalName: '',
    institutionType: IInstitutionType.University,
    accreditationNumber: '',
    streetAddress: '',
    city: '',
    stateProvince: '',
    zipPostalCode: '',
    officialWebsite: '',
  });

  documentsValue = signal<DocumentsFormValue>({
    accreditationCertificate: null,
    operatingLicense: null,
  });

  adminCredentialsValue = signal<AdminCredentialsFormValue>({
    username: '',
    password: '',
    confirmPassword: '',
    enableTwoFactor: true,
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

  saveAndExit() {
    // console.log('Saving and exiting:', this.registrationFormData());
    // TODO: Implement save draft functionality
  }

  onProfileInfoSubmit() {
    this.nextStep();
  }

  onInstitutionDetailsSubmit() {
    this.nextStep();
  }

  onDocumentsSubmit() {
    this.nextStep();
  }

  onAdminCredentialsSubmit() {
    // Mark the last step as completed
    this.steps.update((steps) => {
      const newSteps = [...steps];
      newSteps[this.currentStep()].completed = true;
      return newSteps;
    });
    // TODO: Navigate to success page or show success message
    console.log('Registration completed successfully!');
  }
}
