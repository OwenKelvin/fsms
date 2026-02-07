import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  RegistrationConfirmationDialogComponent,
  RegistrationConfirmationDialogData,
  RegistrationConfirmationResult,
} from './confirmation-dialog.component';

describe('RegistrationConfirmationDialogComponent', () => {
  let component: RegistrationConfirmationDialogComponent;
  let fixture: ComponentFixture<RegistrationConfirmationDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<DialogRef<RegistrationConfirmationResult>>;

  const createComponent = (action: 'approve' | 'reject') => {
    const dialogData: RegistrationConfirmationDialogData = {
      action,
      institutionName: 'Test School',
    };

    mockDialogRef = jasmine.createSpyObj('DialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [RegistrationConfirmationDialogComponent],
      providers: [
        { provide: DIALOG_DATA, useValue: dialogData },
        { provide: DialogRef, useValue: mockDialogRef },
      ],
    });

    fixture = TestBed.createComponent(RegistrationConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  describe('Approve Action', () => {
    beforeEach(() => {
      createComponent('approve');
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display approve confirmation message', () => {
      const message = component.getConfirmationMessage();
      expect(message).toContain('approve');
      expect(message).toContain('Test School');
    });

    it('should allow confirmation without notes', () => {
      component.onConfirm();

      expect(mockDialogRef.close).toHaveBeenCalledWith({
        confirmed: true,
      });
    });

    it('should include notes when provided', () => {
      component.notes = 'Approval notes';
      component.onConfirm();

      expect(mockDialogRef.close).toHaveBeenCalledWith({
        confirmed: true,
        notes: 'Approval notes',
      });
    });

    it('should not include empty notes', () => {
      component.notes = '   ';
      component.onConfirm();

      expect(mockDialogRef.close).toHaveBeenCalledWith({
        confirmed: true,
      });
    });
  });

  describe('Reject Action', () => {
    beforeEach(() => {
      createComponent('reject');
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display reject confirmation message', () => {
      const message = component.getConfirmationMessage();
      expect(message).toContain('reject');
      expect(message).toContain('Test School');
    });

    it('should require reason for rejection', () => {
      component.reason = '';
      component.onConfirm();

      expect(component.showError()).toBe(true);
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('should not accept whitespace-only reason', () => {
      component.reason = '   ';
      component.onConfirm();

      expect(component.showError()).toBe(true);
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('should allow confirmation with valid reason', () => {
      component.reason = 'Missing required documents';
      component.onConfirm();

      expect(mockDialogRef.close).toHaveBeenCalledWith({
        confirmed: true,
        reason: 'Missing required documents',
      });
    });

    it('should trim reason before returning', () => {
      component.reason = '  Missing documents  ';
      component.onConfirm();

      expect(mockDialogRef.close).toHaveBeenCalledWith({
        confirmed: true,
        reason: 'Missing documents',
      });
    });
  });

  describe('Cancel Action', () => {
    it('should close dialog with confirmed false for approve', () => {
      createComponent('approve');
      component.onCancel();

      expect(mockDialogRef.close).toHaveBeenCalledWith({
        confirmed: false,
      });
    });

    it('should close dialog with confirmed false for reject', () => {
      createComponent('reject');
      component.onCancel();

      expect(mockDialogRef.close).toHaveBeenCalledWith({
        confirmed: false,
      });
    });
  });
});
