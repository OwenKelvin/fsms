import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserServiceModule } from '@fsms/backend/user-service';
import { JwtAuthModule } from './providers/jwt-secret.provider';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtAuthModule,
    UserServiceModule,
    JwtModule.register({
      signOptions: { expiresIn: '15s' },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthServiceBackendModule {}
