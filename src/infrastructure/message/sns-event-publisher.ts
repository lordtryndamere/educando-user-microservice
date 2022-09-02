import { SNS } from '@aws-sdk/client-sns';
import { Injectable, Logger } from '@nestjs/common';
import { AppService, SNSConfig } from 'src/app.service';
import {
  IntegrationEvent,
  IntegrationEventPublisher,
} from 'src/infrastructure/message/integration-event-publisher';

@Injectable()
export class SNSEventPublisherImplement implements IntegrationEventPublisher {
  private readonly config: SNSConfig;
  private readonly sns: any;

  constructor(private readonly logger: Logger) {
    this.config = AppService.snsEventsConfig();
    this.sns = this.connect();
  }

  async publish(message: IntegrationEvent): Promise<void> {
    const params = {
      TopicArn: this.config.topic,
      Message: JSON.stringify(message.data),
    };

    this.sns.publish(params);
  }

  private connect(): any {
    const con = new SNS({ region: this.config.region });
    return con;
  }
}
