import * as Types from '@fsms/data-access/core';

import { gql } from '@apollo/client';
export type IGetRegistrationDetailQueryVariables = Types.Exact<{
  registrationId: Types.Scalars['ID']['input'];
}>;


export type IGetRegistrationDetailQuery = { getRegistrationDetails?: { id: string, status: Types.IRegistrationStatus, createdAt: string, updatedAt: string, completedAt?: string | null, institutionId?: string | null, adminUserId?: string | null, profileInfoCompleted: boolean, institutionDetailsCompleted: boolean, documentsUploaded: boolean, adminCredentialsCompleted: boolean, institution?: { id: string, legalName?: string | null, institutionType?: Types.IInstitutionType | null, accreditationNumber?: string | null, streetAddress?: string | null, city?: string | null, stateProvince?: string | null, zipPostalCode?: string | null, officialWebsite?: string | null, active?: boolean | null } | null, adminUser?: { id: string, firstName: string, lastName: string, email: string, jobTitle?: string | null } | null, statusHistory: Array<{ id: string, previousStatus: Types.IRegistrationStatus, newStatus: Types.IRegistrationStatus, changedAt: string, changedBy?: string | null, notes?: string | null }> } | null };

export type IApproveRegistrationMutationVariables = Types.Exact<{
  input: Types.IApproveRegistrationInput;
}>;


export type IApproveRegistrationMutation = { approveRegistration: { success: boolean, message?: string | null, error?: string | null, registration?: { id: string, status: Types.IRegistrationStatus, updatedAt: string, completedAt?: string | null, institution?: { id: string, legalName?: string | null, active?: boolean | null } | null, statusHistory: Array<{ id: string, previousStatus: Types.IRegistrationStatus, newStatus: Types.IRegistrationStatus, changedAt: string, changedBy?: string | null, notes?: string | null }> } | null } };

export type IRejectRegistrationMutationVariables = Types.Exact<{
  input: Types.IRejectRegistrationInput;
}>;


export type IRejectRegistrationMutation = { rejectRegistration: { success: boolean, message?: string | null, error?: string | null, registration?: { id: string, status: Types.IRegistrationStatus, updatedAt: string, statusHistory: Array<{ id: string, previousStatus: Types.IRegistrationStatus, newStatus: Types.IRegistrationStatus, changedAt: string, changedBy?: string | null, notes?: string | null }> } | null } };


export const GetRegistrationDetail = gql`
    query GetRegistrationDetail($registrationId: ID!) {
  getRegistrationDetails(registrationId: $registrationId) {
    id
    status
    createdAt
    updatedAt
    completedAt
    institutionId
    adminUserId
    profileInfoCompleted
    institutionDetailsCompleted
    documentsUploaded
    adminCredentialsCompleted
    institution {
      id
      legalName
      institutionType
      accreditationNumber
      streetAddress
      city
      stateProvince
      zipPostalCode
      officialWebsite
      active
    }
    adminUser {
      id
      firstName
      lastName
      email
      jobTitle
    }
    statusHistory {
      id
      previousStatus
      newStatus
      changedAt
      changedBy
      notes
    }
  }
}
    `;
export const ApproveRegistration = gql`
    mutation ApproveRegistration($input: ApproveRegistrationInput!) {
  approveRegistration(input: $input) {
    success
    message
    error
    registration {
      id
      status
      updatedAt
      completedAt
      institution {
        id
        legalName
        active
      }
      statusHistory {
        id
        previousStatus
        newStatus
        changedAt
        changedBy
        notes
      }
    }
  }
}
    `;
export const RejectRegistration = gql`
    mutation RejectRegistration($input: RejectRegistrationInput!) {
  rejectRegistration(input: $input) {
    success
    message
    error
    registration {
      id
      status
      updatedAt
      statusHistory {
        id
        previousStatus
        newStatus
        changedAt
        changedBy
        notes
      }
    }
  }
}
    `;