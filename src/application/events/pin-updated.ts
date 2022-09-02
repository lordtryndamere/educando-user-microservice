import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { IntegrationEventSubject } from './integration-event-subject';
import { PinUpdatedEvent } from 'src/domain/events';
import { SQSEventPublisherImplement } from 'src/infrastructure/message/sqs-event-publisher';
import { IntegrationEventPublisher } from 'src/infrastructure/message/integration-event-publisher';
import { SNSEventPublisherImplement } from 'src/infrastructure/message/sns-event-publisher';

@EventsHandler(PinUpdatedEvent)
export class PinUpdateHandler implements IEventHandler<PinUpdatedEvent> {
  constructor(
    private readonly logger: Logger,
    @Inject(SQSEventPublisherImplement)
    private readonly publishersqs: IntegrationEventPublisher,

    @Inject(SNSEventPublisherImplement)
    private readonly publishersns: IntegrationEventPublisher,
  ) {}

  async handle(event: PinUpdatedEvent): Promise<void> {
    this.logger.log(
      `${IntegrationEventSubject.PIN_UPDATED}: ${JSON.stringify(event)}`,
      'PinUpdatedEvent.handle',
    );
    await this.publishersqs.publish({
      subject: IntegrationEventSubject.PIN_UPDATED,
      data: {
        idSchool: event.idSchool,
        idGrade: event.idGrade,
        idCourse: event.idCourse,
        event: IntegrationEventSubject.PIN_UPDATED,
      },
    });

    await this.publishersns.publish({
      subject: IntegrationEventSubject.PIN_UPDATED,
      data: {
        idSchool: event.idSchool,
        idGrade: event.idGrade,
        idCourse: event.idCourse,
        event: IntegrationEventSubject.PIN_UPDATED,
      },
    });
  }
}
