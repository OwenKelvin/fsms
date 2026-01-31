import { Component, signal, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideBuilding2,
  lucideFileText,
  lucideShieldCheck,
  lucideFingerprint,
  lucideMapPin,
  lucideGlobe,
  lucideChevronLeft,
  lucideChevronRight
} from '@ng-icons/lucide';
import { HlmInput } from '@fsms/ui/input';
import { HlmLabel } from '@fsms/ui/label';
import { HlmButton } from '@fsms/ui/button';
import { BrnSelect, BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@fsms/ui/select';
import { HlmIcon } from '@fsms/ui/icon';
import { NgClass } from '@angular/common';


interface Step {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  completed: boolean;
}

@Component({
  selector: 'app-institution-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIcon,
    HlmInput,
    HlmLabel,
    HlmButton,
    BrnSelectImports,
    HlmSelectImports,
    HlmIcon,
    NgClass,
    BrnSelect,
  ],
  providers: [
    provideIcons({
      lucideCheck,
      lucideBuilding2,
      lucideFileText,
      lucideShieldCheck,
      lucideFingerprint,
      lucideMapPin,
      lucideGlobe,
      lucideChevronLeft,
      lucideChevronRight,
    }),
  ],
  templateUrl: './institution-form.html',
})
export default class InstitutionForm {
  currentStep = signal(1);

  steps = signal<Step[]>([
    {
      id: 'profile',
      title: 'Profile Info',
      subtitle: 'Personal details',
      icon: 'lucideBuilding2',
      completed: true,
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

  institutionTypes = signal<string[]>([
    'University',
    'College',
    'Technical Institute',
    'Community College',
    'Vocational School',
  ]);

  // Signal-based form
  institutionForm = new FormGroup({
    legalName: new FormControl('', [Validators.required]),
    institutionType: new FormControl('', [Validators.required]),
    accreditationNumber: new FormControl('', [Validators.required]),
    streetAddress: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    stateProvince: new FormControl('', [Validators.required]),
    zipPostalCode: new FormControl('', [Validators.required]),
    officialWebsite: new FormControl('', [
      Validators.required,
      Validators.pattern('https?://.+'),
    ]),
  });

  isStepValid = computed(() => {
    return this.institutionForm.valid;
  });

  nextStep() {
    if (this.currentStep() < this.steps().length) {
      this.currentStep.update((step) => step + 1);
    }
  }

  previousStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update((step) => step - 1);
    }
  }

  saveAndContinue() {
    if (this.institutionForm.valid) {
      console.log('Form data:', this.institutionForm.value);
      this.nextStep();
    }
  }

  saveAndExit() {
    console.log('Saving and exiting:', this.institutionForm.value);
  }
}
