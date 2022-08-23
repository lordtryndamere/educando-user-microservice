import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Connection, createConnection } from 'typeorm';
import * as winston from 'winston';

class DBConfig {
  readonly host: string;
  readonly port: number;
  readonly database: string;
  readonly username: string;
  readonly password: string;
  readonly synchronize: boolean;
  readonly logging: boolean;
}

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private databaseConnection?: Connection | void;
  static node_environment(): string {
    const { NODE_ENV } = process.env;
    return NODE_ENV;
  }
  static environment(): string {
    const { ENVIRONMENT } = process.env;
    return (ENVIRONMENT ? ENVIRONMENT : 'LOCAL').toUpperCase();
  }
  static logLevel(): string {
    const { LOG_LEVEL } = process.env;
    return (LOG_LEVEL ? LOG_LEVEL : 'info').toLowerCase();
  }
  static apiPrefix(): string {
    const { API_PREFIX } = process.env;
    return API_PREFIX ? API_PREFIX : '';
  }
  static port(): number {
    const { PORT } = process.env;
    return PORT && Number(PORT) ? Number(PORT) : 5000;
  }
  static app_title(): string {
    const { APP_TITLE } = process.env;
    return APP_TITLE ? APP_TITLE : 'PIN MS';
  }
  static loggerConfig(): winston.LoggerOptions {
    const format =
      AppService.environment() !== 'LOCAL'
        ? winston.format.json()
        : winston.format.combine(
            winston.format.colorize(),
            winston.format.ms(),
            winston.format.simple(),
          );

    return {
      level: AppService.logLevel(),
      defaultMeta: {
        applicationName: AppService.app_title(),
        environment: AppService.environment(),
        node_env: AppService.node_environment(),
      },
      transports: [
        new winston.transports.Console({
          format,
        }),
      ],
    };
  }
  async onModuleInit(): Promise<void> {
    const entities = [__dirname + '/../**/*.entity{.ts,.js}'];

    if (AppService.node_environment().toUpperCase() !== 'TEST')
      this.databaseConnection = await createConnection({
        ...this.loadDBConfig(),
        type: 'mysql',
        entities,
      }).catch((error: Error) => this.failToConnectDatabase(error));
  }
  private loadDBConfig(): DBConfig {
    return {
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
      database: process.env.DATABASE_NAME || 'pin-db',
      username: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || 'my-secret-pw',
      synchronize: 'true' === process.env.DATABASE_SYNC,
      logging: 'true' === process.env.DATABASE_LOGGING,
    };
  }
  private failToConnectDatabase(error: Error): void {
    console.error(error);
    process.exit(1);
  }
  async onModuleDestroy(): Promise<void> {
    if (this.databaseConnection) await this.databaseConnection.close();
  }
}
