import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGlobe, lucideMail, lucideShare2 } from '@ng-icons/lucide';
import { HlmIcon } from '@fsms/ui/icon';

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLink {
  icon: string;
  href: string;
  label: string;
}

@Component({
  selector: 'app-footer',
  imports: [NgIcon, HlmIcon],
  providers: [provideIcons({ lucideShare2, lucideGlobe, lucideMail })],
  templateUrl: './footer.html',
  standalone: true,
})
export class Footer {
  currentYear = new Date().getFullYear();

  footerLinks = signal<FooterLink[]>([
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Contact Us', href: '/contact' },
  ]);

  socialLinks = signal<SocialLink[]>([
    { icon: 'lucideShare2', href: '#', label: 'Share' },
    { icon: 'lucideGlobe', href: '#', label: 'Website' },
    { icon: 'lucideMail', href: 'mailto:contact@instiReg.com', label: 'Email' },
  ]);
}
