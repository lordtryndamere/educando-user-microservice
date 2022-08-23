import { HttpModule } from '@nestjs/axios';
import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { WinstonModule } from 'nest-winston';
import { AppService } from './app.service';
import { HealthController } from './interfaces/v1/healthcheck.controller';
import { PinController } from './interfaces/v1/pin.controller';

const infrastructure = [];
const application = [];
const domain = [];

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
