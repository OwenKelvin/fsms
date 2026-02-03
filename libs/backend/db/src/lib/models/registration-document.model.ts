import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { FileUploadModel } from './file-upload.model';

export enum DocumentType {
  ACCREDITATION_CERTIFICATE = 'accreditation_certificate',
  OPERATING_LICENSE = 'operating_license',
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
  @Column({
    type: DataType.ENUM('accreditation_certificate', 'operating_license'),
    allowNull: false,
  })
  documentType!: DocumentType;

  @Column({
    type: DataType.ENUM('pending', 'approved', 'rejected', 'requires_resubmission'),
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
    type: DataType.INTEGER,
    allowNull: false,
  })
  fileUploadId!: number;

  @BelongsTo(() => FileUploadModel)
  fileUpload!: FileUploadModel;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  registrationId!: number;

  // Note: The BelongsTo relationship will be established when both models are loaded
}