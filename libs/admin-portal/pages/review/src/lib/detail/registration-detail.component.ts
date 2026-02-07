import { Component, computed, inject, input, signal } from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { rxResource } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import {
  HlmCard,
  HlmCardContent,
  HlmCardDescription,
  HlmCardHeader,
  HlmCardTitle,
} from '@fsms/ui/card';
import { HlmButton } from '@fsms/ui/button';
import { HlmSpinner } from '@fsms/ui/spinner';
import { HlmBadge } from '@fsms/ui/badge';
import {
  HlmEmpty,
  HlmEmptyContent,
  HlmEmptyDescription,
  HlmEmptyHeader,
  HlmEmptyTitle,
} from '@fsms/ui/empty';
import { HlmDialogService } from '@fsms/ui/dialog';
import {
  RegistrationConfirmationDialogComponent,
  type RegistrationConfirmationResult,
} from '../shared/confirmation-dialog.component';
import { HlmToaster } from '@fsms/ui/sonner';
import { toast } from 'ngx-sonner';
import {
  ApproveRegistration,
  GetRegistrationDetail,
  IGetRegistrationDetailsQuery,
  RejectRegistration,
} from '@fsms/data-access/registration';

interface StatusHistoryEntry {
  id: string;
  previousStatus: string | null;
  newStatus: string;
  changedAt: string;
  changedBy: string | null;
  notes: string | null;
}

interface Institution {
  id: string;
  legalName: string;
  institutionType: string;
  accreditationNumber: string | null;
  streetAddress: string;
  city: string;
  stateProvince: string;
  zipPostalCode: string;
  officialWebsite: string | null;
  active: boolean;
}

interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string | null;
}

interface RegistrationDetail {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  institutionId: string;
  adminUserId: string;
  profileInfoCompleted: boolean;
  institutionDetailsCompleted: boolean;
  documentsUploaded: boolean;
  adminCredentialsCompleted: boolean;
  institution: Institution;
  adminUser: AdminUser;
  statusHistory: StatusHistoryEntry[];
}

interface RegistrationDetailQueryResult {
  getRegistrationDetails: RegistrationDetail;
}

interface ApproveRegistrationResponse {
  success: boolean;
  message?: string;
  error?: string;
  registration?: RegistrationDetail;
}

interface ApproveRegistrationMutationResult {
  approveRegistration: ApproveRegistrationResponse;
}

interface RejectRegistrationResponse {
  success: boolean;
  message?: string;
  error?: string;
  registration?: RegistrationDetail;
}

interface RejectRegistrationMutationResult {
  rejectRegistration: RejectRegistrationResponse;
}

@Component({
  selector: 'fsms-registration-detail',
  standalone: true,
  imports: [
    HlmButton,
    HlmSpinner,
    HlmBadge,
    HlmEmpty,
    HlmEmptyContent,
    HlmEmptyDescription,
    HlmEmptyHeader,
    HlmEmptyTitle,
    HlmToaster,
    HlmCard,
    HlmCardHeader,
    HlmCardTitle,
    HlmCardDescription,
    HlmCardContent,
    DatePipe,
    DatePipe,
  ],
  templateUrl: './registration-detail.component.html',
  styleUrls: ['./registration-detail.component.scss'],
})
export class RegistrationDetailComponent {
  protected readonly apollo = inject(Apollo);
  protected readonly router = inject(Router);
  protected readonly dialogService = inject(HlmDialogService);
  readonly registrationId = input<string>();

  protected readonly registrationResource = rxResource({
    params: () => ({ registrationId: this.registrationId() }),
    stream: ({ params }) =>
      this.apollo.watchQuery<IGetRegistrationDetailsQuery>({
        query: GetRegistrationDetail,
        variables: { registrationId: params.registrationId },
        fetchPolicy: 'network-only',
      }).valueChanges,
  });

  protected readonly registration = computed(
    () => this.registrationResource.value()?.data?.getRegistrationDetails,
  );

  protected readonly loading = computed(
    () => this.registrationResource.value()?.loading ?? true,
  );

  protected readonly error = computed(
    () => this.registrationResource.value()?.error,
  );

  // Signal for processing state during mutations
  protected readonly isProcessing = signal(false);

  // Computed signals for UI
  protected readonly statusBadgeVariant = computed(() => {
    const status = this.registration()?.status;
    if (!status) return 'outline' as const;

    switch (status) {
      case 'APPROVED':
        return 'default' as const;
      case 'REJECTED':
        return 'destructive' as const;
      case 'UNDER_REVIEW':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  });

  protected readonly statusLabel = computed(() => {
    const status = this.registration()?.status;
    return status ? status.replace(/_/g, ' ') : '';
  });

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatShortDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getStatusBadgeVariant(
    status?: string,
  ): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
      case 'APPROVED':
        return 'default';
      case 'REJECTED':
        return 'destructive';
      case 'UNDER_REVIEW':
        return 'secondary';
      default:
        return 'outline';
    }
  }

  getStatusLabel(status?: string): string {
    return status?.replace(/_/g, ' ') ?? '';
  }

  onBack(): void {
    this.router.navigate(['/review/queue']);
  }

  async onApprove(): Promise<void> {
    const registration = this.registration();
    if (!registration) {
      toast.error('Unable to approve registration. Please try again.');
      return;
    }

    // Show confirmation dialog
    const dialogRef = this.dialogService.open(
      RegistrationConfirmationDialogComponent,
      {
        context: {
          action: 'approve',
          institutionName: registration.institution?.legalName,
        },
      },
    );

    const result = (await firstValueFrom(dialogRef.closed$)) as
      | RegistrationConfirmationResult
      | undefined;

    // User cancelled
    if (!result || !result.confirmed) {
      return;
    }

    // Disable buttons during mutation
    this.isProcessing.set(true);

    try {
      // Call APPROVE_REGISTRATION mutation
      const mutationResult = await firstValueFrom(
        this.apollo.mutate<ApproveRegistrationMutationResult>({
          mutation: ApproveRegistration,
          variables: {
            input: {
              registrationId: this.registrationId(),
              notes: result.notes || undefined,
            },
          },
        }),
      );

      const response = mutationResult.data?.approveRegistration;

      if (response?.success) {
        // Show success message
        toast.success(response.message || 'Registration approved successfully');

        // Navigate back to queue
        setTimeout(() => {
          this.router.navigate(['/review/queue']);
        }, 1000);
      } else {
        // Show error message
        toast.error(response?.error || 'Failed to approve registration');
        this.isProcessing.set(false);
      }
    } catch (error) {
      // Handle errors and keep user on page
      console.error('Error approving registration:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while approving the registration';
      toast.error(errorMessage);
      this.isProcessing.set(false);
    }
  }

  async onReject(): Promise<void> {
    const registration = this.registration();
    if (!registration) {
      toast.error('Unable to reject registration. Please try again.');
      return;
    }

    // Show confirmation dialog with reason field
    const dialogRef = this.dialogService.open(
      RegistrationConfirmationDialogComponent,
      {
        context: {
          action: 'reject',
          institutionName: registration.institution?.legalName,
        },
      },
    );

    const result = (await firstValueFrom(dialogRef.closed$)) as
      | RegistrationConfirmationResult
      | undefined;

    // User cancelled or didn't provide reason
    if (!result || !result.confirmed) {
      return;
    }

    // Validate reason is provided (should be validated in dialog, but double-check)
    if (!result.reason || !result.reason.trim()) {
      toast.error('Rejection reason is required');
      return;
    }

    // Disable buttons during mutation
    this.isProcessing.set(true);

    try {
      // Call REJECT_REGISTRATION mutation
      const mutationResult = await firstValueFrom(
        this.apollo.mutate<RejectRegistrationMutationResult>({
          mutation: RejectRegistration,
          variables: {
            input: {
              registrationId: this.registrationId(),
              reason: result.reason,
            },
          },
        }),
      );

      const response = mutationResult.data?.rejectRegistration;

      if (response?.success) {
        // Show success message
        toast.success(response.message || 'Registration rejected successfully');

        // Navigate back to queue
        setTimeout(() => {
          this.router.navigate(['/review/queue']);
        }, 1000);
      } else {
        // Show error message
        toast.error(response?.error || 'Failed to reject registration');
        this.isProcessing.set(false);
      }
    } catch (error) {
      // Handle errors and keep user on page
      console.error('Error rejecting registration:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while rejecting the registration';
      toast.error(errorMessage);
      this.isProcessing.set(false);
    }
  }
}
