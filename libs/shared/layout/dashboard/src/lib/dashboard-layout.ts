import { Component, inject, input } from '@angular/core';
import {
  HlmSidebar,
  HlmSidebarContent,
  HlmSidebarFooter,
  HlmSidebarGroup,
  HlmSidebarGroupContent,
  HlmSidebarHeader,
  HlmSidebarInset,
  HlmSidebarMenu,
  HlmSidebarMenuButton,
  HlmSidebarMenuItem,
  HlmSidebarMenuSub,
  HlmSidebarMenuSubButton,
  HlmSidebarMenuSubItem,
  HlmSidebarTrigger,
  HlmSidebarWrapper,
} from '@fsms/ui/sidebar';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@fsms/ui/icon';
import {
  lucideChevronRight,
  lucideChevronUp,
  lucideLayoutDashboard,
  lucideBarChart3,
  lucideHistory,
  lucideBell,
  lucideSchool,
  lucideClock,
  lucideCheckCircle,
  lucideXCircle,
  lucideList,
  lucideFileSearch,
  lucideInbox,
  lucideFileText,
  lucideClipboardCheck,
  lucideBuilding2,
  lucideBookOpen,
  lucideIdCard,
  lucideToggleLeft,
  lucideUsers,
  lucideUserCog,
  lucideShield,
  lucideKey,
  lucidePieChart,
  lucideFileBarChart,
  lucideTrendingUp,
  lucideScrollText,
  lucideSettings,
  lucideSliders,
  lucideCheckSquare,
  lucideMail,
} from '@ng-icons/lucide';
import {
  HlmCollapsible,
  HlmCollapsibleContent,
  HlmCollapsibleTrigger,
} from '@fsms/ui/collapsible';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import {
  HlmDropdownMenu,
  HlmDropdownMenuItem,
  HlmDropdownMenuTrigger,
} from '@fsms/ui/dropdown-menu';
import { HlmDialogService } from '@fsms/ui/dialog';
import { ConfirmationDialog } from '@fsms/ui/dialog';
import { firstValueFrom } from 'rxjs';
import {
  BreadcrumbService,
  HlmBreadcrumb,
  HlmBreadcrumbItem,
  HlmBreadcrumbLink,
  HlmBreadcrumbList,
  HlmBreadcrumbPage,
  HlmBreadcrumbSeparator,
} from '@fsms/ui/breadcrumb';
import { AuthService } from '@fsms/data-access/auth';

export type SidebarRoute = string[];

export interface SidebarItem {
  title: string;
  icon: string; // or LucideIconName union later
  route: SidebarRoute;
}

export interface SidebarSection {
  title: string;
  icon: string;
  defaultOpen?: boolean;
  items: SidebarItem[];
}

@Component({
  selector: 'fsms-dashboard-layout',
  imports: [
    HlmSidebar,
    HlmSidebarContent,
    HlmSidebarGroup,
    HlmSidebarHeader,
    HlmSidebarWrapper,
    HlmSidebarGroupContent,
    HlmSidebarMenu,
    HlmSidebarMenuItem,
    HlmSidebarMenuButton,
    NgIcon,
    HlmIcon,
    HlmSidebarInset,
    HlmSidebarTrigger,
    HlmCollapsible,
    HlmCollapsibleTrigger,
    HlmCollapsibleContent,
    HlmSidebarMenuSubItem,
    HlmSidebarMenuSub,
    HlmSidebarMenuSubButton,
    RouterLink,
    RouterLinkActive,
    HlmSidebarFooter,
    HlmDropdownMenuTrigger,
    HlmDropdownMenu,
    HlmDropdownMenuItem,
    HlmBreadcrumb,
    HlmBreadcrumbSeparator,
    HlmBreadcrumbItem,
    HlmBreadcrumbLink,
    HlmBreadcrumbPage,
    HlmBreadcrumbList,
  ],
  template: `
    <div hlmSidebarWrapper>
      <hlm-sidebar>
        <div hlmSidebarHeader class="flex items-center gap-2 px-4 py-3">
          <div class="flex items-center w-full">
            <ng-icon hlmIcon name="logo" size="3rem"></ng-icon>
            <span class="ms-4 text-lg font-semibold">FurahaSMS. Admin</span>
          </div>
        </div>
        <div hlmSidebarContent>
          <div hlmSidebarGroup>
            <div hlmSidebarGroupContent>
              <ul hlmSidebarMenu>
                @for (item of sidenavItems(); track item.title) {
                  <hlm-collapsible
                    [expanded]="!!item.defaultOpen"
                    class="group/collapsible"
                  >
                    <li hlmSidebarMenuItem>
                      <button
                        hlmCollapsibleTrigger
                        hlmSidebarMenuButton
                        class="flex w-full items-center justify-between"
                      >
                        <div class="flex items-center gap-2">
                          <ng-icon [name]="item.icon" hlm size="sm" />
                          <span>{{ item.title }}</span>
                        </div>
                        <ng-icon
                          name="lucideChevronRight"
                          class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"
                          hlm
                        />
                      </button>
                      <hlm-collapsible-content>
                        <ul hlmSidebarMenuSub>
                          @for (subItem of item.items; track subItem.title) {
                            <li hlmSidebarMenuSubItem>
                              <a
                                [routerLink]="subItem.route"
                                routerLinkActive="bg-accent text-accent-foreground"
                                hlmSidebarMenuSubButton
                                class="flex w-full items-center gap-2"
                              >
                                <ng-icon
                                  [name]="subItem.icon"
                                  hlm
                                  size="sm"
                                  class="text-muted-foreground"
                                />
                                <span>{{ subItem.title }}</span>
                              </a>
                            </li>
                          }
                        </ul>
                      </hlm-collapsible-content>
                    </li>
                  </hlm-collapsible>
                }
              </ul>
            </div>
          </div>
        </div>
        <div hlmSidebarFooter>
          <ul hlmSidebarMenu>
            <li hlmSidebarMenuItem>
              <button hlmSidebarMenuButton [hlmDropdownMenuTrigger]="menu">
                My Account
                <ng-icon hlmIcon name="lucideChevronUp" class="ml-auto" />
              </button>
              <ng-template #menu>
                <hlm-dropdown-menu class="w-60">
                  <!--                  <button hlmDropdownMenuItem>Profile</button>-->
                  <!--                  <button hlmDropdownMenuItem>Settings</button>-->
                  <button hlmDropdownMenuItem (click)="signOut()">
                    Sign out
                  </button>
                </hlm-dropdown-menu>
              </ng-template>
            </li>
          </ul>
        </div>
      </hlm-sidebar>
      <main
        hlmSidebarInset
        class="bg-[url('/images/auth-background.svg')] bg-cover bg-center bg-no-repeat"
      >
        <header class="px-4 py-3 border-b">
          <div class="flex items-center justify-between mb-3">
            <button hlmSidebarTrigger>
              <span class="sr-only">Toggle Sidebar</span>
            </button>
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium">Admin Panel</span>
            </div>
          </div>

          <nav hlmBreadcrumb>
            <ol hlmBreadcrumbList>
              @for (breadcrumb of breadcrumbs(); track breadcrumb.label) {
                @if (!$last) {
                  <li hlmBreadcrumbItem>
                    <a hlmBreadcrumbLink [link]="breadcrumb.url">{{
                      breadcrumb.label
                    }}</a>
                  </li>
                  <li hlmBreadcrumbSeparator></li>
                } @else {
                  <li hlmBreadcrumbItem>
                    <span hlmBreadcrumbPage>{{ breadcrumb.label }}</span>
                  </li>
                }
              }
            </ol>
          </nav>
        </header>
        <ng-content />
      </main>
    </div>
  `,
  providers: [
    provideIcons({
      lucideChevronRight,
      lucideChevronUp,
      lucideLayoutDashboard,
      lucideBarChart3,
      lucideHistory,
      lucideBell,
      lucideSchool,
      lucideClock,
      lucideCheckCircle,
      lucideXCircle,
      lucideList,
      lucideFileSearch,
      lucideInbox,
      lucideFileText,
      lucideClipboardCheck,
      lucideBuilding2,
      lucideBookOpen,
      lucideIdCard,
      lucideToggleLeft,
      lucideUsers,
      lucideUserCog,
      lucideShield,
      lucideKey,
      lucidePieChart,
      lucideFileBarChart,
      lucideTrendingUp,
      lucideScrollText,
      lucideSettings,
      lucideSliders,
      lucideCheckSquare,
      lucideMail,
    }),
  ],
})
export class DashboardLayout {
  sidenavItems = input<SidebarSection[]>([]);
  private readonly authService = inject(AuthService);
  private readonly dialogService = inject(HlmDialogService);
  private readonly breadcrumbService = inject(BreadcrumbService);
  public readonly breadcrumbs = this.breadcrumbService.breadcrumbs;

  async signOut() {
    const dialogRef = this.dialogService.open(ConfirmationDialog, {
      context: {
        title: 'Sign Out',
        message: 'Are you sure you want to sign out?',
        confirmLabel: 'Sign Out',
        cancelLabel: 'Cancel',
        variant: 'destructive',
      },
    });

    const result = await firstValueFrom(dialogRef.closed$);
    if (result === true) {
      this.authService.logout();
    }
  }
}
