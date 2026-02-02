import { Component, computed, signal } from '@angular/core';
import { email, form, minLength, required } from '@angular/forms/signals';
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

interface RegistrationData {
  // Profile Info
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;

  // Institution Details
  legalName: string;
  institutionType: string;
  accreditationNumber: string;
  streetAddress: string;
  city: string;
  stateProvince: string;
  zipPostalCode: string;
  officialWebsite: string;

  // Documents
  accreditationCertificate: File | null;
  operatingLicense: File | null;

  // Admin Credentials
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

  // Signal-based form model
  registrationModel = signal<RegistrationData>({
    firstName: '',
    lastName: '',
    jobTitle: '',
    email: '',
    legalName: '',
    institutionType: '',
    accreditationNumber: '',
    streetAddress: '',
    city: '',
    stateProvince: '',
    zipPostalCode: '',
    officialWebsite: '',
    accreditationCertificate: null,
    operatingLicense: null,
    username: '',
    password: '',
    confirmPassword: '',
    enableTwoFactor: true,
  });

  // Create field tree with validation
  registrationForm = form(this.registrationModel, (schemaPath) => {
    // Profile validation
    required(schemaPath.firstName, { message: 'First name is required' });
    required(schemaPath.lastName, { message: 'Last name is required' });
    required(schemaPath.jobTitle, { message: 'Job title is required' });
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Please enter a valid email' });

    // Institution validation
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

    // Documents validation
    required(schemaPath.accreditationCertificate, {
      message: 'Accreditation certificate is required',
    });
    required(schemaPath.operatingLicense, {
      message: 'Operating license is required',
    });

    // Credentials validation
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
  });

  currentStepValid = computed(() => {
    const step = this.currentStep();
    const form = this.registrationForm;

    switch (step) {
      case 0: // Profile Info
        return (
          form.firstName().valid() &&
          form.lastName().valid() &&
          form.jobTitle().valid() &&
          form.email().valid()
        );
      case 1: // Institution Details
        return (
          form.legalName().valid() &&
          form.institutionType().valid() &&
          form.accreditationNumber().valid() &&
          form.streetAddress().valid() &&
          form.city().valid() &&
          form.stateProvince().valid() &&
          form.zipPostalCode().valid() &&
          form.officialWebsite().valid()
        );
      case 2: // Documents
        return (
          form.accreditationCertificate().valid() &&
          form.operatingLicense().valid()
        );
      case 3: // Admin Credentials
        return (
          form.username().valid() &&
          form.password().valid() &&
          form.confirmPassword().valid() &&
          form.password().value() === form.confirmPassword().value()
        );
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
    console.log('Saving and exiting:', this.registrationModel());
  }

  submitRegistration() {
    if (this.currentStepValid()) {
      console.log('Submitting registration:', this.registrationModel());
      // Handle submission
    }
  }
}
