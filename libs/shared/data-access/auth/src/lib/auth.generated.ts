import * as Types from '@fsms/data-access/core';

import { gql } from '@apollo/client';

export type ISignInWithGoogleMutationVariables = Types.Exact<{
  token: Types.Scalars['String']['input'];
}>;

export type ISignInWithGoogleMutation = {
  signInWithGoogle?: {
    accessToken: string;
    refreshToken: string;
    refreshTokenKey: string;
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    } | null;
  } | null;
};

export type ISignupGoogleUserMutationVariables = Types.Exact<{
  token: Types.Scalars['String']['input'];
}>;

export type ISignupGoogleUserMutation = {
  signupGoogleUser?: {
    accessToken: string;
    refreshToken: string;
    refreshTokenKey: string;
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    } | null;
  } | null;
};

export type IContinueWithGoogleMutationVariables = Types.Exact<{
  token: Types.Scalars['String']['input'];
}>;

export type IContinueWithGoogleMutation = {
  continueWithGoogle?: {
    accessToken: string;
    refreshToken: string;
    refreshTokenKey: string;
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    } | null;
  } | null;
};

export type ILoginWithTokenMutationVariables = Types.Exact<{
  token: Types.Scalars['String']['input'];
}>;

export type ILoginWithTokenMutation = {
  loginWithToken?: {
    accessToken: string;
    refreshToken: string;
    refreshTokenKey: string;
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    } | null;
  } | null;
};

export type ILoginWithResetPasswordTokenMutationVariables = Types.Exact<{
  token: Types.Scalars['String']['input'];
}>;

export type ILoginWithResetPasswordTokenMutation = {
  loginWithResetPasswordToken?: {
    accessToken: string;
    refreshToken: string;
    refreshTokenKey: string;
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    } | null;
  } | null;
};

export type IRequestAccessTokenMutationVariables = Types.Exact<{
  refreshToken: Types.Scalars['String']['input'];
}>;

export type IRequestAccessTokenMutation = {
  requestAccessToken?: { accessToken?: string | null } | null;
};

export type ILoginWithPasswordMutationVariables = Types.Exact<{
  email: Types.Scalars['String']['input'];
  password: Types.Scalars['String']['input'];
}>;

export type ILoginWithPasswordMutation = {
  loginWithPassword?: {
    accessToken: string;
    refreshToken: string;
    refreshTokenKey: string;
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    } | null;
  } | null;
};

export type ISendPasswordResetLinkEmailMutationVariables = Types.Exact<{
  email: Types.Scalars['String']['input'];
}>;

export type ISendPasswordResetLinkEmailMutation = {
  sendPasswordResetLinkEmail?: { success: boolean; message: string } | null;
};

export type ISendVerificationLinkEmailMutationVariables = Types.Exact<{
  [key: string]: never;
}>;

export type ISendVerificationLinkEmailMutation = {
  sendVerificationLinkEmail?: { success: boolean; message: string } | null;
};

export type IVerifyEmailMutationVariables = Types.Exact<{
  token: Types.Scalars['String']['input'];
}>;

export type IVerifyEmailMutation = {
  verifyEmail?: { success: boolean; message: string } | null;
};

export type ISendPasswordResetOtpEmailMutationVariables = Types.Exact<{
  email: Types.Scalars['String']['input'];
}>;

export type ISendPasswordResetOtpEmailMutation = {
  sendPasswordResetOtpEmail?: { success: boolean; message: string } | null;
};

export type IValidateOtpMutationVariables = Types.Exact<{
  identifier: Types.Scalars['String']['input'];
  token: Types.Scalars['String']['input'];
}>;

export type IValidateOtpMutation = {
  validateOtp?: {
    accessToken: string;
    refreshToken: string;
    refreshTokenKey: string;
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    } | null;
  } | null;
};

export type IChangePasswordMutationVariables = Types.Exact<{
  oldPassword?: Types.InputMaybe<Types.Scalars['String']['input']>;
  password: Types.Scalars['String']['input'];
  passwordConfirmation: Types.Scalars['String']['input'];
}>;

export type IChangePasswordMutation = {
  changePassword?: { success: boolean; message: string } | null;
};

export type IChangePasswordUsingResetTokenMutationVariables = Types.Exact<{
  token: Types.Scalars['String']['input'];
  password: Types.Scalars['String']['input'];
  passwordConfirmation: Types.Scalars['String']['input'];
}>;

export type IChangePasswordUsingResetTokenMutation = {
  changePasswordUsingResetToken?: {
    accessToken: string;
    refreshToken: string;
    refreshTokenKey: string;
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    } | null;
  } | null;
};

export type IValidatePasswordResetTokenMutationVariables = Types.Exact<{
  token?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type IValidatePasswordResetTokenMutation = {
  validatePasswordResetToken?: {
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    } | null;
  } | null;
};

export type IRefreshedAccessTokenSubscriptionVariables = Types.Exact<{
  refreshToken: Types.Scalars['String']['input'];
}>;

export type IRefreshedAccessTokenSubscription = {
  refreshedAccessToken?: { accessToken?: string | null } | null;
};

export type IResetPasswordNotificationSubscriptionVariables = Types.Exact<{
  notificationKey?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type IResetPasswordNotificationSubscription = {
  resetPasswordNotification?: { success: boolean; message: string } | null;
};

export const SignInWithGoogle = gql`
  mutation SignInWithGoogle($token: String!) {
    signInWithGoogle(token: $token) {
      accessToken
      refreshToken
      refreshTokenKey
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`;
export const SignupGoogleUser = gql`
  mutation SignupGoogleUser($token: String!) {
    signupGoogleUser(token: $token) {
      accessToken
      refreshToken
      refreshTokenKey
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`;
export const ContinueWithGoogle = gql`
  mutation ContinueWithGoogle($token: String!) {
    continueWithGoogle(token: $token) {
      accessToken
      refreshToken
      refreshTokenKey
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`;
export const LoginWithToken = gql`
  mutation LoginWithToken($token: String!) {
    loginWithToken(token: $token) {
      accessToken
      refreshToken
      refreshTokenKey
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`;
export const LoginWithResetPasswordToken = gql`
  mutation LoginWithResetPasswordToken($token: String!) {
    loginWithResetPasswordToken(token: $token) {
      accessToken
      refreshToken
      refreshTokenKey
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`;
export const RequestAccessToken = gql`
  mutation RequestAccessToken($refreshToken: String!) {
    requestAccessToken(refreshToken: $refreshToken) {
      accessToken
    }
  }
`;
export const LoginWithPassword = gql`
  mutation LoginWithPassword($email: String!, $password: String!) {
    loginWithPassword(email: $email, password: $password) {
      accessToken
      refreshToken
      refreshTokenKey
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`;
export const SendPasswordResetLinkEmail = gql`
  mutation SendPasswordResetLinkEmail($email: String!) {
    sendPasswordResetLinkEmail(email: $email) {
      success
      message
    }
  }
`;
export const SendVerificationLinkEmail = gql`
  mutation SendVerificationLinkEmail {
    sendVerificationLinkEmail {
      success
      message
    }
  }
`;
export const VerifyEmail = gql`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      success
      message
    }
  }
`;
export const SendPasswordResetOtpEmail = gql`
  mutation SendPasswordResetOtpEmail($email: String!) {
    sendPasswordResetOtpEmail(email: $email) {
      success
      message
    }
  }
`;
export const ValidateOtp = gql`
  mutation ValidateOtp($identifier: String!, $token: String!) {
    validateOtp(identifier: $identifier, token: $token) {
      accessToken
      refreshToken
      refreshTokenKey
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`;
export const ChangePassword = gql`
  mutation ChangePassword(
    $oldPassword: String
    $password: String!
    $passwordConfirmation: String!
  ) {
    changePassword(
      oldPassword: $oldPassword
      password: $password
      passwordConfirmation: $passwordConfirmation
    ) {
      success
      message
    }
  }
`;
export const ChangePasswordUsingResetToken = gql`
  mutation ChangePasswordUsingResetToken(
    $token: String!
    $password: String!
    $passwordConfirmation: String!
  ) {
    changePasswordUsingResetToken(
      token: $token
      password: $password
      passwordConfirmation: $passwordConfirmation
    ) {
      accessToken
      refreshToken
      refreshTokenKey
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`;
export const ValidatePasswordResetToken = gql`
  mutation ValidatePasswordResetToken($token: String) {
    validatePasswordResetToken(token: $token) {
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`;
export const RefreshedAccessToken = gql`
  subscription RefreshedAccessToken($refreshToken: String!) {
    refreshedAccessToken(refreshToken: $refreshToken) {
      accessToken
    }
  }
`;
export const ResetPasswordNotification = gql`
  subscription ResetPasswordNotification($notificationKey: String) {
    resetPasswordNotification(notificationKey: $notificationKey) {
      success
      message
    }
  }
`;
