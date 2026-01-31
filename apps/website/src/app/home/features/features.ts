import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideGlobe2,
  lucideLayoutGrid,
  lucideShieldCheck,
} from '@ng-icons/lucide';
import { Component, signal } from '@angular/core';
import { HlmIcon } from '@fsms/ui/icon';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-features',
  imports: [NgIcon, HlmIcon],
  providers: [
    provideIcons({ lucideGlobe2, lucideLayoutGrid, lucideShieldCheck }),
  ],
  templateUrl: './features.html',
  standalone: true,
})
export class Features {
  features = signal<Feature[]>([
    {
      icon: 'lucideGlobe2',
      title: 'Global Reach',
      description:
        'Connect with students and partners across the globe seamlessly. Expand your educational influence across borders.',
    },
    {
      icon: 'lucideLayoutGrid',
      title: 'Easy Management',
      description:
        'Streamline administrative tasks with our intuitive dashboard. Track applications and manage documents in one place.',
    },
    {
      icon: 'lucideShieldCheck',
      title: 'Verified Accreditation',
      description:
        'Gain trust with our robust verification and security standards. Ensure every profile is authentic and secure.',
    },
  ]);
}
