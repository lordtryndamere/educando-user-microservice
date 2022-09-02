import {
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { SQS } from 'aws-sdk';

export abstract class SQSQueue
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  protected readonly logger = new Logger(SQSQueue.name);
  protected queueUrl: string;
  protected polling = false;
  protected timeoutRef: NodeJS.Timeout = null;
  protected service: SQS;

  constructor(
    protected readonly queueName: string,
    protected readonly region: string,
    protected readonly timeout = 10,
  ) {
    this.service = new SQS({ endpoint: process.env.SQS_URL, region });
  }

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log(`Initiating queue consumer with name ${this.queueName}`);

    this.polling = true;
    this.queueUrl = (
      await this.service
        .getQueueUrl({
          QueueName: this.queueName,
        })
        .promise()
    ).QueueUrl;

    this.logger.log(`Reading messages from ${this.queueUrl}`);

    this.timeoutRef = setTimeout(async () => this.poll(), this.timeout);
  }

  onApplicationShutdown(): void {
    this.polling = false;
    clearTimeout(this.timeoutRef);
  }

  public async poll(): Promise<void> {
    const result: SQS.ReceiveMessageResult = await this.receiveMessage();
    try {
      await this.handleSQSResponse(result);
    } catch (err) {
      Logger.error(err);
    }

    if (this.polling)
      this.timeoutRef = setTimeout(() => this.poll(), this.timeout);
  }

  private async handleSQSResponse(
    result: SQS.ReceiveMessageResult,
  ): Promise<void> {
    if (!result.Messages || result.Messages.length === 0) return;
    await Promise.all(result.Messages.map(this.handleMessage.bind(this)));
  }

  private async receiveMessage(): Promise<any> {
    return this.service
      .receiveMessage({
        QueueUrl: this.queueUrl,
      })
      .promise();
  }

  protected async handleMessage(message: SQS.Message): Promise<void> {
    await this.handle(message);

    await this.service
      .deleteMessage({
        QueueUrl: this.queueUrl,
        ReceiptHandle: message.ReceiptHandle,
      })
      .promise();
  }

  protected abstract handle(message: SQS.Message): Promise<void>;
}
