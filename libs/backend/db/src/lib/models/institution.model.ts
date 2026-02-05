import {
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { UserModel } from './user.model';

export enum InstitutionType {
  ECDE = 'ECDE',
  PRIMARY_SCHOOL = 'PRIMARY_SCHOOL',
  JUNIOR_SECONDARY = 'JUNIOR_SECONDARY',
  SENIOR_SECONDARY = 'SENIOR_SECONDARY',
  TVET = 'TVET',
  TEACHER_TRAINING_COLLEGE = 'TEACHER_TRAINING_COLLEGE',
  TECHNICAL_COLLEGE = 'TECHNICAL_COLLEGE',
  NATIONAL_POLYTECHNIC = 'NATIONAL_POLYTECHNIC',
  UNIVERSITY = 'UNIVERSITY',
  SPECIAL_NEEDS_SCHOOL = 'SPECIAL_NEEDS_SCHOOL',
  ADULT_EDUCATION_CENTER = 'ADULT_EDUCATION_CENTER',
}

@Table({
  tableName: 'institutions',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class InstitutionModel extends Model {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  override id!: string;

  @Column({ type: DataTypes.STRING })
  name?: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [1, 255],
        msg: 'Legal name must be between 1 and 255 characters',
      },
    },
  })
  legalName?: string;

  @Column({
    type: DataTypes.ENUM(
      'educational',
      'healthcare',
      'corporate',
      'government',
      'non_profit',
    ),
    allowNull: true,
  })
  institutionType?: InstitutionType;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [1, 100],
        msg: 'Accreditation number must be between 1 and 100 characters',
      },
    },
  })
  accreditationNumber?: string;

  // Address fields
  @Column({
    type: DataTypes.STRING,
    allowNull: true,
  })
  streetAddress?: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
  })
  city?: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
  })
  stateProvince?: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
  })
  zipPostalCode?: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: {
        msg: 'Official website must be a valid URL',
      },
    },
  })
  officialWebsite?: string;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  createdById?: string;

  @BelongsTo(() => UserModel)
  createdBy!: UserModel;
}
