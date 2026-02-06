import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { catchError, from, map, Observable, throwError } from 'rxjs';

// Import the generated types and documents
import {
  ChangePassword,
  ChangePasswordUsingResetToken,
  ContinueWithGoogle,
  IChangePasswordMutation,
  IChangePasswordMutationVariables,
  IChangePasswordUsingResetTokenMutation,
  IContinueWithGoogleMutation,
  ILoginWithPasswordMutation,
  ILoginWithPasswordMutationVariables,
  ILoginWithResetPasswordTokenMutation,
  ILoginWithTokenMutation,
  IRefreshedAccessTokenSubscription,
  IRequestAccessTokenMutation,
  IResetPasswordNotificationSubscription,
  ISendPasswordResetLinkEmailMutation,
  ISendPasswordResetOtpEmailMutation,
  ISendVerificationLinkEmailMutation,
  ISignInWithGoogleMutation,
  ISignupGoogleUserMutation,
  IValidateOtpMutation,
  IValidatePasswordResetTokenMutation,
  IVerifyEmailMutation,
  LoginWithPassword,
  LoginWithResetPasswordToken,
  LoginWithToken,
  RefreshedAccessToken,
  RequestAccessToken,
  ResetPasswordNotification,
  SendPasswordResetLinkEmail,
  SendPasswordResetOtpEmail,
  SendVerificationLinkEmail,
  SignInWithGoogle,
  SignupGoogleUser,
  ValidateOtp,
  ValidatePasswordResetToken,
  VerifyEmail,
} from './auth.generated';

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

// Type aliases for common response types
export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  refreshTokenKey: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
};

export type SuccessResponse = {
  success: boolean;
  message: string;
};

export type AccessTokenResponse = {
  accessToken?: string | null;
};

export type UserResponse = {
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
};

@Injectable()
export class AuthService {
  private apollo = inject(Apollo);

  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly REFRESH_TOKEN_ID_KEY = 'refreshTokenKey';

  private _saveTokens(tokens: LoginResponse): void {
    if (tokens.accessToken) {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    }
    if (tokens.refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    }
    if (tokens.refreshTokenKey) {
      localStorage.setItem(this.REFRESH_TOKEN_ID_KEY, tokens.refreshTokenKey);
    }
  }

  public getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  public getRefreshTokenKey(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_ID_KEY);
  }

  public clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_ID_KEY);
  }

  public async logout(): Promise<void> {
    this.clearTokens();
    await this.apollo.client.resetStore(); // Clear Apollo Client cache
  }

  // ==================== Google Authentication ====================

  /**
   * Sign in with Google token
   */
  signInWithGoogle(token: string): Observable<LoginResponse> {
    return this.apollo
      .mutate<ISignInWithGoogleMutation>({
        mutation: SignInWithGoogle,
        variables: { token },
      })
      .pipe(
        map((result) => {
          if (!result.data?.signInWithGoogle) {
            throw new Error('Failed to sign in with Google');
          }
          const loginResponse = result.data.signInWithGoogle;
          this._saveTokens(loginResponse);
          return loginResponse;
        }),
        catchError(this.handleGraphQLError('Google sign-in failed')),
      );
  }

  /**
   * Sign up with Google token
   */
  signupGoogleUser(token: string): Observable<LoginResponse> {
    return this.apollo
      .mutate<ISignupGoogleUserMutation>({
        mutation: SignupGoogleUser,
        variables: { token },
      })
      .pipe(
        map((result) => {
          if (!result.data?.signupGoogleUser) {
            throw new Error('Failed to sign up with Google');
          }
          const loginResponse = result.data.signupGoogleUser;
          this._saveTokens(loginResponse);
          return loginResponse;
        }),
        catchError(this.handleGraphQLError('Google sign-up failed')),
      );
  }

  /**
   * Continue with Google token
   */
  continueWithGoogle(token: string): Observable<LoginResponse> {
    return this.apollo
      .mutate<IContinueWithGoogleMutation>({
        mutation: ContinueWithGoogle,
        variables: { token },
      })
      .pipe(
        map((result) => {
          if (!result.data?.continueWithGoogle) {
            throw new Error('Failed to continue with Google');
          }
          const loginResponse = result.data.continueWithGoogle;
          this._saveTokens(loginResponse);
          return loginResponse;
        }),
        catchError(this.handleGraphQLError('Continue with Google failed')),
      );
  }

  // ==================== Token-based Authentication ====================

  /**
   * Login with token
   */
  loginWithToken(token: string): Observable<LoginResponse> {
    return this.apollo
      .mutate<ILoginWithTokenMutation>({
        mutation: LoginWithToken,
        variables: { token },
      })
      .pipe(
        map((result) => {
          if (!result.data?.loginWithToken) {
            throw new Error('Failed to login with token');
          }
          const loginResponse = result.data.loginWithToken;
          this._saveTokens(loginResponse);
          return loginResponse;
        }),
        catchError(this.handleGraphQLError('Token login failed')),
      );
  }

  /**
   * Login with reset password token
   */
  loginWithResetPasswordToken(token: string): Observable<LoginResponse> {
    return this.apollo
      .mutate<ILoginWithResetPasswordTokenMutation>({
        mutation: LoginWithResetPasswordToken,
        variables: { token },
      })
      .pipe(
        map((result) => {
          if (!result.data?.loginWithResetPasswordToken) {
            throw new Error('Failed to login with reset password token');
          }
          const loginResponse = result.data.loginWithResetPasswordToken;
          this._saveTokens(loginResponse);
          return loginResponse;
        }),
        catchError(
          this.handleGraphQLError('Reset password token login failed'),
        ),
      );
  }

  /**
   * Request new access token using refresh token
   */
  requestAccessToken(refreshToken: string): Observable<AccessTokenResponse> {
    return this.apollo
      .mutate<IRequestAccessTokenMutation>({
        mutation: RequestAccessToken,
        variables: { refreshToken },
      })
      .pipe(
        map((result) => {
          if (!result.data?.requestAccessToken) {
            throw new Error('Failed to request access token');
          }
          const accessTokenResponse = result.data.requestAccessToken;
          if (accessTokenResponse.accessToken) {
            localStorage.setItem(this.ACCESS_TOKEN_KEY, accessTokenResponse.accessToken);
          }
          return accessTokenResponse;
        }),
        catchError(this.handleGraphQLError('Access token request failed')),
      );
  }
  /**
   * Login with email and password
   */
  loginWithPassword(
    input: ILoginWithPasswordMutationVariables,
  ): Observable<LoginResponse> {
    return this.apollo
      .mutate<ILoginWithPasswordMutation>({
        mutation: LoginWithPassword,
        variables: input,
      })
      .pipe(
        map((result) => {
          if (!result.data?.loginWithPassword) {
            throw new Error('Failed to login with password');
          }
          const loginResponse = result.data.loginWithPassword;
          this._saveTokens(loginResponse);
          return loginResponse;
        }),
        catchError(this.handleGraphQLError('Login failed')),
      );
  }

  // ==================== Email Verification ====================

  /**
   * Send verification link email
   */
  sendVerificationLinkEmail(): Observable<SuccessResponse> {
    return this.apollo
      .mutate<ISendVerificationLinkEmailMutation>({
        mutation: SendVerificationLinkEmail,
      })
      .pipe(
        map((result) => {
          if (!result.data?.sendVerificationLinkEmail) {
            throw new Error('Failed to send verification link email');
          }
          return result.data.sendVerificationLinkEmail;
        }),
        catchError(
          this.handleGraphQLError('Verification email sending failed'),
        ),
      );
  }

  /**
   * Verify email with token
   */
  verifyEmail(token: string): Observable<SuccessResponse> {
    return this.apollo
      .mutate<IVerifyEmailMutation>({
        mutation: VerifyEmail,
        variables: { token },
      })
      .pipe(
        map((result) => {
          if (!result.data?.verifyEmail) {
            throw new Error('Failed to verify email');
          }
          return result.data.verifyEmail;
        }),
        catchError(this.handleGraphQLError('Email verification failed')),
      );
  }

  // ==================== Password Reset ====================

  /**
   * Send password reset link email
   */
  sendPasswordResetLinkEmail(email: string): Observable<SuccessResponse> {
    return this.apollo
      .mutate<ISendPasswordResetLinkEmailMutation>({
        mutation: SendPasswordResetLinkEmail,
        variables: { email },
      })
      .pipe(
        map((result) => {
          if (!result.data?.sendPasswordResetLinkEmail) {
            throw new Error('Failed to send password reset link email');
          }
          return result.data.sendPasswordResetLinkEmail;
        }),
        catchError(
          this.handleGraphQLError('Password reset email sending failed'),
        ),
      );
  }

  /**
   * Send password reset OTP email
   */
  sendPasswordResetOtpEmail(email: string): Observable<SuccessResponse> {
    return this.apollo
      .mutate<ISendPasswordResetOtpEmailMutation>({
        mutation: SendPasswordResetOtpEmail,
        variables: { email },
      })
      .pipe(
        map((result) => {
          if (!result.data?.sendPasswordResetOtpEmail) {
            throw new Error('Failed to send password reset OTP email');
          }
          return result.data.sendPasswordResetOtpEmail;
        }),
        catchError(
          this.handleGraphQLError('Password reset OTP email sending failed'),
        ),
      );
  }

  /**
   * Validate OTP
   */
  validateOtp(identifier: string, token: string): Observable<LoginResponse> {
    return this.apollo
      .mutate<IValidateOtpMutation>({
        mutation: ValidateOtp,
        variables: { identifier, token },
      })
      .pipe(
        map((result) => {
          if (!result.data?.validateOtp) {
            throw new Error('Failed to validate OTP');
          }
          const loginResponse = result.data.validateOtp;
          this._saveTokens(loginResponse);
          return loginResponse;
        }),
        catchError(this.handleGraphQLError('OTP validation failed')),
      );
  }

  /**
   * Change password (requires old password)
   */
  changePassword(
    input: IChangePasswordMutationVariables,
  ): Observable<SuccessResponse> {
    return this.apollo
      .mutate<IChangePasswordMutation>({
        mutation: ChangePassword,
        variables: input,
      })
      .pipe(
        map((result) => {
          if (!result.data?.changePassword) {
            throw new Error('Failed to change password');
          }
          return result.data.changePassword;
        }),
        catchError(this.handleGraphQLError('Password change failed')),
      );
  }

  /**
   * Change password using reset token
   */
  changePasswordUsingResetToken(
    token: string,
    password: string,
    passwordConfirmation: string,
  ): Observable<LoginResponse> {
    return this.apollo
      .mutate<IChangePasswordUsingResetTokenMutation>({
        mutation: ChangePasswordUsingResetToken,
        variables: { token, password, passwordConfirmation },
      })
      .pipe(
        map((result) => {
          if (!result.data?.changePasswordUsingResetToken) {
            throw new Error('Failed to change password using reset token');
          }
          const loginResponse = result.data.changePasswordUsingResetToken;
          this._saveTokens(loginResponse);
          return loginResponse;
        }),
        catchError(this.handleGraphQLError('Password reset failed')),
      );
  }

  /**
   * Validate password reset token
   */
  validatePasswordResetToken(token?: string): Observable<UserResponse> {
    return this.apollo
      .mutate<IValidatePasswordResetTokenMutation>({
        mutation: ValidatePasswordResetToken,
        variables: { token },
      })
      .pipe(
        map((result) => {
          if (!result.data?.validatePasswordResetToken) {
            throw new Error('Failed to validate password reset token');
          }
          return result.data.validatePasswordResetToken;
        }),
        catchError(
          this.handleGraphQLError('Password reset token validation failed'),
        ),
      );
  }

  // ==================== Subscriptions ====================

  /**
   * Subscribe to refreshed access token
   */
  subscribeToRefreshedAccessToken(
    refreshToken: string,
  ): Observable<AccessTokenResponse> {
    return this.apollo
      .subscribe<IRefreshedAccessTokenSubscription>({
        query: RefreshedAccessToken,
        variables: { refreshToken },
      })
      .pipe(
        map((result) => {
          if (!result.data?.refreshedAccessToken) {
            throw new Error('Failed to subscribe to refreshed access token');
          }
          return result.data.refreshedAccessToken;
        }),
        catchError(this.handleGraphQLError('Access token subscription failed')),
      );
  }

  /**
   * Subscribe to reset password notifications
   */
  subscribeToResetPasswordNotification(
    notificationKey?: string,
  ): Observable<SuccessResponse> {
    return this.apollo
      .subscribe<IResetPasswordNotificationSubscription>({
        query: ResetPasswordNotification,
        variables: { notificationKey },
      })
      .pipe(
        map((result) => {
          if (!result.data?.resetPasswordNotification) {
            throw new Error(
              'Failed to subscribe to reset password notification',
            );
          }
          return result.data.resetPasswordNotification;
        }),
        catchError(
          this.handleGraphQLError(
            'Reset password notification subscription failed',
          ),
        ),
      );
  }

  // ==================== Error Handling ====================

  private handleGraphQLError(operation: string) {
    return (error: any) => {
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const gqlError = error.graphQLErrors[0];
        if (
          gqlError.extensions?.originalError?.message &&
          Array.isArray(gqlError.extensions.originalError.message)
        ) {
          const errorMessages = gqlError.extensions.originalError.message;
          const parsedErrors = parseValidationErrors(errorMessages);

          const customError: any = new Error(`${operation}: Validation failed`);
          customError.validationErrors = parsedErrors;
          return throwError(() => customError);
        }
      }
      return throwError(
        () => new Error(`${operation}: ${error.message || 'Unknown error'}`),
      );
    };
  }

  // ==================== Registration Methods (from original service) ====================

  getInstitutionTypes = () => {
    console.log('getInstitutionTypes');
    return this.apollo.query<any>({
      query: null as any, // Replace with actual query
      fetchPolicy: 'cache-first',
    });
  };

  submitProfileInfo(
    input: IProfileInfoInput,
    registrationId?: string,
  ): Observable<any> {
    console.log('submitProfileInfo', input);
    return this.apollo
      .mutate<any>({
        mutation: null as any, // Replace with actual mutation
        variables: { input, registrationId },
      })
      .pipe(
        map((result) => {
          if (!result.data?.submitProfileInfo) {
            throw new Error('Failed to submit profile information');
          }
          return result.data.submitProfileInfo;
        }),
        catchError(this.handleGraphQLError('Profile info submission failed')),
      );
  }

  submitInstitutionDetails(
    registrationId: string,
    input: IInstitutionDetailsInput,
  ): Observable<any> {
    return this.apollo
      .mutate<any>({
        mutation: null as any, // Replace with actual mutation
        variables: { registrationId, input },
      })
      .pipe(
        map((result) => {
          if (!result.data?.submitInstitutionDetails) {
            throw new Error('Failed to submit institution details');
          }
          return result.data.submitInstitutionDetails;
        }),
        catchError(
          this.handleGraphQLError('Institution details submission failed'),
        ),
      );
  }

  uploadDocument(file: File, input: IDocumentUploadInput): Observable<any> {
    return this.apollo
      .mutate<any>({
        mutation: null as any, // Replace with actual mutation
        variables: { file, input },
      })
      .pipe(
        map((result) => {
          if (!result.data?.uploadRegistrationDocument) {
            throw new Error('Failed to upload document');
          }
          return result.data.uploadRegistrationDocument;
        }),
        catchError(this.handleGraphQLError('Document upload failed')),
      );
  }

  submitAdminCredentials(
    registrationId: string,
    input: IAdminCredentialsInput,
  ): Observable<any> {
    return this.apollo
      .mutate<any>({
        mutation: null as any, // Replace with actual mutation
        variables: { registrationId, input },
      })
      .pipe(
        map((result) => {
          if (!result.data?.submitAdminCredentials) {
            throw new Error('Failed to submit admin credentials');
          }
          return result.data.submitAdminCredentials;
        }),
        catchError(
          this.handleGraphQLError('Admin credentials submission failed'),
        ),
      );
  }

  completeRegistration(
    registrationId: string,
    profileInfo: IProfileInfoInput,
    institutionDetails: IInstitutionDetailsInput,
    adminCredentials: IAdminCredentialsInput,
  ): Observable<any> {
    return from(
      this.apollo.mutate<any>({
        mutation: null as any, // Replace with actual mutation
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
      catchError(this.handleGraphQLError('Registration completion failed')),
    );
  }

  getRegistrationStatus(registrationId: string): Observable<any> {
    return from(
      this.apollo.query<any>({
        query: null as any, // Replace with actual query
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
      catchError(this.handleGraphQLError('Registration status fetch failed')),
    );
  }

  getRegistrationDetails(registrationId: string): Observable<any> {
    return from(
      this.apollo.query<any>({
        query: null as any, // Replace with actual query
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
      catchError(this.handleGraphQLError('Registration details fetch failed')),
    );
  }
}
