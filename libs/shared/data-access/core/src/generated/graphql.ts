export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Upload: { input: any; output: any; }
};

export type IAccessToken = {
  __typename?: 'AccessToken';
  accessToken?: Maybe<Scalars['String']['output']>;
};

export type IActivityLogModel = {
  __typename?: 'ActivityLogModel';
  action: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  type?: Maybe<IActivityLogType>;
  userId: Scalars['Int']['output'];
};

export enum IActivityLogType {
  Error = 'ERROR',
  Info = 'INFO',
  Success = 'SUCCESS',
  Warning = 'WARNING'
}

export type IActivityLogUserModel = {
  __typename?: 'ActivityLogUserModel';
  action: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  type?: Maybe<IActivityLogType>;
  userId: Scalars['Int']['output'];
};

export type IAdminCredentialsInput = {
  enableTwoFactor?: InputMaybe<Scalars['Boolean']['input']>;
  password: Scalars['String']['input'];
  passwordConfirmation: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type IAssignExamineeToExamPaperInput = {
  examPaperId: Scalars['Int']['input'];
  examineeGroups: Array<ISelectCategory>;
};

export type IChoiceModel = {
  __typename?: 'ChoiceModel';
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isCorrectChoice?: Maybe<Scalars['Boolean']['output']>;
  question: IQuestionModel;
  questionId: Scalars['Int']['output'];
};

export enum IChoiceType {
  CheckBox = 'CheckBox',
  Input = 'Input',
  Radio = 'Radio'
}

export type ICompleteRegistrationResponse = {
  __typename?: 'CompleteRegistrationResponse';
  adminUserId?: Maybe<Scalars['Int']['output']>;
  errors?: Maybe<Array<IValidationError>>;
  institutionId?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type IConfigModel = {
  __typename?: 'ConfigModel';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  type?: Maybe<IConfigType>;
};

export enum IConfigType {
  Exam = 'EXAM',
  ExamPaper = 'EXAM_PAPER'
}

export type ICountriesLanguagesInput = {
  countryId: Scalars['Int']['input'];
  languageId: Scalars['Int']['input'];
};

export type ICreateActivityLogInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ICreateActivityLogSuccessResponse = {
  __typename?: 'CreateActivityLogSuccessResponse';
  data: IActivityLogModel;
  message: Scalars['String']['output'];
};

export type ICreateChoiceInput = {
  description: Scalars['String']['input'];
  isCorrectChoice?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ICreateChoiceSuccessResponse = {
  __typename?: 'CreateChoiceSuccessResponse';
  data: IChoiceModel;
  message: Scalars['String']['output'];
};

export type ICreateConfigInput = {
  name: Scalars['String']['input'];
  type?: InputMaybe<IConfigType>;
};

export type ICreateConfigSuccessResponse = {
  __typename?: 'CreateConfigSuccessResponse';
  data: IConfigModel;
  message: Scalars['String']['output'];
};

export type ICreateCreditInput = {
  balance: Scalars['Int']['input'];
};

export type ICreateCreditSuccessResponse = {
  __typename?: 'CreateCreditSuccessResponse';
  data: ICreditModel;
  message: Scalars['String']['output'];
};

export type ICreateExamInput = {
  configs: Array<InputMaybe<IExamConfigInput>>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  startDate?: InputMaybe<Scalars['String']['input']>;
  tags: Array<InputMaybe<IExamTagInput>>;
};

export type ICreateExamPaperInput = {
  configs: Array<InputMaybe<IExamConfigInput>>;
  examId: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  paperDate?: InputMaybe<Scalars['String']['input']>;
  tags: Array<InputMaybe<IExamTagInput>>;
};

export type ICreateExamPaperSuccessResponse = {
  __typename?: 'CreateExamPaperSuccessResponse';
  data: IExamPaperModel;
  message: Scalars['String']['output'];
};

export type ICreateExamSuccessResponse = {
  __typename?: 'CreateExamSuccessResponse';
  data: IExamModel;
  message: Scalars['String']['output'];
};

export type ICreateExamineeGroupInput = {
  examinees?: InputMaybe<Array<InputMaybe<ICreateGroupExamineeInput>>>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ICreateExamineeGroupSuccessResponse = {
  __typename?: 'CreateExamineeGroupSuccessResponse';
  data: IExamineeGroupModel;
  message: Scalars['String']['output'];
};

export type ICreateExamineeInput = {
  otherDetails?: InputMaybe<IExamineeOtherDetailsInput>;
  uniqueIdentifier: Scalars['String']['input'];
};

export type ICreateExamineeSuccessResponse = {
  __typename?: 'CreateExamineeSuccessResponse';
  data: IExamineeModel;
  message: Scalars['String']['output'];
};

export type ICreateGroupExamineeInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  otherDetails?: InputMaybe<IExamineeOtherDetailsInput>;
  uniqueIdentifier?: InputMaybe<Scalars['String']['input']>;
};

export type ICreateInstitutionInput = {
  accreditationNumber?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  institutionType?: InputMaybe<Scalars['String']['input']>;
  legalName?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  officialWebsite?: InputMaybe<Scalars['String']['input']>;
  stateProvince?: InputMaybe<Scalars['String']['input']>;
  streetAddress?: InputMaybe<Scalars['String']['input']>;
  zipPostalCode?: InputMaybe<Scalars['String']['input']>;
};

export type ICreateInstitutionSuccessResponse = {
  __typename?: 'CreateInstitutionSuccessResponse';
  data: IInstitutionModel;
  message: Scalars['String']['output'];
};

export type ICreateInstructionInput = {
  description: Scalars['String']['input'];
  examPaperId: Scalars['Int']['input'];
};

export type ICreateInstructionSuccessResponse = {
  __typename?: 'CreateInstructionSuccessResponse';
  data: IInstructionModel;
  message: Scalars['String']['output'];
};

export type ICreateNotificationInput = {
  description: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type ICreateNotificationSuccessResponse = {
  __typename?: 'CreateNotificationSuccessResponse';
  data: INotificationModel;
  message: Scalars['String']['output'];
};

export type ICreateOtpInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ICreateOtpSuccessResponse = {
  __typename?: 'CreateOtpSuccessResponse';
  data: IOtpModel;
  message: Scalars['String']['output'];
};

export type ICreatePasswordResetInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ICreatePasswordResetSuccessResponse = {
  __typename?: 'CreatePasswordResetSuccessResponse';
  data: IPasswordResetModel;
  message: Scalars['String']['output'];
};

export type ICreatePaymentInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ICreatePaymentSuccessResponse = {
  __typename?: 'CreatePaymentSuccessResponse';
  data: IPaymentModel;
  message: Scalars['String']['output'];
};

export type ICreatePermissionInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ICreatePermissionSuccessResponse = {
  __typename?: 'CreatePermissionSuccessResponse';
  data: IPermissionModel;
  message: Scalars['String']['output'];
};

export type ICreatePlanInfoInput = {
  description: Scalars['String']['input'];
  planId: Scalars['Int']['input'];
};

export type ICreatePlanInfoPlanInput = {
  description: Scalars['String']['input'];
};

export type ICreatePlanInfoSuccessResponse = {
  __typename?: 'CreatePlanInfoSuccessResponse';
  data: IPlanInfoModel;
  message: Scalars['String']['output'];
};

export type ICreatePlanInput = {
  costPerCreditInKES: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  planInfos?: InputMaybe<Array<InputMaybe<ICreatePlanInfoPlanInput>>>;
  tagLine: Scalars['String']['input'];
};

export type ICreatePlanSuccessResponse = {
  __typename?: 'CreatePlanSuccessResponse';
  data: IPlanModel;
  message: Scalars['String']['output'];
};

export type ICreateQuestionInput = {
  autoMark?: InputMaybe<Scalars['Boolean']['input']>;
  choiceType: IChoiceType;
  choices: Array<InputMaybe<ICreateChoiceInput>>;
  correctChoiceExplanation?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  examPaperId: Scalars['Int']['input'];
  tags: Array<InputMaybe<IQuestionTagInput>>;
};

export type ICreateQuestionSuccessResponse = {
  __typename?: 'CreateQuestionSuccessResponse';
  data: IQuestionModel;
  message: Scalars['String']['output'];
};

export type ICreateQuoteInput = {
  creditAmount: Scalars['Int']['input'];
  planId: Scalars['Int']['input'];
};

export type ICreateQuoteSuccessResponse = {
  __typename?: 'CreateQuoteSuccessResponse';
  data: IQuoteModel;
  message: Scalars['String']['output'];
};

export type ICreateRoleInput = {
  name: Scalars['String']['input'];
};

export type ICreateRoleSuccessResponse = {
  __typename?: 'CreateRoleSuccessResponse';
  data: IRoleModel;
  message: Scalars['String']['output'];
};

export type ICreateSettingInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ICreateSettingSuccessResponse = {
  __typename?: 'CreateSettingSuccessResponse';
  data: ISettingModel;
  message: Scalars['String']['output'];
};

export type ICreateSuccessStringIdResponse = {
  __typename?: 'CreateSuccessStringIdResponse';
  id: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type ICreateTagInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ICreateTagSuccessResponse = {
  __typename?: 'CreateTagSuccessResponse';
  data: ITagModel;
  message: Scalars['String']['output'];
};

export type ICreateTransactionInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ICreateTransactionSuccessResponse = {
  __typename?: 'CreateTransactionSuccessResponse';
  data: ITransactionModel;
  message: Scalars['String']['output'];
};

export type ICreateUserSuccessResponse = {
  __typename?: 'CreateUserSuccessResponse';
  data: IUserModel;
  message: Scalars['String']['output'];
};

export type ICreditModel = {
  __typename?: 'CreditModel';
  balance: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
};

export enum ICurrencyModel {
  Kes = 'KES'
}

export type IDeleteSuccessResponse = {
  __typename?: 'DeleteSuccessResponse';
  message: Scalars['String']['output'];
};

export enum IDocumentType {
  AccreditationCertificate = 'ACCREDITATION_CERTIFICATE',
  OperatingLicense = 'OPERATING_LICENSE'
}

export type IDocumentUploadInput = {
  documentType: IDocumentType;
  registrationId: Scalars['Int']['input'];
};

export type IDocumentUploadResponse = {
  __typename?: 'DocumentUploadResponse';
  documentId?: Maybe<Scalars['Int']['output']>;
  documentType?: Maybe<IDocumentType>;
  errors?: Maybe<Array<IValidationError>>;
  fileName?: Maybe<Scalars['String']['output']>;
  fileSize?: Maybe<Scalars['Int']['output']>;
  fileUploadId?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type IExamConfig = {
  __typename?: 'ExamConfig';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  selected?: Maybe<Scalars['Boolean']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type IExamConfigInput = {
  id: Scalars['Int']['input'];
  selected: Scalars['Boolean']['input'];
  value?: InputMaybe<Scalars['String']['input']>;
};

export type IExamModel = {
  __typename?: 'ExamModel';
  configs: Array<Maybe<IExamConfig>>;
  createdAt: Scalars['String']['output'];
  endDate?: Maybe<Scalars['String']['output']>;
  examPapers?: Maybe<Array<Maybe<IExamPaperModel>>>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  startDate?: Maybe<Scalars['String']['output']>;
  tags: Array<Maybe<ITagModel>>;
};

export type IExamPaperModel = {
  __typename?: 'ExamPaperModel';
  configs: Array<Maybe<IExamConfig>>;
  createdAt: Scalars['String']['output'];
  exam?: Maybe<IExamModel>;
  examId: Scalars['Int']['output'];
  examineeGroups?: Maybe<Array<Maybe<IExamineeGroupModel>>>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  paperDate?: Maybe<Scalars['String']['output']>;
  publishedAt?: Maybe<Scalars['String']['output']>;
  tags: Array<Maybe<ITagModel>>;
};

export type IExamTagInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type IExamineeGroupModel = {
  __typename?: 'ExamineeGroupModel';
  examinees?: Maybe<Array<Maybe<IExamineeModel>>>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type IExamineeModel = {
  __typename?: 'ExamineeModel';
  id: Scalars['Int']['output'];
  otherDetails?: Maybe<IExamineeOtherDetails>;
  uniqueIdentifier: Scalars['String']['output'];
};

export type IExamineeOtherDetails = {
  __typename?: 'ExamineeOtherDetails';
  firstName?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
};

export type IExamineeOtherDetailsInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
};

export type IFileUploadModel = {
  __typename?: 'FileUploadModel';
  id: Scalars['Int']['output'];
  mimetype?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  originalName?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type IInstitutionDetailsInput = {
  accreditationNumber: Scalars['String']['input'];
  city: Scalars['String']['input'];
  institutionType: IInstitutionType;
  legalName: Scalars['String']['input'];
  officialWebsite?: InputMaybe<Scalars['String']['input']>;
  stateProvince: Scalars['String']['input'];
  streetAddress: Scalars['String']['input'];
  zipPostalCode: Scalars['String']['input'];
};

export type IInstitutionModel = {
  __typename?: 'InstitutionModel';
  accreditationNumber?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  institutionType?: Maybe<Scalars['String']['output']>;
  legalName?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  officialWebsite?: Maybe<Scalars['String']['output']>;
  stateProvince?: Maybe<Scalars['String']['output']>;
  streetAddress?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  zipPostalCode?: Maybe<Scalars['String']['output']>;
};

export enum IInstitutionType {
  Corporate = 'CORPORATE',
  Educational = 'EDUCATIONAL',
  Government = 'GOVERNMENT',
  Healthcare = 'HEALTHCARE',
  NonProfit = 'NON_PROFIT'
}

export type IInstructionModel = {
  __typename?: 'InstructionModel';
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
};

export type ILoginResponse = {
  __typename?: 'LoginResponse';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  refreshTokenKey: Scalars['String']['output'];
  user?: Maybe<IUserModel>;
};

export type IMutation = {
  __typename?: 'Mutation';
  assignExamineeGroupToExamPaper?: Maybe<ISuccessResponse>;
  assignRoleToUser?: Maybe<ISuccessResponse>;
  changePassword?: Maybe<ISuccessResponse>;
  changePasswordUsingResetToken?: Maybe<ILoginResponse>;
  completeRegistration: ICompleteRegistrationResponse;
  continueWithGoogle?: Maybe<ILoginResponse>;
  createActivityLog?: Maybe<ICreateActivityLogSuccessResponse>;
  createChoice?: Maybe<ICreateChoiceSuccessResponse>;
  createConfig?: Maybe<ICreateConfigSuccessResponse>;
  createCredit?: Maybe<ICreateCreditSuccessResponse>;
  createExam?: Maybe<ICreateExamSuccessResponse>;
  createExamPaper?: Maybe<ICreateExamPaperSuccessResponse>;
  createExaminee?: Maybe<ICreateExamineeSuccessResponse>;
  createExamineeGroup?: Maybe<ICreateExamineeGroupSuccessResponse>;
  createInstitution?: Maybe<ICreateInstitutionSuccessResponse>;
  createInstruction?: Maybe<ICreateInstructionSuccessResponse>;
  createNotification?: Maybe<ICreateNotificationSuccessResponse>;
  createOtp?: Maybe<ICreateOtpSuccessResponse>;
  createPasswordReset?: Maybe<ICreatePasswordResetSuccessResponse>;
  createPayment?: Maybe<ICreatePaymentSuccessResponse>;
  createPermission?: Maybe<ICreatePermissionSuccessResponse>;
  createPlan?: Maybe<ICreatePlanSuccessResponse>;
  createPlanInfo?: Maybe<ICreatePlanInfoSuccessResponse>;
  createQuestion?: Maybe<ICreateQuestionSuccessResponse>;
  createQuote?: Maybe<ICreateQuoteSuccessResponse>;
  createRole?: Maybe<ICreateRoleSuccessResponse>;
  createSetting?: Maybe<ICreateSettingSuccessResponse>;
  createTag?: Maybe<ICreateTagSuccessResponse>;
  createTransaction?: Maybe<ICreateTransactionSuccessResponse>;
  createUser?: Maybe<ICreateUserSuccessResponse>;
  deleteActivityLog?: Maybe<IDeleteSuccessResponse>;
  deleteChoice?: Maybe<IDeleteSuccessResponse>;
  deleteConfig?: Maybe<IDeleteSuccessResponse>;
  deleteCredit?: Maybe<IDeleteSuccessResponse>;
  deleteExam?: Maybe<IDeleteSuccessResponse>;
  deleteExamPaper?: Maybe<IDeleteSuccessResponse>;
  deleteExaminee?: Maybe<IDeleteSuccessResponse>;
  deleteExamineeGroup?: Maybe<IDeleteSuccessResponse>;
  deleteInstitution?: Maybe<IDeleteSuccessResponse>;
  deleteInstruction?: Maybe<IDeleteSuccessResponse>;
  deleteNotification?: Maybe<IDeleteSuccessResponse>;
  deleteOtp?: Maybe<IDeleteSuccessResponse>;
  deletePasswordReset?: Maybe<IDeleteSuccessResponse>;
  deletePayment?: Maybe<IDeleteSuccessResponse>;
  deletePermission?: Maybe<IDeleteSuccessResponse>;
  deletePlan?: Maybe<IDeleteSuccessResponse>;
  deletePlanInfo?: Maybe<IDeleteSuccessResponse>;
  deleteQuestion?: Maybe<IDeleteSuccessResponse>;
  deleteQuote?: Maybe<IDeleteSuccessResponse>;
  deleteRole?: Maybe<IDeleteSuccessResponse>;
  deleteSetting?: Maybe<IDeleteSuccessResponse>;
  deleteTag?: Maybe<IDeleteSuccessResponse>;
  deleteTransaction?: Maybe<IDeleteSuccessResponse>;
  deleteUser?: Maybe<IDeleteSuccessResponse>;
  givePermissionsToRole?: Maybe<ISuccessResponse>;
  healthCheck?: Maybe<Scalars['String']['output']>;
  loginWithPassword?: Maybe<ILoginResponse>;
  loginWithResetPasswordToken?: Maybe<ILoginResponse>;
  loginWithToken?: Maybe<ILoginResponse>;
  markNotificationAsRead?: Maybe<INotificationMarkedAsReadResponse>;
  publishExamPaper?: Maybe<ICreateExamPaperSuccessResponse>;
  register?: Maybe<ILoginResponse>;
  requestAccessToken?: Maybe<IAccessToken>;
  requestMpesaStk?: Maybe<ISuccessResponse>;
  sendPasswordResetLinkEmail?: Maybe<ISuccessResponse>;
  sendPasswordResetOtpEmail?: Maybe<ISuccessResponse>;
  sendVerificationLinkEmail?: Maybe<ISuccessResponse>;
  signInWithGoogle?: Maybe<ILoginResponse>;
  signupGoogleUser?: Maybe<ILoginResponse>;
  submitAdminCredentials: IRegistrationStepResponse;
  submitInstitutionDetails: IRegistrationStepResponse;
  submitProfileInfo: IRegistrationStepResponse;
  testNotification?: Maybe<Scalars['String']['output']>;
  updateActivityLog?: Maybe<ICreateActivityLogSuccessResponse>;
  updateChoice?: Maybe<ICreateChoiceSuccessResponse>;
  updateConfig?: Maybe<ICreateConfigSuccessResponse>;
  updateCredit?: Maybe<ICreateCreditSuccessResponse>;
  updateExam?: Maybe<ICreateExamSuccessResponse>;
  updateExamPaper?: Maybe<ICreateExamPaperSuccessResponse>;
  updateExaminee?: Maybe<ICreateExamineeSuccessResponse>;
  updateExamineeGroup?: Maybe<ICreateExamineeGroupSuccessResponse>;
  updateInstitution?: Maybe<ICreateInstitutionSuccessResponse>;
  updateInstruction?: Maybe<ICreateInstructionSuccessResponse>;
  updateNotification?: Maybe<ICreateNotificationSuccessResponse>;
  updateOtp?: Maybe<ICreateOtpSuccessResponse>;
  updatePasswordReset?: Maybe<ICreatePasswordResetSuccessResponse>;
  updatePayment?: Maybe<ICreatePaymentSuccessResponse>;
  updatePermission?: Maybe<ICreatePermissionSuccessResponse>;
  updatePlan?: Maybe<ICreatePlanSuccessResponse>;
  updatePlanInfo?: Maybe<ICreatePlanInfoSuccessResponse>;
  updateQuestion?: Maybe<ICreateQuestionSuccessResponse>;
  updateQuote?: Maybe<ICreateQuoteSuccessResponse>;
  updateRole?: Maybe<ICreateRoleSuccessResponse>;
  updateSetting?: Maybe<ICreateSettingSuccessResponse>;
  updateTag?: Maybe<ICreateTagSuccessResponse>;
  updateTransaction?: Maybe<ICreateTransactionSuccessResponse>;
  updateUser?: Maybe<ICreateUserSuccessResponse>;
  uploadRegistrationDocument: IDocumentUploadResponse;
  uploadSingleFile: IUploadSuccessResponse;
  validateOtp?: Maybe<ILoginResponse>;
  validatePasswordResetToken?: Maybe<IValidatePasswordResetTokenResponse>;
  verifyEmail?: Maybe<ISuccessResponse>;
};


export type IMutationAssignExamineeGroupToExamPaperArgs = {
  params?: InputMaybe<IAssignExamineeToExamPaperInput>;
};


export type IMutationAssignRoleToUserArgs = {
  roles?: InputMaybe<Array<InputMaybe<ISelectCategory>>>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};


export type IMutationChangePasswordArgs = {
  oldPassword?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  passwordConfirmation: Scalars['String']['input'];
};


export type IMutationChangePasswordUsingResetTokenArgs = {
  password: Scalars['String']['input'];
  passwordConfirmation: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type IMutationCompleteRegistrationArgs = {
  adminCredentials: IAdminCredentialsInput;
  institutionDetails: IInstitutionDetailsInput;
  profileInfo: IProfileInfoInput;
  registrationId: Scalars['Int']['input'];
};


export type IMutationContinueWithGoogleArgs = {
  token: Scalars['String']['input'];
};


export type IMutationCreateActivityLogArgs = {
  params?: InputMaybe<ICreateActivityLogInput>;
};


export type IMutationCreateChoiceArgs = {
  params?: InputMaybe<ICreateChoiceInput>;
};


export type IMutationCreateConfigArgs = {
  params: ICreateConfigInput;
};


export type IMutationCreateCreditArgs = {
  params?: InputMaybe<ICreateCreditInput>;
};


export type IMutationCreateExamArgs = {
  params: ICreateExamInput;
};


export type IMutationCreateExamPaperArgs = {
  params: ICreateExamPaperInput;
};


export type IMutationCreateExamineeArgs = {
  params?: InputMaybe<ICreateExamineeInput>;
};


export type IMutationCreateExamineeGroupArgs = {
  params?: InputMaybe<ICreateExamineeGroupInput>;
};


export type IMutationCreateInstitutionArgs = {
  params?: InputMaybe<ICreateInstitutionInput>;
};


export type IMutationCreateInstructionArgs = {
  params?: InputMaybe<ICreateInstructionInput>;
};


export type IMutationCreateNotificationArgs = {
  params?: InputMaybe<ICreateNotificationInput>;
};


export type IMutationCreateOtpArgs = {
  name: Scalars['String']['input'];
};


export type IMutationCreatePasswordResetArgs = {
  name: Scalars['String']['input'];
};


export type IMutationCreatePaymentArgs = {
  params?: InputMaybe<ICreatePaymentInput>;
};


export type IMutationCreatePermissionArgs = {
  name: Scalars['String']['input'];
};


export type IMutationCreatePlanArgs = {
  params?: InputMaybe<ICreatePlanInput>;
};


export type IMutationCreatePlanInfoArgs = {
  params?: InputMaybe<ICreatePlanInfoInput>;
};


export type IMutationCreateQuestionArgs = {
  params?: InputMaybe<ICreateQuestionInput>;
};


export type IMutationCreateQuoteArgs = {
  params?: InputMaybe<ICreateQuoteInput>;
};


export type IMutationCreateRoleArgs = {
  name: Scalars['String']['input'];
};


export type IMutationCreateSettingArgs = {
  params?: InputMaybe<ICreateSettingInput>;
};


export type IMutationCreateTagArgs = {
  params?: InputMaybe<ICreateTagInput>;
};


export type IMutationCreateTransactionArgs = {
  params?: InputMaybe<ICreateTransactionInput>;
};


export type IMutationCreateUserArgs = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  middleName?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};


export type IMutationDeleteActivityLogArgs = {
  id: Scalars['Int']['input'];
};


export type IMutationDeleteChoiceArgs = {
  id: Scalars['Int']['input'];
};


export type IMutationDeleteConfigArgs = {
  id: Scalars['Int']['input'];
};


export type IMutationDeleteCreditArgs = {
  id: Scalars['Int']['input'];
};


export type IMutationDeleteExamArgs = {
  id: Scalars['Int']['input'];
};


export type IMutationDeleteExamPaperArgs = {
  id: Scalars['Int']['input'];
};


export type IMutationDeleteExamineeArgs = {
  id: Scalars['Int']['input'];
};


export type IMutationDeleteExamineeGroupArgs = {
  id: Scalars['Int']['input'];
};


export type IMutationDeleteInstitutionArgs = {
  id: Scalars['Int']['input'];
};


export type IMutationDeleteInstructionArgs = {
  id: Scalars['Int']['input'];
};


export type IMutationDeleteNotificationArgs = {
  id: Scalars['Int']['input'];
};


export type IMutationDeleteOtpArgs = {
  id: Scalars['Int']['input'];
};


export type IMutationDeletePasswordResetArgs = {
  id: Scalars['Int']['input'];
};


export type IMutationDeletePaymentArgs = {
  id: Scalars['Int']['input'];
};


export type IMutationDeletePermissionArgs = {
  id: Scalars['Int']['input'];
};


export type IMutationDeletePlanArgs = {
  id: Scalars['Int']['input'];
};


export type IMutationDeletePlanInfoArgs = {
  id: Scalars['Int']['input'];
};


export type IMutationDeleteQuestionArgs = {
  id: Scalars['Int']['input'];
};


export type IMutationDeleteQuoteArgs = {
  id: Scalars['Int']['input'];
};


export type IMutationDeleteRoleArgs = {
  id: Scalars['Int']['input'];
};


export type IMutationDeleteSettingArgs = {
  id: Scalars['Int']['input'];
};


export type IMutationDeleteTagArgs = {
  id: Scalars['Int']['input'];
};


export type IMutationDeleteTransactionArgs = {
  id: Scalars['Int']['input'];
};


export type IMutationDeleteUserArgs = {
  id: Scalars['Int']['input'];
};


export type IMutationGivePermissionsToRoleArgs = {
  permissions?: InputMaybe<Array<InputMaybe<ISelectCategory>>>;
  roleId?: InputMaybe<Scalars['Int']['input']>;
};


export type IMutationLoginWithPasswordArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type IMutationLoginWithResetPasswordTokenArgs = {
  token: Scalars['String']['input'];
};


export type IMutationLoginWithTokenArgs = {
  token: Scalars['String']['input'];
};


export type IMutationMarkNotificationAsReadArgs = {
  notifications: Array<InputMaybe<ISelectCategory>>;
};


export type IMutationPublishExamPaperArgs = {
  id: Scalars['Int']['input'];
};


export type IMutationRegisterArgs = {
  acceptTerms: Scalars['Boolean']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordConfirmation: Scalars['String']['input'];
};


export type IMutationRequestAccessTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type IMutationRequestMpesaStkArgs = {
  phoneNumber: Scalars['String']['input'];
  quoteId: Scalars['Int']['input'];
};


export type IMutationSendPasswordResetLinkEmailArgs = {
  email: Scalars['String']['input'];
};


export type IMutationSendPasswordResetOtpEmailArgs = {
  email: Scalars['String']['input'];
};


export type IMutationSignInWithGoogleArgs = {
  token: Scalars['String']['input'];
};


export type IMutationSignupGoogleUserArgs = {
  token: Scalars['String']['input'];
};


export type IMutationSubmitAdminCredentialsArgs = {
  input: IAdminCredentialsInput;
  registrationId: Scalars['Int']['input'];
};


export type IMutationSubmitInstitutionDetailsArgs = {
  input: IInstitutionDetailsInput;
  registrationId: Scalars['Int']['input'];
};


export type IMutationSubmitProfileInfoArgs = {
  input: IProfileInfoInput;
  registrationId?: InputMaybe<Scalars['Int']['input']>;
};


export type IMutationUpdateActivityLogArgs = {
  id: Scalars['Int']['input'];
  params?: InputMaybe<IUpdateActivityLogInput>;
};


export type IMutationUpdateChoiceArgs = {
  id: Scalars['Int']['input'];
  params?: InputMaybe<IUpdateChoiceInput>;
};


export type IMutationUpdateConfigArgs = {
  id: Scalars['Int']['input'];
  params?: InputMaybe<IUpdateConfigInput>;
};


export type IMutationUpdateCreditArgs = {
  id: Scalars['Int']['input'];
  params?: InputMaybe<IUpdateCreditInput>;
};


export type IMutationUpdateExamArgs = {
  id: Scalars['Int']['input'];
  params?: InputMaybe<IUpdateExamInput>;
};


export type IMutationUpdateExamPaperArgs = {
  id: Scalars['Int']['input'];
  params?: InputMaybe<IUpdateExamPaperInput>;
};


export type IMutationUpdateExamineeArgs = {
  id: Scalars['Int']['input'];
  params?: InputMaybe<IUpdateExamineeInput>;
};


export type IMutationUpdateExamineeGroupArgs = {
  id: Scalars['Int']['input'];
  params?: InputMaybe<IUpdateExamineeGroupInput>;
};


export type IMutationUpdateInstitutionArgs = {
  id: Scalars['Int']['input'];
  params?: InputMaybe<IUpdateInstitutionInput>;
};


export type IMutationUpdateInstructionArgs = {
  id: Scalars['Int']['input'];
  params?: InputMaybe<IUpdateInstructionInput>;
};


export type IMutationUpdateNotificationArgs = {
  id: Scalars['Int']['input'];
  params?: InputMaybe<IUpdateNotificationInput>;
};


export type IMutationUpdateOtpArgs = {
  id: Scalars['Int']['input'];
  params?: InputMaybe<IUpdateOtpInput>;
};


export type IMutationUpdatePasswordResetArgs = {
  id: Scalars['Int']['input'];
  params?: InputMaybe<IUpdatePasswordResetInput>;
};


export type IMutationUpdatePaymentArgs = {
  id: Scalars['Int']['input'];
  params?: InputMaybe<IUpdatePaymentInput>;
};


export type IMutationUpdatePermissionArgs = {
  id: Scalars['Int']['input'];
  params?: InputMaybe<IUpdatePermissionInput>;
};


export type IMutationUpdatePlanArgs = {
  id: Scalars['Int']['input'];
  params?: InputMaybe<IUpdatePlanInput>;
};


export type IMutationUpdatePlanInfoArgs = {
  id: Scalars['Int']['input'];
  params?: InputMaybe<IUpdatePlanInfoInput>;
};


export type IMutationUpdateQuestionArgs = {
  id: Scalars['Int']['input'];
  params?: InputMaybe<IUpdateQuestionInput>;
};


export type IMutationUpdateQuoteArgs = {
  id: Scalars['Int']['input'];
  params?: InputMaybe<IUpdateQuoteInput>;
};


export type IMutationUpdateRoleArgs = {
  id: Scalars['Int']['input'];
  params?: InputMaybe<IUpdateRoleInput>;
};


export type IMutationUpdateSettingArgs = {
  id: Scalars['Int']['input'];
  params?: InputMaybe<IUpdateSettingInput>;
};


export type IMutationUpdateTagArgs = {
  id: Scalars['Int']['input'];
  params?: InputMaybe<IUpdateTagInput>;
};


export type IMutationUpdateTransactionArgs = {
  id: Scalars['Int']['input'];
  params?: InputMaybe<IUpdateTransactionInput>;
};


export type IMutationUpdateUserArgs = {
  id: Scalars['Int']['input'];
  params?: InputMaybe<IUpdateUserInput>;
};


export type IMutationUploadRegistrationDocumentArgs = {
  file: Scalars['Upload']['input'];
  input: IDocumentUploadInput;
};


export type IMutationUploadSingleFileArgs = {
  file: Scalars['Upload']['input'];
};


export type IMutationValidateOtpArgs = {
  identifier: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type IMutationValidatePasswordResetTokenArgs = {
  token?: InputMaybe<Scalars['String']['input']>;
};


export type IMutationVerifyEmailArgs = {
  token: Scalars['String']['input'];
};

export type INotificationCreatedResponse = {
  __typename?: 'NotificationCreatedResponse';
  notification?: Maybe<INotificationUserModel>;
  stats?: Maybe<INotificationStat>;
};

export type INotificationKey = {
  __typename?: 'NotificationKey';
  notificationKey: Scalars['String']['output'];
};

export type INotificationMarkedAsReadResponse = {
  __typename?: 'NotificationMarkedAsReadResponse';
  data?: Maybe<INotificationStat>;
  message?: Maybe<Scalars['String']['output']>;
};

export type INotificationModel = {
  __typename?: 'NotificationModel';
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type INotificationStat = {
  __typename?: 'NotificationStat';
  read: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  unread: Scalars['Int']['output'];
};

export type INotificationUserModel = {
  __typename?: 'NotificationUserModel';
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isRead: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type IOtpModel = {
  __typename?: 'OtpModel';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type IPaginatedActivityLog = {
  __typename?: 'PaginatedActivityLog';
  items?: Maybe<Array<Maybe<IActivityLogModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedActivityLogUserModel = {
  __typename?: 'PaginatedActivityLogUserModel';
  items?: Maybe<Array<Maybe<IActivityLogUserModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedChoice = {
  __typename?: 'PaginatedChoice';
  items?: Maybe<Array<Maybe<IChoiceModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedConfig = {
  __typename?: 'PaginatedConfig';
  items?: Maybe<Array<Maybe<IConfigModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedCredit = {
  __typename?: 'PaginatedCredit';
  items?: Maybe<Array<Maybe<ICreditModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedExam = {
  __typename?: 'PaginatedExam';
  items?: Maybe<Array<Maybe<IExamModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedExamPaper = {
  __typename?: 'PaginatedExamPaper';
  items?: Maybe<Array<Maybe<IExamPaperModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedExaminee = {
  __typename?: 'PaginatedExaminee';
  items?: Maybe<Array<Maybe<IExamineeModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedExamineeGroup = {
  __typename?: 'PaginatedExamineeGroup';
  items?: Maybe<Array<Maybe<IExamineeGroupModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedFileUpload = {
  __typename?: 'PaginatedFileUpload';
  items?: Maybe<Array<Maybe<IFileUploadModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedInstitution = {
  __typename?: 'PaginatedInstitution';
  items?: Maybe<Array<Maybe<IInstitutionModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedInstruction = {
  __typename?: 'PaginatedInstruction';
  items?: Maybe<Array<Maybe<IInstructionModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedNotification = {
  __typename?: 'PaginatedNotification';
  items?: Maybe<Array<Maybe<INotificationModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedOtp = {
  __typename?: 'PaginatedOtp';
  items?: Maybe<Array<Maybe<IOtpModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedPasswordReset = {
  __typename?: 'PaginatedPasswordReset';
  items?: Maybe<Array<Maybe<IPasswordResetModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedPayment = {
  __typename?: 'PaginatedPayment';
  items?: Maybe<Array<Maybe<IPaymentModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedPermission = {
  __typename?: 'PaginatedPermission';
  items?: Maybe<Array<Maybe<IPermissionModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedPlan = {
  __typename?: 'PaginatedPlan';
  items?: Maybe<Array<Maybe<IPlanModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedPlanInfo = {
  __typename?: 'PaginatedPlanInfo';
  items?: Maybe<Array<Maybe<IPlanInfoModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedQuestion = {
  __typename?: 'PaginatedQuestion';
  items?: Maybe<Array<Maybe<IQuestionModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedQuote = {
  __typename?: 'PaginatedQuote';
  items?: Maybe<Array<Maybe<IQuoteModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedRole = {
  __typename?: 'PaginatedRole';
  items?: Maybe<Array<Maybe<IRoleModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedSetting = {
  __typename?: 'PaginatedSetting';
  items?: Maybe<Array<Maybe<ISettingModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedTag = {
  __typename?: 'PaginatedTag';
  items?: Maybe<Array<Maybe<ITagModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedTransaction = {
  __typename?: 'PaginatedTransaction';
  items?: Maybe<Array<Maybe<ITransactionModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedUser = {
  __typename?: 'PaginatedUser';
  items?: Maybe<Array<Maybe<IUserModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedUserNotification = {
  __typename?: 'PaginatedUserNotification';
  items?: Maybe<Array<Maybe<INotificationUserModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPaginatedUserRoles = {
  __typename?: 'PaginatedUserRoles';
  items?: Maybe<Array<Maybe<IRoleModel>>>;
  meta?: Maybe<IPagination>;
};

export type IPagination = {
  __typename?: 'Pagination';
  totalItems: Scalars['Int']['output'];
};

export type IPasswordResetModel = {
  __typename?: 'PasswordResetModel';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type IPaymentModel = {
  __typename?: 'PaymentModel';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type IPermissionModel = {
  __typename?: 'PermissionModel';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type IPlanInfoModel = {
  __typename?: 'PlanInfoModel';
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  planId: Scalars['Int']['output'];
};

export type IPlanModel = {
  __typename?: 'PlanModel';
  costPerCreditInKES: Scalars['Float']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  planInfos: Array<Maybe<IPlanInfoModel>>;
  tagLine: Scalars['String']['output'];
};

export type IProfileInfoInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  jobTitle: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
};

export type IQuery = {
  __typename?: 'Query';
  activityLog?: Maybe<IActivityLogModel>;
  activityLogs: IPaginatedActivityLog;
  authenticatedUserActivityLogs: IPaginatedActivityLogUserModel;
  authenticatedUserNotificationStats?: Maybe<INotificationStat>;
  authenticatedUserNotifications?: Maybe<IPaginatedUserNotification>;
  choice?: Maybe<IChoiceModel>;
  choices: IPaginatedChoice;
  config?: Maybe<IConfigModel>;
  configs: IPaginatedConfig;
  credit?: Maybe<ICreditModel>;
  credits: IPaginatedCredit;
  exam?: Maybe<IExamModel>;
  examPaper?: Maybe<IExamPaperModel>;
  examPapers: IPaginatedExamPaper;
  examinee?: Maybe<IExamineeModel>;
  examineeGroup?: Maybe<IExamineeGroupModel>;
  examineeGroups: IPaginatedExamineeGroup;
  examinees: IPaginatedExaminee;
  exams: IPaginatedExam;
  fileUploads: IPaginatedFileUpload;
  getRegistrationDetails?: Maybe<IRegistrationDetailsResponse>;
  getRegistrationStatus?: Maybe<IRegistrationStatusResponse>;
  getRegistrations: Array<IRegistrationDetailsResponse>;
  getRegistrationsRequiringReview: Array<IRegistrationDetailsResponse>;
  healthCheck?: Maybe<Scalars['String']['output']>;
  institution?: Maybe<IInstitutionModel>;
  institutions: IPaginatedInstitution;
  instruction?: Maybe<IInstructionModel>;
  instructions: IPaginatedInstruction;
  mpesaTransactionStatus?: Maybe<Scalars['String']['output']>;
  notification?: Maybe<INotificationModel>;
  notifications: IPaginatedNotification;
  otp?: Maybe<IOtpModel>;
  otps: IPaginatedOtp;
  passwordReset?: Maybe<IPasswordResetModel>;
  passwordResets: IPaginatedPasswordReset;
  payment?: Maybe<IPaymentModel>;
  payments: IPaginatedPayment;
  permission?: Maybe<IPermissionModel>;
  permissions: IPaginatedPermission;
  plan?: Maybe<IPlanModel>;
  planInfo?: Maybe<IPlanInfoModel>;
  planInfos: IPaginatedPlanInfo;
  plans: IPaginatedPlan;
  question?: Maybe<IQuestionModel>;
  questions: IPaginatedQuestion;
  quote?: Maybe<IQuoteModel>;
  quotes: IPaginatedQuote;
  role?: Maybe<IRoleModel>;
  roles: IPaginatedRole;
  setting?: Maybe<ISettingModel>;
  settings: IPaginatedSetting;
  tag?: Maybe<ITagModel>;
  tags: IPaginatedTag;
  transaction?: Maybe<ITransactionModel>;
  transactions: IPaginatedTransaction;
  user?: Maybe<IUserModel>;
  userRoles?: Maybe<IPaginatedUserRoles>;
  users: IPaginatedUser;
};


export type IQueryActivityLogArgs = {
  id: Scalars['Int']['input'];
};


export type IQueryActivityLogsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryAuthenticatedUserActivityLogsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryAuthenticatedUserNotificationsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryChoiceArgs = {
  id: Scalars['Int']['input'];
};


export type IQueryChoicesArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryConfigArgs = {
  id: Scalars['Int']['input'];
};


export type IQueryConfigsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryCreditArgs = {
  id: Scalars['Int']['input'];
};


export type IQueryCreditsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryExamArgs = {
  id: Scalars['Int']['input'];
};


export type IQueryExamPaperArgs = {
  id: Scalars['Int']['input'];
};


export type IQueryExamPapersArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryExamineeArgs = {
  id: Scalars['Int']['input'];
};


export type IQueryExamineeGroupArgs = {
  id: Scalars['Int']['input'];
};


export type IQueryExamineeGroupsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryExamineesArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryExamsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryFileUploadsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryGetRegistrationDetailsArgs = {
  registrationId: Scalars['Int']['input'];
};


export type IQueryGetRegistrationStatusArgs = {
  registrationId: Scalars['Int']['input'];
};


export type IQueryGetRegistrationsArgs = {
  filter?: InputMaybe<IRegistrationFilterInput>;
};


export type IQueryInstitutionArgs = {
  id: Scalars['Int']['input'];
};


export type IQueryInstitutionsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryInstructionArgs = {
  id: Scalars['Int']['input'];
};


export type IQueryInstructionsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryMpesaTransactionStatusArgs = {
  transactionRef: Scalars['String']['input'];
};


export type IQueryNotificationArgs = {
  id: Scalars['Int']['input'];
};


export type IQueryNotificationsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryOtpArgs = {
  id: Scalars['Int']['input'];
};


export type IQueryOtpsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryPasswordResetArgs = {
  id: Scalars['Int']['input'];
};


export type IQueryPasswordResetsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryPaymentArgs = {
  id: Scalars['Int']['input'];
};


export type IQueryPaymentsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryPermissionArgs = {
  id: Scalars['Int']['input'];
};


export type IQueryPermissionsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryPlanArgs = {
  id: Scalars['Int']['input'];
};


export type IQueryPlanInfoArgs = {
  id: Scalars['Int']['input'];
};


export type IQueryPlanInfosArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryPlansArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryQuestionArgs = {
  id: Scalars['Int']['input'];
};


export type IQueryQuestionsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryQuoteArgs = {
  id: Scalars['Int']['input'];
};


export type IQueryQuotesArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryRoleArgs = {
  id: Scalars['Int']['input'];
};


export type IQueryRolesArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQuerySettingArgs = {
  id: Scalars['Int']['input'];
};


export type IQuerySettingsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryTagArgs = {
  id: Scalars['Int']['input'];
};


export type IQueryTagsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryTransactionArgs = {
  id: Scalars['Int']['input'];
};


export type IQueryTransactionsArgs = {
  query?: InputMaybe<IQueryParams>;
};


export type IQueryUserArgs = {
  id: Scalars['Int']['input'];
};


export type IQueryUserRolesArgs = {
  userId?: InputMaybe<Scalars['Int']['input']>;
};


export type IQueryUsersArgs = {
  query?: InputMaybe<IQueryParams>;
};

export enum IQueryOperatorEnum {
  Between = 'BETWEEN',
  Contains = 'CONTAINS',
  Equals = 'EQUALS',
  GreaterThan = 'GREATER_THAN',
  In = 'IN',
  LessThan = 'LESS_THAN'
}

export type IQueryParams = {
  currentPage?: InputMaybe<Scalars['Int']['input']>;
  filters?: InputMaybe<Array<InputMaybe<IQueryParamsFilter>>>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortByDirection?: InputMaybe<ISortByEnum>;
};

export type IQueryParamsFilter = {
  field?: InputMaybe<Scalars['String']['input']>;
  operator?: InputMaybe<IQueryOperatorEnum>;
  value?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type IQuestionModel = {
  __typename?: 'QuestionModel';
  autoMark?: Maybe<Scalars['Boolean']['output']>;
  choiceType: IChoiceType;
  choices: Array<Maybe<IChoiceModel>>;
  correctChoiceExplanation?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  exam: IExamModel;
  examPaperId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  tags: Array<Maybe<ITagModel>>;
};

export type IQuestionTagInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type IQuoteModel = {
  __typename?: 'QuoteModel';
  createdAt: Scalars['String']['output'];
  creditAmount: Scalars['Float']['output'];
  creditCost: Scalars['Float']['output'];
  currency: ICurrencyModel;
  expireAt?: Maybe<Scalars['String']['output']>;
  feeCost: Scalars['Float']['output'];
  id: Scalars['Int']['output'];
  planId: Scalars['Int']['output'];
  taxCost: Scalars['Float']['output'];
  totalCost?: Maybe<Scalars['Float']['output']>;
};

export type IReceivedPaymentSubscription = {
  __typename?: 'ReceivedPaymentSubscription';
  transaction?: Maybe<ITransactionModel>;
};

export type IRegistrationDetailsResponse = {
  __typename?: 'RegistrationDetailsResponse';
  adminCredentialsCompleted: Scalars['Boolean']['output'];
  adminUser?: Maybe<IUserModel>;
  adminUserId?: Maybe<Scalars['Int']['output']>;
  completedAt?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  documentsUploaded: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  institution?: Maybe<IInstitutionModel>;
  institutionDetailsCompleted: Scalars['Boolean']['output'];
  institutionId?: Maybe<Scalars['Int']['output']>;
  profileInfoCompleted: Scalars['Boolean']['output'];
  status: IRegistrationStatus;
  statusHistory: Array<IRegistrationStatusHistory>;
  updatedAt: Scalars['String']['output'];
};

export type IRegistrationFilterInput = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<IRegistrationStatus>;
  statuses?: InputMaybe<Array<IRegistrationStatus>>;
};

export enum IRegistrationStatus {
  AdminCredentialsSet = 'ADMIN_CREDENTIALS_SET',
  Approved = 'APPROVED',
  DocumentsUploaded = 'DOCUMENTS_UPLOADED',
  InstitutionDetailsCollected = 'INSTITUTION_DETAILS_COLLECTED',
  Pending = 'PENDING',
  ProfileInfoCollected = 'PROFILE_INFO_COLLECTED',
  Rejected = 'REJECTED',
  UnderReview = 'UNDER_REVIEW'
}

export type IRegistrationStatusHistory = {
  __typename?: 'RegistrationStatusHistory';
  changedAt: Scalars['String']['output'];
  changedBy?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  newStatus: IRegistrationStatus;
  notes?: Maybe<Scalars['String']['output']>;
  previousStatus: IRegistrationStatus;
};

export type IRegistrationStatusResponse = {
  __typename?: 'RegistrationStatusResponse';
  adminCredentialsCompleted: Scalars['Boolean']['output'];
  adminUserId?: Maybe<Scalars['Int']['output']>;
  completedAt?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  documentsUploaded: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  institutionDetailsCompleted: Scalars['Boolean']['output'];
  institutionId?: Maybe<Scalars['Int']['output']>;
  profileInfoCompleted: Scalars['Boolean']['output'];
  status: IRegistrationStatus;
  updatedAt: Scalars['String']['output'];
};

export type IRegistrationStepResponse = {
  __typename?: 'RegistrationStepResponse';
  errors?: Maybe<Array<IValidationError>>;
  message?: Maybe<Scalars['String']['output']>;
  registrationId?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
};

export type IRoleModel = {
  __typename?: 'RoleModel';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  permissions?: Maybe<Array<Maybe<IPermissionModel>>>;
};

export type ISelectCategory = {
  id: Scalars['Int']['input'];
};

export type ISelectCategoryString = {
  id: Scalars['String']['input'];
};

export type ISettingModel = {
  __typename?: 'SettingModel';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export enum ISortByEnum {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type ISubscription = {
  __typename?: 'Subscription';
  healthCheck?: Maybe<Scalars['String']['output']>;
  mpesaPaymentReceived?: Maybe<IReceivedPaymentSubscription>;
  notificationCreated?: Maybe<INotificationCreatedResponse>;
  refreshedAccessToken?: Maybe<IAccessToken>;
  resetPasswordNotification?: Maybe<ISuccessResponse>;
};


export type ISubscriptionMpesaPaymentReceivedArgs = {
  quoteId: Scalars['Int']['input'];
};


export type ISubscriptionRefreshedAccessTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type ISubscriptionResetPasswordNotificationArgs = {
  notificationKey?: InputMaybe<Scalars['String']['input']>;
};

export type ISuccessResponse = {
  __typename?: 'SuccessResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type ITagModel = {
  __typename?: 'TagModel';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type ITransactionModel = {
  __typename?: 'TransactionModel';
  amount: Scalars['Float']['output'];
  balanceAfterTransaction: Scalars['Float']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  type?: Maybe<ITransactionTypeEnum>;
};

export enum ITransactionTypeEnum {
  Exam = 'exam',
  Promotion = 'promotion',
  Purchase = 'purchase'
}

export type IUpdateActivityLogInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type IUpdateChoiceInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type IUpdateConfigInput = {
  name: Scalars['String']['input'];
  type?: InputMaybe<IConfigType>;
};

export type IUpdateCreditInput = {
  balance: Scalars['Int']['input'];
};

export type IUpdateExamInput = {
  configs?: InputMaybe<Array<InputMaybe<IExamConfigInput>>>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  startDate?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<InputMaybe<IExamTagInput>>>;
};

export type IUpdateExamPaperInput = {
  examId: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type IUpdateExamineeGroupInput = {
  examinees?: InputMaybe<Array<InputMaybe<ICreateGroupExamineeInput>>>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type IUpdateExamineeInput = {
  otherDetails?: InputMaybe<IExamineeOtherDetailsInput>;
  uniqueIdentifier: Scalars['String']['input'];
};

export type IUpdateInstitutionInput = {
  accreditationNumber?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  institutionType?: InputMaybe<Scalars['String']['input']>;
  legalName?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  officialWebsite?: InputMaybe<Scalars['String']['input']>;
  stateProvince?: InputMaybe<Scalars['String']['input']>;
  streetAddress?: InputMaybe<Scalars['String']['input']>;
  zipPostalCode?: InputMaybe<Scalars['String']['input']>;
};

export type IUpdateInstructionInput = {
  description: Scalars['String']['input'];
  examPaperId: Scalars['Int']['input'];
};

export type IUpdateNotificationInput = {
  description: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type IUpdateOtpInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type IUpdatePasswordResetInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type IUpdatePaymentInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type IUpdatePermissionInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type IUpdatePlanInfoInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  planId?: InputMaybe<Scalars['Int']['input']>;
};

export type IUpdatePlanInput = {
  costPerCreditInKES?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  planInfos?: InputMaybe<Array<InputMaybe<ICreatePlanInfoPlanInput>>>;
  tagLine?: InputMaybe<Scalars['String']['input']>;
};

export type IUpdateQuestionInput = {
  autoMark?: InputMaybe<Scalars['Boolean']['input']>;
  choiceType: IChoiceType;
  correctChoiceExplanation?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  examPaperId: Scalars['Int']['input'];
};

export type IUpdateQuoteInput = {
  paymentAmount: Scalars['Float']['input'];
  planId: Scalars['Int']['input'];
};

export type IUpdateRoleInput = {
  name: Scalars['String']['input'];
};

export type IUpdateSettingInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type IUpdateTagInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type IUpdateTransactionInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type IUpdateUserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  middleName?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type IUploadSuccessResponse = {
  __typename?: 'UploadSuccessResponse';
  data?: Maybe<IFileUploadModel>;
  message?: Maybe<Scalars['String']['output']>;
};

export type IUserModel = {
  __typename?: 'UserModel';
  createdAt?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  emailVerifiedAt?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  lastName: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  phoneVerifiedAt?: Maybe<Scalars['String']['output']>;
  profilePhotoLink?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type IValidatePasswordResetTokenResponse = {
  __typename?: 'ValidatePasswordResetTokenResponse';
  user?: Maybe<IUserModel>;
};

export type IValidationError = {
  __typename?: 'ValidationError';
  field: Scalars['String']['output'];
  message: Scalars['String']['output'];
};
