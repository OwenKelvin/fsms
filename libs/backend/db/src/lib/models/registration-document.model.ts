import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { FileUploadModel } from './file-upload.model';

export enum DocumentType {
  ACCREDITATION_CERTIFICATE = 'ACCREDITATION_CERTIFICATE',
  OPERATING_LICENSE = 'OPERATING_LICENSE',
}

export enum DocumentVerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REQUIRES_RESUBMISSION = 'requires_resubmission',
}

@Table({
  tableName: 'registration_documents',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class RegistrationDocumentModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  override id!: string;

  @Column({
    type: DataType.ENUM('accreditation_certificate', 'operating_license'),
    allowNull: false,
  })
  documentType!: DocumentType;

  @Column({
    type: DataType.ENUM(
      'pending',
      'approved',
      'rejected',
      'requires_resubmission',
    ),
    allowNull: false,
    defaultValue: DocumentVerificationStatus.PENDING,
  })
  verificationStatus!: DocumentVerificationStatus;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  verifiedAt?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  verifiedBy?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  uploadedAt!: Date;

  @ForeignKey(() => FileUploadModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  fileUploadId!: string;

  @BelongsTo(() => FileUploadModel)
  fileUpload!: FileUploadModel;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  registrationId!: string;

  // Note: The BelongsTo relationship will be established when both models are loaded
}
