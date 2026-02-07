import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { catchError, from, map, Observable, throwError } from 'rxjs';

import {
  CompleteRegistration,
  GetInstitutionTypes,
  GetRegistrationDetails,
  GetRegistrationStatus,
  ICompleteRegistrationMutation,
  IGetInstitutionTypesQuery,
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
import { parseValidationErrors } from './utils/error-parser';

export interface RegistrationError {
  field: string;
  message: string;
}

export interface RegistrationResponse<T = any> {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
  message?: string;
}

@Injectable()
export class RegistrationService {
  private apollo = inject(Apollo);

  getInstitutionTypes = () => {
    console.log('getInstitutionTypes');
    return this.apollo.query<IGetInstitutionTypesQuery>({
      query: GetInstitutionTypes,
      fetchPolicy: 'cache-first',
    });
  };

  submitProfileInfo(
    input: IProfileInfoInput,
    registrationId?: string,
  ): Observable<ISubmitProfileInfoMutation['submitProfileInfo']> {
    console.log('submitProfileInfo', input);
    return this.apollo
      .mutate<ISubmitProfileInfoMutation>({
        mutation: SubmitProfileInfo,
        variables: { input, registrationId },
      })
      .pipe(
        map((result) => {
          if (!result.data?.submitProfileInfo) {
            throw new Error('Failed to submit profile information');
          }
          return result.data.submitProfileInfo;
        }),
        catchError((error) => {
          // Parse validation errors from GraphQL error extensions
          if (error.graphQLErrors && error.graphQLErrors.length > 0) {
            const gqlError = error.graphQLErrors[0];
            if (
              gqlError.extensions?.originalError?.message &&
              Array.isArray(gqlError.extensions.originalError.message)
            ) {
              const errorMessages = gqlError.extensions.originalError.message;
              const parsedErrors = parseValidationErrors(errorMessages);

              // Create a custom error with parsed errors
              const customError: any = new Error('Validation failed');
              customError.validationErrors = parsedErrors;
              return throwError(() => customError);
            }
          }
          return throwError(() => error);
        }),
      );
  }

  /**
   * Submit institution details for registration (Step 2)
   */
  submitInstitutionDetails(
    registrationId: string,
    input: IInstitutionDetailsInput,
  ): Observable<ISubmitInstitutionDetailsMutation['submitInstitutionDetails']> {
    return this.apollo
      .mutate<ISubmitInstitutionDetailsMutation>({
        mutation: SubmitInstitutionDetails,
        variables: { registrationId, input },
      })
      .pipe(
        map((result) => {
          if (!result.data?.submitInstitutionDetails) {
            throw new Error('Failed to submit institution details');
          }
          return result.data.submitInstitutionDetails;
        }),
        catchError((error) => {
          if (error.graphQLErrors && error.graphQLErrors.length > 0) {
            const gqlError = error.graphQLErrors[0];
            if (
              gqlError.extensions?.originalError?.message &&
              Array.isArray(gqlError.extensions.originalError.message)
            ) {
              const errorMessages = gqlError.extensions.originalError.message;
              const parsedErrors = parseValidationErrors(errorMessages);

              const customError: any = new Error('Validation failed');
              customError.validationErrors = parsedErrors;
              return throwError(() => customError);
            }
          }
          return throwError(() => error);
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
    return this.apollo
      .mutate<IUploadDocumentMutation>({
        mutation: UploadDocument,
        variables: { file, input },
      })
      .pipe(
        map((result) => {
          if (!result.data?.uploadRegistrationDocument) {
            throw new Error('Failed to upload document');
          }
          return result.data.uploadRegistrationDocument;
        }),
        catchError((error) => {
          if (error.graphQLErrors && error.graphQLErrors.length > 0) {
            const gqlError = error.graphQLErrors[0];
            if (
              gqlError.extensions?.originalError?.message &&
              Array.isArray(gqlError.extensions.originalError.message)
            ) {
              const errorMessages = gqlError.extensions.originalError.message;
              const parsedErrors = parseValidationErrors(errorMessages);

              const customError: any = new Error('Validation failed');
              customError.validationErrors = parsedErrors;
              return throwError(() => customError);
            }
          }
          return throwError(() => error);
        }),
      );
  }

  /**
   * Submit admin credentials for registration (Step 4)
   */
  submitAdminCredentials(
    registrationId: string,
    input: IAdminCredentialsInput,
  ): Observable<ISubmitAdminCredentialsMutation['submitAdminCredentials']> {
    return this.apollo
      .mutate<ISubmitAdminCredentialsMutation>({
        mutation: SubmitAdminCredentials,
        variables: { registrationId, input },
      })
      .pipe(
        map((result) => {
          if (!result.data?.submitAdminCredentials) {
            throw new Error('Failed to submit admin credentials');
          }
          return result.data.submitAdminCredentials;
        }),
        catchError((error) => {
          if (error.graphQLErrors && error.graphQLErrors.length > 0) {
            const gqlError = error.graphQLErrors[0];
            if (
              gqlError.extensions?.originalError?.message &&
              Array.isArray(gqlError.extensions.originalError.message)
            ) {
              const errorMessages = gqlError.extensions.originalError.message;
              const parsedErrors = parseValidationErrors(errorMessages);

              const customError: any = new Error('Validation failed');
              customError.validationErrors = parsedErrors;
              return throwError(() => customError);
            }
          }
          return throwError(() => error);
        }),
      );
  }

  /**
   * Complete the registration process atomically (Alternative to steps 1-4)
   */
  completeRegistration(
    registrationId: string,
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
    registrationId: string,
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
    registrationId: string,
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
