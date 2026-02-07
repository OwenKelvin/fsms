import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { map, Observable, firstValueFrom } from 'rxjs';
import { HlmCardImports } from '@fsms/ui/card';
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
  type RegistrationConfirmationResult
} from '../shared/confirmation-dialog.component';
import { HlmToaster } from '@fsms/ui/sonner';
import { toast } from 'ngx-sonner';
import {
  ApproveRegistration,
  GetRegistrationDetail,
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
    CommonModule,
    ...HlmCardImports,
    HlmButton,
    HlmSpinner,
    HlmBadge,
    HlmEmpty,
    HlmEmptyContent,
    HlmEmptyDescription,
    HlmEmptyHeader,
    HlmEmptyTitle,
    HlmToaster,
  ],
  templateUrl: './registration-detail.component.html',
  styleUrls: ['./registration-detail.component.scss'],
})
export class RegistrationDetailComponent implements OnInit {
  private apollo = inject(Apollo);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialogService = inject(HlmDialogService);

  registrationId!: string;
  registration$!: Observable<RegistrationDetail | null>;
  loading = true;
  error: string | null = null;
  isProcessing = false;

  ngOnInit(): void {
    this.registrationId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.registrationId) {
      this.error = 'Invalid registration ID';
      this.loading = false;
      return;
    }

    this.loadRegistrationDetail();
  }

  private loadRegistrationDetail(): void {
    this.loading = true;
    this.error = null;

    this.registration$ = this.apollo
      .watchQuery<RegistrationDetailQueryResult>({
        query: GetRegistrationDetail,
        variables: { registrationId: this.registrationId },
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(
        map((result) => {
          this.loading = result.loading;
          if (result.error) {
            this.error = 'Failed to load registration details. Please try again.';
            return null;
          }
          const data = result.data?.getRegistrationDetails;
          if (!data) {
            return null;
          }
          // Map to ensure all required fields are defined
          return {
            id: data.id || '',
            status: data.status || '',
            createdAt: data.createdAt || '',
            updatedAt: data.updatedAt || '',
            completedAt: data.completedAt || null,
            institutionId: data.institutionId || '',
            adminUserId: data.adminUserId || '',
            profileInfoCompleted: data.profileInfoCompleted || false,
            institutionDetailsCompleted: data.institutionDetailsCompleted || false,
            documentsUploaded: data.documentsUploaded || false,
            adminCredentialsCompleted: data.adminCredentialsCompleted || false,
            institution: {
              id: data.institution?.id || '',
              legalName: data.institution?.legalName || '',
              institutionType: data.institution?.institutionType || '',
              accreditationNumber: data.institution?.accreditationNumber || null,
              streetAddress: data.institution?.streetAddress || '',
              city: data.institution?.city || '',
              stateProvince: data.institution?.stateProvince || '',
              zipPostalCode: data.institution?.zipPostalCode || '',
              officialWebsite: data.institution?.officialWebsite || null,
              active: data.institution?.active || false,
            },
            adminUser: {
              id: data.adminUser?.id || '',
              firstName: data.adminUser?.firstName || '',
              lastName: data.adminUser?.lastName || '',
              email: data.adminUser?.email || '',
              jobTitle: data.adminUser?.jobTitle || null,
            },
            statusHistory: (data.statusHistory || []).map(entry => ({
              id: entry?.id || '',
              previousStatus: entry?.previousStatus || null,
              newStatus: entry?.newStatus || '',
              changedAt: entry?.changedAt || '',
              changedBy: entry?.changedBy || null,
              notes: entry?.notes || null,
            })),
          } as RegistrationDetail;
        })
      );
  }

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

  getStatusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
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

  getStatusLabel(status: string): string {
    return status.replace(/_/g, ' ');
  }

  onBack(): void {
    this.router.navigate(['/review/queue']);
  }

  async onApprove(): Promise<void> {
    // Get current registration data
    const registration = await firstValueFrom(this.registration$);
    if (!registration) {
      toast.error('Unable to approve registration. Please try again.');
      return;
    }

    // Show confirmation dialog
    const dialogRef = this.dialogService.open(RegistrationConfirmationDialogComponent, {
      context: {
        action: 'approve',
        institutionName: registration.institution.legalName,
      },
    });

    const result = await firstValueFrom(dialogRef.closed$) as RegistrationConfirmationResult | undefined;

    // User cancelled
    if (!result || !result.confirmed) {
      return;
    }

    // Disable buttons during mutation
    this.isProcessing = true;

    try {
      // Call APPROVE_REGISTRATION mutation
      const mutationResult = await firstValueFrom(
        this.apollo.mutate<ApproveRegistrationMutationResult>({
          mutation: ApproveRegistration,
          variables: {
            input: {
              registrationId: this.registrationId,
              notes: result.notes || undefined,
            },
          },
        })
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
        this.isProcessing = false;
      }
    } catch (error) {
      // Handle errors and keep user on page
      console.error('Error approving registration:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while approving the registration';
      toast.error(errorMessage);
      this.isProcessing = false;
    }
  }

  async onReject(): Promise<void> {
    // Get current registration data
    const registration = await firstValueFrom(this.registration$);
    if (!registration) {
      toast.error('Unable to reject registration. Please try again.');
      return;
    }

    // Show confirmation dialog with reason field
    const dialogRef = this.dialogService.open(RegistrationConfirmationDialogComponent, {
      context: {
        action: 'reject',
        institutionName: registration.institution.legalName,
      },
    });

    const result = await firstValueFrom(dialogRef.closed$) as RegistrationConfirmationResult | undefined;

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
    this.isProcessing = true;

    try {
      // Call REJECT_REGISTRATION mutation
      const mutationResult = await firstValueFrom(
        this.apollo.mutate<RejectRegistrationMutationResult>({
          mutation: RejectRegistration,
          variables: {
            input: {
              registrationId: this.registrationId,
              reason: result.reason,
            },
          },
        })
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
        this.isProcessing = false;
      }
    } catch (error) {
      // Handle errors and keep user on page
      console.error('Error rejecting registration:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while rejecting the registration';
      toast.error(errorMessage);
      this.isProcessing = false;
    }
  }
}
