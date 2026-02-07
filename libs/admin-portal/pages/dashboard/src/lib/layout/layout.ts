import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardLayout } from '@fsms/layout/dashboard';

@Component({
  imports: [RouterOutlet, DashboardLayout],
  template: `
    <fsms-dashboard-layout [sidenavItems]="_items">
      <router-outlet></router-outlet>
    </fsms-dashboard-layout>
  `,
  providers: [],
})
export class Dashboard {
  protected readonly _items = [
    {
      title: 'Dashboard',
      icon: 'lucideLayoutDashboard',
      defaultOpen: true,
      items: [
        {
          title: 'Overview',
          icon: 'lucideBarChart3',
          route: ['/dashboard/dashboard/overview'],
        },
        {
          title: 'Recent Activity',
          icon: 'lucideHistory',
          route: ['/dashboard/dashboard/recent-activity'],
        },
        {
          title: 'System Alerts',
          icon: 'lucideBell',
          route: ['/dashboard/dashboard/alerts'],
        },
      ],
    },
    {
      title: 'School Registrations',
      icon: 'lucideSchool',
      defaultOpen: true,
      items: [
        {
          title: 'Pending Applications',
          icon: 'lucideClock',
          route: ['/dashboard/registrations/pending'],
        },
        {
          title: 'Approved Schools',
          icon: 'lucideCheckCircle',
          route: ['/dashboard/registrations/approved'],
        },
        {
          title: 'Rejected Applications',
          icon: 'lucideXCircle',
          route: ['/dashboard/registrations/rejected'],
        },
        {
          title: 'All Applications',
          icon: 'lucideList',
          route: ['/dashboard/registrations/all'],
        },
      ],
    },
    {
      title: 'Application Review',
      icon: 'lucideFileSearch',
      defaultOpen: false,
      items: [
        {
          title: 'Review Queue',
          icon: 'lucideInbox',
          route: ['/dashboard/review/queue'],
        },
        {
          title: 'Verification Documents',
          icon: 'lucideFileText',
          route: ['/dashboard/review/documents'],
        },
        {
          title: 'Approval History',
          icon: 'lucideClipboardCheck',
          route: ['/dashboard/review/history'],
        },
      ],
    },
    {
      title: 'Schools',
      icon: 'lucideBuilding2',
      defaultOpen: false,
      items: [
        {
          title: 'School Directory',
          icon: 'lucideBookOpen',
          route: ['/dashboard/schools/directory'],
        },
        {
          title: 'School Profiles',
          icon: 'lucideIdCard',
          route: ['/dashboard/schools/profiles'],
        },
        {
          title: 'Status Management',
          icon: 'lucideToggleLeft',
          route: ['/dashboard/schools/status'],
        },
      ],
    },
    {
      title: 'Users & Roles',
      icon: 'lucideUsers',
      defaultOpen: false,
      items: [
        {
          title: 'Admin Users',
          icon: 'lucideUserCog',
          route: ['/dashboard/users/admins'],
        },
        {
          title: 'Role Management',
          icon: 'lucideShield',
          route: ['/dashboard/users/roles'],
        },
        {
          title: 'Permissions',
          icon: 'lucideKey',
          route: ['/dashboard/users/permissions'],
        },
      ],
    },
    {
      title: 'Reports & Analytics',
      icon: 'lucidePieChart',
      defaultOpen: false,
      items: [
        {
          title: 'Registration Reports',
          icon: 'lucideFileBarChart',
          route: ['/dashboard/reports/registrations'],
        },
        {
          title: 'Approval Statistics',
          icon: 'lucideTrendingUp',
          route: ['/dashboard/reports/approvals'],
        },
        {
          title: 'Audit Logs',
          icon: 'lucideScrollText',
          route: ['/dashboard/reports/audit-logs'],
        },
      ],
    },
    {
      title: 'Settings',
      icon: 'lucideSettings',
      defaultOpen: false,
      items: [
        {
          title: 'System Settings',
          icon: 'lucideSliders',
          route: ['/dashboard/settings/system'],
        },
        {
          title: 'Approval Rules',
          icon: 'lucideCheckSquare',
          route: ['/dashboard/settings/approval-rules'],
        },
        {
          title: 'Notification Settings',
          icon: 'lucideMail',
          route: ['/dashboard/settings/notifications'],
        },
      ],
    },
  ];
}
