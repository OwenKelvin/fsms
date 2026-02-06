import * as Types from '@fsms/data-access/core';

import { gql } from '@apollo/client';
export type IRefreshedAccessTokenSubscriptionVariables = Types.Exact<{
  refreshToken: Types.Scalars['String']['input'];
}>;


export type IRefreshedAccessTokenSubscription = { refreshedAccessToken?: { accessToken?: string | null } | null };

export type IResetPasswordNotificationSubscriptionVariables = Types.Exact<{
  notificationKey?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type IResetPasswordNotificationSubscription = { resetPasswordNotification?: { success: boolean, message: string } | null };


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