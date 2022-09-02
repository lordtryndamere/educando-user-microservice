import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  IntegrationEvent,
  IntegrationEventPublisher,
} from 'src/infrastructure/message/integration-event-publisher';

@Injectable()
export class AMQEventPublisherImplement implements IntegrationEventPublisher {
  constructor(@Inject('PIN_SERVICE') private readonly client: ClientProxy) {
    this.connect();
  }

  async publish(message: IntegrationEvent): Promise<void> {
    Logger.debug('emiting event ', message.subject);
    this.client.emit(message.subject, message.data).subscribe();
    
  }

  private connect(): any {
    this.client.connect();
  }
}
