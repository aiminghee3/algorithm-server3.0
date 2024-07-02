// src/config/typeorm.config
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeORMConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  return {
    type: 'mysql',
    host: configService.get<string>('MYSQL_HOST') || 'localhost',
    port: parseInt(configService.get<string>('MYSQL_PORT')) || 3306,
    username: configService.get<string>('MYSQL_USERNAME') || 'root',
    password: configService.get<string>('MYSQL_PASSWORD') || '00000000',
    database: configService.get<string>('MYSQL_DATABASE') || 'algorithm2',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: configService.get<boolean>('DB_SYNCHRONIZE') || false,
    // logging: true,
  }
}
