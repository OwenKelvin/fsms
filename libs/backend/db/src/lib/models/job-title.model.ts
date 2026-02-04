import { Column, DataType, Default, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { UserModel } from './user.model';

@Table({
  tableName: 'job_titles',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class JobTitleModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  override id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Job title cannot be empty',
      },
      len: {
        args: [1, 255],
        msg: 'Job title must be between 1 and 255 characters',
      },
    },
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive!: boolean;

  @HasMany(() => UserModel)
  users!: UserModel[];
}
