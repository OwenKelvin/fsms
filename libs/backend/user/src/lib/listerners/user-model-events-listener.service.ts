import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from '../events/user-created.event';
import { EmailService } from '@fsms/backend/email-service';
import { InstitutionBackendService } from '@fsms/backend/institution-backend-service';
import { UserVerifiedEvent } from '../events/user-verified.event';

@Injectable()
export class UserModelEventsListener {
  constructor(
    private emailService: EmailService,
    private institutionService: InstitutionBackendService,
  ) {}

  @OnEvent('user.verified')
  async sendWelcomeEmail($event: UserVerifiedEvent) {
    if ($event.user.email) {
      await this.emailService.send({
        to: $event.user.email,
        subject: 'Welcome to Tahiniwa!',
        template: 'welcome-template',
        context: {
          firstName: $event.user.firstName,
        },
      });
    }
  }

  @OnEvent('user.verified')
  async allocateInitialFreeCredits($event: UserVerifiedEvent) {
    const institution = await this.institutionService.model.findOne({
      where: {
        createdById: $event.user.id,
      },
    });
    if (institution) {
      await this.institutionService.allocateFreeCredits(institution.id);
    }
  }

  @OnEvent('user.created')
  async assignDefaultInstitution($event: UserCreatedEvent) {
    const institution = await this.institutionService.create({
      name: 'default',
      createdById: $event.user.id,
    });
    await this.institutionService.addUser({
      institutionId: institution.id,
      userId: $event.user.id,
      userRole: 'Owner',
    });
  }
}
