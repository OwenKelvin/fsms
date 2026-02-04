import * as Types from '@fsms/data-access/core';

import { gql } from '@apollo/client';

export type ISubmitProfileInfoMutationVariables = Types.Exact<{
  [key: string]: never;
}>;

export type ISubmitProfileInfoMutation = {
  submitProfileInfo: {
    success: boolean;
    registrationId?: number | null;
    message?: string | null;
    errors?: Array<{ field: string; message: string }> | null;
  };
};

export type ISubmitInstitutionDetailsMutationVariables = Types.Exact<{
  [key: string]: never;
}>;

export type ISubmitInstitutionDetailsMutation = {
  submitInstitutionDetails: {
    success: boolean;
    registrationId?: number | null;
    message?: string | null;
    errors?: Array<{ field: string; message: string }> | null;
  };
};

export type IUploadDocumentMutationVariables = Types.Exact<{
  file: Types.Scalars['Upload']['input'];
}>;

export type IUploadDocumentMutation = {
  uploadRegistrationDocument: {
    success: boolean;
    documentId?: number | null;
    fileUploadId?: number | null;
    fileName?: string | null;
    message?: string | null;
    errors?: Array<{ field: string; message: string }> | null;
  };
};

export type ISubmitAdminCredentialsMutationVariables = Types.Exact<{
  [key: string]: never;
}>;

export type ISubmitAdminCredentialsMutation = {
  submitAdminCredentials: {
    success: boolean;
    registrationId?: number | null;
    message?: string | null;
    errors?: Array<{ field: string; message: string }> | null;
  };
};

export type ICompleteRegistrationMutationVariables = Types.Exact<{
  [key: string]: never;
}>;

export type ICompleteRegistrationMutation = {
  completeRegistration: {
    success: boolean;
    institutionId?: number | null;
    adminUserId?: number | null;
    message?: string | null;
    errors?: Array<{ field: string; message: string }> | null;
  };
};

export type IGetRegistrationStatusQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type IGetRegistrationStatusQuery = {
  getRegistrationStatus?: {
    id: number;
    status: Types.IRegistrationStatus;
    profileInfoCompleted: boolean;
    institutionDetailsCompleted: boolean;
    documentsUploaded: boolean;
    adminCredentialsCompleted: boolean;
    createdAt: string;
    completedAt?: string | null;
  } | null;
};

export type IGetRegistrationDetailsQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type IGetRegistrationDetailsQuery = {
  getRegistrationDetails?: {
    id: number;
    status: Types.IRegistrationStatus;
    institution?: {
      id: number;
      legalName?: string | null;
      institutionType?: string | null;
    } | null;
    adminUser?: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
    } | null;
    statusHistory: Array<{
      previousStatus: Types.IRegistrationStatus;
      newStatus: Types.IRegistrationStatus;
      changedAt: string;
      changedBy?: string | null;
    }>;
  } | null;
};

export const SubmitProfileInfo = gql`
  mutation SubmitProfileInfo {
    submitProfileInfo(
      input: {
        firstName: "John"
        lastName: "Doe"
        jobTitle: "Principal"
        email: "john.doe@school.edu"
      }
    ) {
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
  mutation SubmitInstitutionDetails {
    submitInstitutionDetails(
      registrationId: 123
      input: {
        legalName: "Springfield High School"
        institutionType: EDUCATIONAL
        accreditationNumber: "ACC-2024-12345"
        streetAddress: "123 Main Street"
        city: "Springfield"
        stateProvince: "Illinois"
        zipPostalCode: "62701"
        officialWebsite: "https://springfield-hs.edu"
      }
    ) {
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
  mutation UploadDocument($file: Upload!) {
    uploadRegistrationDocument(
      file: $file
      input: { registrationId: 123, documentType: ACCREDITATION_CERTIFICATE }
    ) {
      success
      documentId
      fileUploadId
      fileName
      message
      errors {
        field
        message
      }
    }
  }
`;
export const SubmitAdminCredentials = gql`
  mutation SubmitAdminCredentials {
    submitAdminCredentials(
      registrationId: 123
      input: {
        username: "johndoe_admin"
        password: "SecureP@ssw0rd123"
        passwordConfirmation: "SecureP@ssw0rd123"
        enableTwoFactor: true
      }
    ) {
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
  mutation CompleteRegistration {
    completeRegistration(
      registrationId: 123
      profileInfo: {
        firstName: "John"
        lastName: "Doe"
        jobTitle: "Principal"
        email: "john.doe@school.edu"
      }
      institutionDetails: {
        legalName: "Springfield High School"
        institutionType: EDUCATIONAL
        accreditationNumber: "ACC-2024-12345"
        streetAddress: "123 Main Street"
        city: "Springfield"
        stateProvince: "Illinois"
        zipPostalCode: "62701"
        officialWebsite: "https://springfield-hs.edu"
      }
      adminCredentials: {
        username: "johndoe_admin"
        password: "SecureP@ssw0rd123"
        passwordConfirmation: "SecureP@ssw0rd123"
        enableTwoFactor: true
      }
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
  query GetRegistrationStatus {
    getRegistrationStatus(registrationId: 123) {
      id
      status
      profileInfoCompleted
      institutionDetailsCompleted
      documentsUploaded
      adminCredentialsCompleted
      createdAt
      completedAt
    }
  }
`;
export const GetRegistrationDetails = gql`
  query GetRegistrationDetails {
    getRegistrationDetails(registrationId: 123) {
      id
      status
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
        previousStatus
        newStatus
        changedAt
        changedBy
      }
    }
  }
`;
