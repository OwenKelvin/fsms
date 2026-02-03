import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { InstitutionModel } from './institution.model';
import { UserModel } from './user.model';
import { RegistrationDocumentModel } from './registration-document.model';

export enum RegistrationStatus {
  PENDING = 'pending',
  PROFILE_INFO_COLLECTED = 'profile_info_collected',
  INSTITUTION_DETAILS_COLLECTED = 'institution_details_collected',
  DOCUMENTS_UPLOADED = 'documents_uploaded',
  ADMIN_CREDENTIALS_SET = 'admin_credentials_set',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Table({
  tableName: 'registration_records',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class RegistrationRecordModel extends Model {
  @Column({
    type: DataType.ENUM(
      'pending',
      'profile_info_collected',
      'institution_details_collected',
      'documents_uploaded',
      'admin_credentials_set',
      'under_review',
      'approved',
      'rejected'
    ),
    allowNull: false,
    defaultValue: RegistrationStatus.PENDING,
  })
  status!: RegistrationStatus;

  // Step completion tracking
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  profileInfoCompleted!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  institutionDetailsCompleted!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  documentsUploaded!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  adminCredentialsCompleted!: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  completedAt?: Date;

  // Relationships
  @ForeignKey(() => InstitutionModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  institutionId?: number;

  @BelongsTo(() => InstitutionModel)
  institution?: InstitutionModel;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  adminUserId?: number;

  @BelongsTo(() => UserModel)
  adminUser?: UserModel;

  @HasMany(() => RegistrationDocumentModel, 'registrationId')
  registrationDocuments!: RegistrationDocumentModel[];

  @HasMany(() => RegistrationStatusHistoryModel, 'registrationId')
  statusHistory!: RegistrationStatusHistoryModel[];
}

@Table({
  tableName: 'registration_status_history',
  underscored: true,
  timestamps: true,
})
export class RegistrationStatusHistoryModel extends Model {
  @ForeignKey(() => RegistrationRecordModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  registrationId!: number;

  @BelongsTo(() => RegistrationRecordModel)
  registration!: RegistrationRecordModel;

  @Column({
    type: DataType.ENUM(
      'pending',
      'profile_info_collected',
      'institution_details_collected',
      'documents_uploaded',
      'admin_credentials_set',
      'under_review',
      'approved',
      'rejected'
    ),
    allowNull: true,
  })
  previousStatus?: RegistrationStatus;

  @Column({
    type: DataType.ENUM(
      'pending',
      'profile_info_collected',
      'institution_details_collected',
      'documents_uploaded',
      'admin_credentials_set',
      'under_review',
      'approved',
      'rejected'
    ),
    allowNull: false,
  })
  newStatus!: RegistrationStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  changedAt!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  changedBy?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes?: string;
}