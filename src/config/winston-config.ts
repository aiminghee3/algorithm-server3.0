import { ConfigModule, ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import * as WinstonDaily from 'winston-daily-rotate-file';
import {
  WinstonModuleAsyncOptions,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';

export const winstonConfigFactory: WinstonModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    return {
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
          level: configService.get('NODE_ENV') == 'dev' ? 'debug' : 'info',
        }),
        new WinstonDaily({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
          level: configService.get('NODE_ENV') == 'prod' ? 'warn' : 'info',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          filename: 'custom-logs-all/%DATE%.log',
          maxSize: '20m',
          maxFiles: '28d',
        }),
      ],
    };
  },
  inject: [ConfigService],
};
