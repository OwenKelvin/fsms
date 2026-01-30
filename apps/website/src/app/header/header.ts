import { Component, computed, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { BrnNavigationMenuImports } from '@spartan-ng/brain/navigation-menu';
import { HlmNavigationMenuImports } from '@fsms/ui/navigation-menu';
import { HlmButton } from '@fsms/ui/button';
import { NgOptimizedImage } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { HlmIcon } from '@fsms/ui/icon';
import { lucideMenu, lucideX } from '@ng-icons/lucide';


@Component({
  selector: 'app-header',
  imports: [
    HlmNavigationMenuImports,
    BrnNavigationMenuImports,
    HlmButton,
    NgOptimizedImage,
    NgIcon,
    HlmIcon,
  ],
  providers: [provideIcons({
    lucideMenu,
    lucideX
  })],
  templateUrl: './header.html',
})
export class Header {
  private breakpointObserver = inject(BreakpointObserver);

  private handsetState = toSignal(
    this.breakpointObserver.observe('(max-width: 767px)'),
    {
      initialValue: { matches: false, breakpoints: {} },
    },
  );
  isMobile = computed(() => this.handsetState().matches);
  isOpenMobile = signal(false);
}
