import { Process, Processor } from '@nestjs/bull';
import { Inject, NotFoundException } from '@nestjs/common';
import { EmailService } from '@fsms/backend/email-service';
import { TranslationService } from '@fsms/backend/translation';
import { UserService } from '@fsms/backend/user-service';
import { Job } from 'bull';
import Keyv from 'keyv';
import { SEND_VERIFICATION_LINK_QUEUE } from '../constants/queue.constants';

@Processor(SEND_VERIFICATION_LINK_QUEUE)
export class SendEmailVerificationLinkConsumer {
  constructor(
    private emailService: EmailService,
    private userService: UserService,
    private translationService: TranslationService,
    @Inject('KEYV_REDIS') private readonly keyvRedis: Keyv,
  ) {}

  @Process()
  async sendEmailVerificationLinkEmail(
    job: Job<{ email: string }>,
  ): Promise<void> {
    const user = await this.userService.findByEmail(job.data.email);
    if (user) {
      const verificationCode = Math.random().toString(36).slice(2, 10);
      await this.keyvRedis.set(verificationCode, job.data.email, 3600000);
      const verifyEmailLink = `${process.env['FSMS_APP_URL']}/auth/verify/${verificationCode}`;

      await this.emailService.send({
        from: process.env['FSMS_MAIL_FROM'],
        to: job.data.email,
        subject: 'Your email verification link',
        template: 'verify-email-link-template',
        context: {
          firstName: user.firstName,
          verifyEmailLink: verifyEmailLink,
        },
      });
    } else {
      throw new NotFoundException(
        this.translationService.getTranslation('alert.emailNotFound'),
      );
    }
  }
}
