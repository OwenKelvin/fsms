import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  UserModel,
} from '@fsms/backend/db';

@Module({
  imports: [
    SequelizeModule.forFeature([UserModel])
  ],
  providers: [
    UserService
  ],
  exports: [UserService]
})
export class UserServiceModule {
}
