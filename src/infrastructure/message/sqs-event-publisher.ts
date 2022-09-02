import { SQS } from '@aws-sdk/client-sqs';
import { Injectable, Logger } from '@nestjs/common';
import { AppService, SQSConfig } from 'src/app.service';
import {
  IntegrationEvent,
  IntegrationEventPublisher,
} from 'src/infrastructure/message/integration-event-publisher';

@Injectable()
export class SQSEventPublisherImplement implements IntegrationEventPublisher {
  private readonly config: SQSConfig;
  private readonly sqs: SQS;

  constructor(private readonly logger: Logger) {
    this.config = AppService.sqsEventsConfig();
    this.sqs = this.connect();
  }

  async publish(message: IntegrationEvent): Promise<void> {
    const params = {
      DelaySeconds: parseInt(this.config.delay),
      QueueUrl: this.config.url,
      MessageBody: JSON.stringify(message.data),
    };

    this.sqs.sendMessage(params);
  }

  private connect(): any {
    const con = new SQS({ region: this.config.region });
    return con;
  }
}
