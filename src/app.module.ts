import { HttpModule } from '@nestjs/axios';
import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { WinstonModule } from 'nest-winston';
import { AppService } from './app.service';
import {
  CreatePinCommmandHandler,
  UpdatePinHandler,
} from './application/commands';
import { UpdatePinStatusHandler } from './application/commands/update-pin-status-command';
import { PinCreatedHandler } from './application/events/pin-created';
import { PinUpdateHandler } from './application/events/pin-updated';
import {
  FindPinesByCodeQueryHandler,
  FindPinesQueryHandler,
} from './application/queries';
import { FindPinesBySchoolQueryHandler } from './application/queries/find-pin-by-school';
import { PinFactory } from './domain/aggregates';
import { SNSEventPublisherImplement } from './infrastructure/message/sns-event-publisher';
import { SQSEventPublisherImplement } from './infrastructure/message/sqs-event-publisher';
import { PinCommandsImplement } from './infrastructure/repositories/pin-commands';
import { PinQueriesImplements } from './infrastructure/repositories/pin-queries';
import { HealthController } from './interfaces/v1/healthcheck.controller';
import { PinController } from './interfaces/v1/pin.controller';

const infrastructure = [
  PinCommandsImplement,
  PinQueriesImplements,
  SQSEventPublisherImplement,
  SNSEventPublisherImplement,
]; // import only the implements
const application = [
  // import only the handlers
  CreatePinCommmandHandler,
  UpdatePinHandler,
  PinCreatedHandler,
  PinUpdateHandler,
  UpdatePinStatusHandler,
  FindPinesQueryHandler,
  FindPinesBySchoolQueryHandler,
  FindPinesByCodeQueryHandler,
];
const domain = [PinFactory]; // importo only the factory

@Module({
  imports: [
    ConfigModule.forRoot(),
    WinstonModule.forRoot(AppService.loggerConfig()),
    CqrsModule,
    TerminusModule,
    HttpModule,
  ],
  controllers: [HealthController, PinController],
  providers: [AppService, Logger, ...infrastructure, ...application, ...domain],
})
export class AppModule {}
