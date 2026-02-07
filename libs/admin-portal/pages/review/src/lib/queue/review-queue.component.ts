import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';

import {
  HlmTable,
  HlmTableContainer,
  HlmTBody,
  HlmTd,
  HlmTh,
  HlmTHead,
  HlmTr,
} from '@fsms/ui/table';
import {
  HlmEmpty,
  HlmEmptyContent,
  HlmEmptyDescription,
  HlmEmptyHeader,
  HlmEmptyTitle,
} from '@fsms/ui/empty';
import { HlmButton } from '@fsms/ui/button';
import { HlmSpinner } from '@fsms/ui/spinner';
import { HlmBadge } from '@fsms/ui/badge';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  GetRegistrationsRequiringReview,
  IGetRegistrationsRequiringReviewQuery,
} from '@fsms/data-access/registration';
import { DatePipe } from '@angular/common';

type Registration =
  IGetRegistrationsRequiringReviewQuery['getRegistrationsRequiringReview'][number];

@Component({
  selector: 'fsms-review-queue',
  standalone: true,
  imports: [
    HlmTable,
    HlmTableContainer,
    HlmTBody,
    HlmTd,
    HlmTh,
    HlmTHead,
    HlmTr,
    HlmEmpty,
    HlmEmptyContent,
    HlmEmptyDescription,
    HlmEmptyHeader,
    HlmEmptyTitle,
    HlmButton,
    HlmSpinner,
    HlmBadge,
    DatePipe,
  ],
  templateUrl: './review-queue.component.html',
  styleUrls: ['./review-queue.component.scss'],
})
export class ReviewQueueComponent {
  protected readonly apollo = inject(Apollo);
  protected readonly router = inject(Router);
  protected readonly getRegistrationsQueryResult = toSignal(
    this.apollo.watchQuery<IGetRegistrationsRequiringReviewQuery>({
      query: GetRegistrationsRequiringReview,
      fetchPolicy: 'network-only',
    }).valueChanges,
  );

  protected readonly registrations = computed<Registration[]>(
    () =>
      (this.getRegistrationsQueryResult()?.data
        ?.getRegistrationsRequiringReview ?? []) as Registration[],
  );

  protected readonly loading = computed(
    () => this.getRegistrationsQueryResult()?.loading,
  );
  protected readonly error = computed(
    () => this.getRegistrationsQueryResult()?.error,
  );

  onSelectRegistration(registrationId?: string): void {
    if (registrationId) {
      this.router.navigate(['/dashboard/review/detail', registrationId]);
    }
  }

  getDocumentStatus(registration: Registration): string {
    // Based on the query, documentsUploaded is a boolean
    // For display purposes, we'll show a simple status
    return registration.documentsUploaded ? 'Complete' : 'Incomplete';
  }
}
