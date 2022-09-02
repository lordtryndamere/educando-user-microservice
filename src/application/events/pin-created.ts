import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { IntegrationEventSubject } from './integration-event-subject';
import { PinCreatedEvent } from 'src/domain/events';
import { SQSEventPublisherImplement } from 'src/infrastructure/message/sqs-event-publisher';
import { IntegrationEventPublisher } from 'src/infrastructure/message/integration-event-publisher';
import { SNSEventPublisherImplement } from 'src/infrastructure/message/sns-event-publisher';

@EventsHandler(PinCreatedEvent)
export class PinCreatedHandler implements IEventHandler<PinCreatedEvent> {
  constructor(
    private readonly logger: Logger,
    @Inject(SQSEventPublisherImplement)
    private readonly publishersqs: IntegrationEventPublisher,

    @Inject(SNSEventPublisherImplement)
    private readonly publishersns: IntegrationEventPublisher,
  ) {}

  async handle(event: PinCreatedEvent): Promise<void> {
    this.logger.log(
      `${IntegrationEventSubject.PIN_CREATED}: ${JSON.stringify(event)}`,
      'PinCreatedHandler.handle',
    );
    await this.publishersqs.publish({
      subject: IntegrationEventSubject.PIN_CREATED,
      data: {
        idSchool: event.idSchool,
        idGrade: event.idGrade,
        idCourse: event.idCourse,
        event: IntegrationEventSubject.PIN_CREATED,
      },
    });

    await this.publishersns.publish({
      subject: IntegrationEventSubject.PIN_CREATED,
      data: {
        idSchool: event.idSchool,
        idGrade: event.idGrade,
        idCourse: event.idCourse,
        event: IntegrationEventSubject.PIN_CREATED,
      },
    });
  }
}
