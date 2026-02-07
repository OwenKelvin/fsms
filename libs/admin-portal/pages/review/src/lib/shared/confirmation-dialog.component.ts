import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HlmButton } from '@fsms/ui/button';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { HlmDialogDescription } from '@fsms/ui/dialog';
import { HlmDialogTitle } from '@fsms/ui/dialog';
import { HlmDialogFooter } from '@fsms/ui/dialog';
import { HlmDialogHeader } from '@fsms/ui/dialog';
import { HlmTextarea } from '@fsms/ui/textarea';
import { HlmLabel } from '@fsms/ui/label';
import { HlmError, HlmFormField, HlmHint } from '@fsms/ui/form-field';

export interface RegistrationConfirmationDialogData {
  action: 'approve' | 'reject';
  institutionName: string;
}

export interface RegistrationConfirmationResult {
  confirmed: boolean;
  notes?: string;
  reason?: string;
}

@Component({
  selector: 'fsms-registration-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HlmDialogHeader,
    HlmDialogFooter,
    HlmDialogTitle,
    HlmDialogDescription,
    HlmButton,
    HlmTextarea,
    HlmLabel,
    HlmError,
    HlmFormField,
    HlmHint,
  ],
  template: `
    <div hlmDialogHeader>
      <h3 hlmDialogTitle>
        {{
          _data.action === 'approve'
            ? 'Approve Registration'
            : 'Reject Registration'
        }}
      </h3>
    </div>

    <div class="my-4">
      <p hlmDialogDescription class="mb-4">
        {{ getConfirmationMessage() }}
      </p>

      @if (_data.action === 'approve') {
        <div class="space-y-2">
          <hlm-form-field>
            <label hlmLabel for="notes">Notes (Optional)</label>
            <textarea
              hlmTextarea
              id="notes"
              [(ngModel)]="notes"
              placeholder="Add any notes about this approval..."
              rows="4"
              class="w-full"
            ></textarea>
            <hlm-hint>
              These notes will be recorded in the status history.
            </hlm-hint>
          </hlm-form-field>
        </div>
      }

      @if (_data.action === 'reject') {
        <div class="space-y-2">
          <hlm-form-field>
            <label hlmLabel for="reason">Rejection Reason *</label>
            <textarea
              hlmTextarea
              id="reason"
              [(ngModel)]="reason"
              placeholder="Provide a reason for rejection..."
              rows="4"
              class="w-full"
              [class.border-destructive]="showError()"
            ></textarea>
            @if (showError()) {
              <hlm-error>Rejection reason is required</hlm-error>
            }
            <hlm-hint>
              This reason will be recorded in the status history and may be
              visible to the institution.
            </hlm-hint>>
          </hlm-form-field>
        </div>
      }
    </div>

    <div hlmDialogFooter>
      <button hlmBtn (click)="onCancel()" variant="outline">Cancel</button>
      <button
        hlmBtn
        (click)="onConfirm()"
        [variant]="_data.action === 'reject' ? 'destructive' : 'default'"
      >
        {{ _data.action === 'approve' ? 'Approve' : 'Reject' }}
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationConfirmationDialogComponent {
  protected readonly _dialogRef = inject(
    DialogRef<RegistrationConfirmationResult>,
  );
  protected readonly _data =
    inject<RegistrationConfirmationDialogData>(DIALOG_DATA);

  notes = '';
  reason = '';
  showError = signal(false);

  getConfirmationMessage(): string {
    if (this._data.action === 'approve') {
      return `Are you sure you want to approve the registration for "${this._data.institutionName}"? This will activate the institution and allow them to access the system.`;
    } else {
      return `Are you sure you want to reject the registration for "${this._data.institutionName}"? Please provide a reason for the rejection.`;
    }
  }

  onConfirm(): void {
    // Validate rejection reason if action is reject
    if (this._data.action === 'reject') {
      if (!this.reason.trim()) {
        this.showError.set(true);
        return;
      }
    }

    const result: RegistrationConfirmationResult = {
      confirmed: true,
    };

    if (this._data.action === 'approve' && this.notes.trim()) {
      result.notes = this.notes.trim();
    }

    if (this._data.action === 'reject') {
      result.reason = this.reason.trim();
    }

    this._dialogRef.close(result);
  }

  onCancel(): void {
    this._dialogRef.close({
      confirmed: false,
    });
  }
}
