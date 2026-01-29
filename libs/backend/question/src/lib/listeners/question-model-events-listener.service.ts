import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { QuestionCreatedEvent } from '../events/question-created.event';

@Injectable()
export class QuestionModelEventsListener {
  @OnEvent('question.created')
  async handleQuestionCreated($event: QuestionCreatedEvent) {
    Logger.log('Question created event event => id', $event.question.id);
  }
}
