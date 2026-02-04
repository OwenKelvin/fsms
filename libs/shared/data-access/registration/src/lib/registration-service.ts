import { inject, Injectable } from '@angular/core';
import { ApolloClient } from '@apollo/client';
import { from, map, Observable } from 'rxjs';

import {
  CompleteRegistration,
  GetRegistrationDetails,
  GetRegistrationStatus,
  ICompleteRegistrationMutation,
  IGetRegistrationDetailsQuery,
  IGetRegistrationStatusQuery,
  ISubmitAdminCredentialsMutation,
  ISubmitInstitutionDetailsMutation,
  ISubmitProfileInfoMutation,
  IUploadDocumentMutation,
  SubmitAdminCredentials,
  SubmitInstitutionDetails,
  SubmitProfileInfo,
  UploadDocument,
} from './registration.generated';
import {
  IAdminCredentialsInput,
  IDocumentUploadInput,
  IInstitutionDetailsInput,
  IProfileInfoInput,
} from '@fsms/data-access/core';

@Injectable()
export class RegistrationService {
  private apollo = inject(ApolloClient);

  /**
   * Submit profile information for registration (Step 1)
   */
  submitProfileInfo(
    input: IProfileInfoInput,
    registrationId?: number,
  ): Observable<ISubmitProfileInfoMutation['submitProfileInfo']> {
    return from(
      this.apollo.mutate<ISubmitProfileInfoMutation>({
        mutation: SubmitProfileInfo,
        variables: { input, registrationId },
      }),
    ).pipe(
      map((result) => {
        if (!result.data?.submitProfileInfo) {
          throw new Error('Failed to submit profile information');
        }
        return result.data.submitProfileInfo;
      }),
    );
  }

  /**
   * Submit institution details for registration (Step 2)
   */
  submitInstitutionDetails(
    registrationId: number,
    input: IInstitutionDetailsInput,
  ): Observable<ISubmitInstitutionDetailsMutation['submitInstitutionDetails']> {
    return from(
      this.apollo.mutate<ISubmitInstitutionDetailsMutation>({
        mutation: SubmitInstitutionDetails,
        variables: { registrationId, input },
      }),
    ).pipe(
      map((result) => {
        if (!result.data?.submitInstitutionDetails) {
          throw new Error('Failed to submit institution details');
        }
        return result.data.submitInstitutionDetails;
      }),
    );
  }

  /**
   * Upload a registration document (Step 3)
   */
  uploadDocument(
    file: File,
    input: IDocumentUploadInput,
  ): Observable<IUploadDocumentMutation['uploadRegistrationDocument']> {
    return from(
      this.apollo.mutate<IUploadDocumentMutation>({
        mutation: UploadDocument,
        variables: { file, input },
      }),
    ).pipe(
      map((result) => {
        if (!result.data?.uploadRegistrationDocument) {
          throw new Error('Failed to upload document');
        }
        return result.data.uploadRegistrationDocument;
      }),
    );
  }

  /**
   * Submit admin credentials for registration (Step 4)
   */
  submitAdminCredentials(
    registrationId: number,
    input: IAdminCredentialsInput,
  ): Observable<ISubmitAdminCredentialsMutation['submitAdminCredentials']> {
    return from(
      this.apollo.mutate<ISubmitAdminCredentialsMutation>({
        mutation: SubmitAdminCredentials,
        variables: { registrationId, input },
      }),
    ).pipe(
      map((result) => {
        if (!result.data?.submitAdminCredentials) {
          throw new Error('Failed to submit admin credentials');
        }
        return result.data.submitAdminCredentials;
      }),
    );
  }

  /**
   * Complete the registration process atomically (Alternative to steps 1-4)
   */
  completeRegistration(
    registrationId: number,
    profileInfo: IProfileInfoInput,
    institutionDetails: IInstitutionDetailsInput,
    adminCredentials: IAdminCredentialsInput,
  ): Observable<ICompleteRegistrationMutation['completeRegistration']> {
    return from(
      this.apollo.mutate<ICompleteRegistrationMutation>({
        mutation: CompleteRegistration,
        variables: {
          registrationId,
          profileInfo,
          institutionDetails,
          adminCredentials,
        },
      }),
    ).pipe(
      map((result) => {
        if (!result.data?.completeRegistration) {
          throw new Error('Failed to complete registration');
        }
        return result.data.completeRegistration;
      }),
    );
  }

  /**
   * Get registration status by ID
   */
  getRegistrationStatus(
    registrationId: number,
  ): Observable<IGetRegistrationStatusQuery['getRegistrationStatus']> {
    return from(
      this.apollo.query<IGetRegistrationStatusQuery>({
        query: GetRegistrationStatus,
        variables: { registrationId },
        fetchPolicy: 'network-only',
      }),
    ).pipe(
      map((result) => {
        if (!result.data) {
          throw new Error('Failed to get registration status');
        }
        return result.data.getRegistrationStatus;
      }),
    );
  }

  /**
   * Get detailed registration information by ID
   */
  getRegistrationDetails(
    registrationId: number,
  ): Observable<IGetRegistrationDetailsQuery['getRegistrationDetails']> {
    return from(
      this.apollo.query<IGetRegistrationDetailsQuery>({
        query: GetRegistrationDetails,
        variables: { registrationId },
        fetchPolicy: 'network-only',
      }),
    ).pipe(
      map((result) => {
        if (!result.data) {
          throw new Error('Failed to get registration details');
        }
        return result.data.getRegistrationDetails;
      }),
    );
  }
}
