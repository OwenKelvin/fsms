import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { BrnNavigationMenuImports } from '@spartan-ng/brain/navigation-menu';
import { HlmNavigationMenuImports } from '@fsms/ui/navigation-menu';
import { HlmButton } from '@fsms/ui/button';
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
  providers: [
    provideIcons({
      lucideMenu,
      lucideX,
    }),
  ],
  templateUrl: './header.html',
})
export class Header implements OnInit {
  mainHeader = viewChild.required<ElementRef>('mainHeader');
  platformId = inject(PLATFORM_ID);
  protected isBrowser = isPlatformBrowser(this.platformId);
  protected renderer = inject(Renderer2);
  private breakpointObserver = inject(BreakpointObserver);

  private handsetState = toSignal(
    this.breakpointObserver.observe('(max-width: 767px)'),
    {
      initialValue: { matches: false, breakpoints: {} },
    },
  );
  isMobile = computed(() => this.handsetState().matches);
  isOpenMobile = signal(false);

  ngOnInit() {
    this.handleScroll();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.handleScroll();
  }

  private handleScroll() {
    if (this.isBrowser) {
      const header = this.mainHeader().nativeElement;
      if (window.scrollY > 50) {
        this.renderer.removeClass(header, 'header-transparent');
        this.renderer.addClass(header, 'header-solid');
      } else {
        this.renderer.removeClass(header, 'header-solid');
        this.renderer.addClass(header, 'header-transparent');
      }
    }
  }
}
