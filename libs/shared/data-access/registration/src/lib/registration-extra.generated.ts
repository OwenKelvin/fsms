import * as Types from '@fsms/data-access/core';

import { gql } from '@apollo/client';

export type ISubmitProfileInfoMutationVariables = Types.Exact<{
  input: Types.IProfileInfoInput;
  registrationId?: Types.InputMaybe<Types.Scalars['ID']['input']>;
}>;

export type ISubmitProfileInfoMutation = {
  submitProfileInfo: {
    success: boolean;
    registrationId?: string | null;
    message?: string | null;
    errors?: Array<{ field: string; message: string }> | null;
  };
};

export type ISubmitInstitutionDetailsMutationVariables = Types.Exact<{
  registrationId: Types.Scalars['ID']['input'];
  input: Types.IInstitutionDetailsInput;
}>;

export type ISubmitInstitutionDetailsMutation = {
  submitInstitutionDetails: {
    success: boolean;
    registrationId?: string | null;
    message?: string | null;
    errors?: Array<{ field: string; message: string }> | null;
  };
};

export type IUploadDocumentMutationVariables = Types.Exact<{
  file: Types.Scalars['Upload']['input'];
  input: Types.IDocumentUploadInput;
}>;

export type IUploadDocumentMutation = {
  uploadRegistrationDocument: {
    success: boolean;
    documentId?: string | null;
    fileUploadId?: string | null;
    documentType?: Types.IDocumentType | null;
    fileName?: string | null;
    fileSize?: number | null;
    message?: string | null;
    errors?: Array<{ field: string; message: string }> | null;
  };
};

export type ISubmitAdminCredentialsMutationVariables = Types.Exact<{
  registrationId: Types.Scalars['ID']['input'];
  input: Types.IAdminCredentialsInput;
}>;

export type ISubmitAdminCredentialsMutation = {
  submitAdminCredentials: {
    success: boolean;
    registrationId?: string | null;
    message?: string | null;
    errors?: Array<{ field: string; message: string }> | null;
  };
};

export type ICompleteRegistrationMutationVariables = Types.Exact<{
  registrationId: Types.Scalars['ID']['input'];
  profileInfo: Types.IProfileInfoInput;
  institutionDetails: Types.IInstitutionDetailsInput;
  adminCredentials: Types.IAdminCredentialsInput;
}>;

export type ICompleteRegistrationMutation = {
  completeRegistration: {
    success: boolean;
    institutionId?: string | null;
    adminUserId?: string | null;
    message?: string | null;
    errors?: Array<{ field: string; message: string }> | null;
  };
};

export type IGetRegistrationStatusQueryVariables = Types.Exact<{
  registrationId: Types.Scalars['ID']['input'];
}>;

export type IGetRegistrationStatusQuery = {
  getRegistrationStatus?: {
    id: string;
    status: Types.IRegistrationStatus;
    profileInfoCompleted: boolean;
    institutionDetailsCompleted: boolean;
    documentsUploaded: boolean;
    adminCredentialsCompleted: boolean;
    createdAt: string;
    updatedAt: string;
    completedAt?: string | null;
    institutionId?: string | null;
    adminUserId?: string | null;
  } | null;
};

export type IGetRegistrationDetailsQueryVariables = Types.Exact<{
  registrationId: Types.Scalars['ID']['input'];
}>;

export type IGetRegistrationDetailsQuery = {
  getRegistrationDetails?: {
    id: string;
    status: Types.IRegistrationStatus;
    profileInfoCompleted: boolean;
    institutionDetailsCompleted: boolean;
    documentsUploaded: boolean;
    adminCredentialsCompleted: boolean;
    createdAt: string;
    updatedAt: string;
    completedAt?: string | null;
    institutionId?: string | null;
    adminUserId?: string | null;
    institution?: {
      id: string;
      legalName?: string | null;
      institutionType?: Types.IInstitutionType | null;
      accreditationNumber?: string | null;
      streetAddress?: string | null;
      city?: string | null;
      stateProvince?: string | null;
      zipPostalCode?: string | null;
      officialWebsite?: string | null;
    } | null;
    adminUser?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    } | null;
    statusHistory: Array<{
      id: string;
      previousStatus: Types.IRegistrationStatus;
      newStatus: Types.IRegistrationStatus;
      changedAt: string;
      changedBy?: string | null;
      notes?: string | null;
    }>;
  } | null;
};

export type IGetRegistrationsQueryVariables = Types.Exact<{
  filter?: Types.InputMaybe<Types.IRegistrationFilterInput>;
}>;

export type IGetRegistrationsQuery = {
  getRegistrations: Array<{
    id: string;
    status: Types.IRegistrationStatus;
    profileInfoCompleted: boolean;
    institutionDetailsCompleted: boolean;
    documentsUploaded: boolean;
    adminCredentialsCompleted: boolean;
    createdAt: string;
    updatedAt: string;
    completedAt?: string | null;
    institutionId?: string | null;
    adminUserId?: string | null;
    institution?: {
      id: string;
      legalName?: string | null;
      institutionType?: Types.IInstitutionType | null;
    } | null;
    adminUser?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    } | null;
  }>;
};

export type IGetRegistrationsRequiringReviewQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type IGetRegistrationsRequiringReviewQuery = {
  getRegistrationsRequiringReview: Array<{
    id: string;
    status: Types.IRegistrationStatus;
    profileInfoCompleted: boolean;
    institutionDetailsCompleted: boolean;
    documentsUploaded: boolean;
    adminCredentialsCompleted: boolean;
    createdAt: string;
    updatedAt: string;
    completedAt?: string | null;
    institutionId?: string | null;
    adminUserId?: string | null;
    institution?: {
      id: string;
      legalName?: string | null;
      institutionType?: Types.IInstitutionType | null;
    } | null;
    adminUser?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    } | null;
    statusHistory: Array<{
      id: string;
      previousStatus: Types.IRegistrationStatus;
      newStatus: Types.IRegistrationStatus;
      changedAt: string;
      changedBy?: string | null;
      notes?: string | null;
    }>;
  }>;
};

export type IGetInstitutionTypesQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type IGetInstitutionTypesQuery = {
  institutionTypes: Array<{ description: string; key: Types.IInstitutionType }>;
};

export const SubmitProfileInfo = gql`
  mutation SubmitProfileInfo($input: ProfileInfoInput!, $registrationId: ID) {
    submitProfileInfo(input: $input, registrationId: $registrationId) {
      success
      registrationId
      message
      errors {
        field
        message
      }
    }
  }
`;
export const SubmitInstitutionDetails = gql`
  mutation SubmitInstitutionDetails(
    $registrationId: ID!
    $input: InstitutionDetailsInput!
  ) {
    submitInstitutionDetails(registrationId: $registrationId, input: $input) {
      success
      registrationId
      message
      errors {
        field
        message
      }
    }
  }
`;
export const UploadDocument = gql`
  mutation UploadDocument($file: Upload!, $input: DocumentUploadInput!) {
    uploadRegistrationDocument(file: $file, input: $input) {
      success
      documentId
      fileUploadId
      documentType
      fileName
      fileSize
      message
      errors {
        field
        message
      }
    }
  }
`;
export const SubmitAdminCredentials = gql`
  mutation SubmitAdminCredentials(
    $registrationId: ID!
    $input: AdminCredentialsInput!
  ) {
    submitAdminCredentials(registrationId: $registrationId, input: $input) {
      success
      registrationId
      message
      errors {
        field
        message
      }
    }
  }
`;
export const CompleteRegistration = gql`
  mutation CompleteRegistration(
    $registrationId: ID!
    $profileInfo: ProfileInfoInput!
    $institutionDetails: InstitutionDetailsInput!
    $adminCredentials: AdminCredentialsInput!
  ) {
    completeRegistration(
      registrationId: $registrationId
      profileInfo: $profileInfo
      institutionDetails: $institutionDetails
      adminCredentials: $adminCredentials
    ) {
      success
      institutionId
      adminUserId
      message
      errors {
        field
        message
      }
    }
  }
`;
export const GetRegistrationStatus = gql`
  query GetRegistrationStatus($registrationId: ID!) {
    getRegistrationStatus(registrationId: $registrationId) {
      id
      status
      profileInfoCompleted
      institutionDetailsCompleted
      documentsUploaded
      adminCredentialsCompleted
      createdAt
      updatedAt
      completedAt
      institutionId
      adminUserId
    }
  }
`;
export const GetRegistrationDetails = gql`
  query GetRegistrationDetails($registrationId: ID!) {
    getRegistrationDetails(registrationId: $registrationId) {
      id
      status
      profileInfoCompleted
      institutionDetailsCompleted
      documentsUploaded
      adminCredentialsCompleted
      createdAt
      updatedAt
      completedAt
      institutionId
      adminUserId
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
      }
      adminUser {
        id
        firstName
        lastName
        email
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
export const GetRegistrations = gql`
  query GetRegistrations($filter: RegistrationFilterInput) {
    getRegistrations(filter: $filter) {
      id
      status
      profileInfoCompleted
      institutionDetailsCompleted
      documentsUploaded
      adminCredentialsCompleted
      createdAt
      updatedAt
      completedAt
      institutionId
      adminUserId
      institution {
        id
        legalName
        institutionType
      }
      adminUser {
        id
        firstName
        lastName
        email
      }
    }
  }
`;
export const GetRegistrationsRequiringReview = gql`
  query GetRegistrationsRequiringReview {
    getRegistrationsRequiringReview {
      id
      status
      profileInfoCompleted
      institutionDetailsCompleted
      documentsUploaded
      adminCredentialsCompleted
      createdAt
      updatedAt
      completedAt
      institutionId
      adminUserId
      institution {
        id
        legalName
        institutionType
      }
      adminUser {
        id
        firstName
        lastName
        email
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
export const GetInstitutionTypes = gql`
  query GetInstitutionTypes {
    institutionTypes {
      description
      key
    }
  }
`;
