import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { UserModel } from './user.model';

export enum InstitutionType {
  EDUCATIONAL = 'educational',
  HEALTHCARE = 'healthcare',
  CORPORATE = 'corporate',
  GOVERNMENT = 'government',
  NON_PROFIT = 'non_profit',
}

@Table({
  tableName: 'institutions',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class InstitutionModel extends Model {
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
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  createdById?: UserModel;

  @BelongsTo(() => UserModel)
  createdBy!: UserModel;
}
