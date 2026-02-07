# Shared Components - Registration Review

This folder contains reusable components for the registration review feature.

## RegistrationConfirmationDialogComponent

A reusable confirmation dialog for approving or rejecting school registration applications.

### Features

- **Approve Action**: Shows optional notes textarea for approval comments
- **Reject Action**: Shows required reason textarea with validation
- **Validation**: Prevents rejection without a reason
- **Consistent UI**: Uses the application's dialog system and UI components

### Usage

```typescript
import { HlmDialogService } from '@fsms/ui/dialog';
import { 
  RegistrationConfirmationDialogComponent,
  RegistrationConfirmationDialogData,
  RegistrationConfirmationResult 
} from '@fsms/admin-portal-pages/review';
import { firstValueFrom } from 'rxjs';

// Inject the dialog service
private dialogService = inject(HlmDialogService);

// For approval
async approveRegistration(institutionName: string) {
  const dialogRef = this.dialogService.open(RegistrationConfirmationDialogComponent, {
    context: {
      action: 'approve',
      institutionName: institutionName,
    } as RegistrationConfirmationDialogData,
  });

  const result = await firstValueFrom(dialogRef.closed$) as RegistrationConfirmationResult;
  
  if (result?.confirmed) {
    // User confirmed approval
    const notes = result.notes; // Optional notes
    // Call your approval mutation here
  }
}

// For rejection
async rejectRegistration(institutionName: string) {
  const dialogRef = this.dialogService.open(RegistrationConfirmationDialogComponent, {
    context: {
      action: 'reject',
      institutionName: institutionName,
    } as RegistrationConfirmationDialogData,
  });

  const result = await firstValueFrom(dialogRef.closed$) as RegistrationConfirmationResult;
  
  if (result?.confirmed && result.reason) {
    // User confirmed rejection with a reason
    const reason = result.reason; // Required reason
    // Call your rejection mutation here
  }
}
```

### Interface

```typescript
export interface RegistrationConfirmationDialogData {
  action: 'approve' | 'reject';
  institutionName: string;
}

export interface RegistrationConfirmationResult {
  confirmed: boolean;
  notes?: string;      // Present only for approve action
  reason?: string;     // Present only for reject action (required)
}
```

### Validation

- **Approve**: Notes are optional and can be empty
- **Reject**: Reason is required and must not be empty or whitespace-only
- The dialog will show an error message and prevent confirmation if rejection reason is missing

### Requirements Satisfied

- **Requirement 5.1**: Displays confirmation dialog before approval execution
- **Requirement 5.2**: Displays confirmation dialog with reason field before rejection execution
- **Requirement 5.3**: Allows cancellation which aborts the action
- **Requirement 4.2**: Validates that rejection reason is provided
