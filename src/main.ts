import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger-config';
import cookieParser from 'cookie-parser';
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from '@nestjs/config'
import { ServiceExceptionToHttpExceptionFilter } from "./common/exception/exception-filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  const port = configService.get('PORT') || 8000;

  app.enableCors({
    origin: ['http://localhost:3000','https://www.codereview.site']
  });
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ServiceExceptionToHttpExceptionFilter())

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);
  app.use(cookieParser());
  await app.listen(port);
  console.log(`listening on port ${port}`);
}
bootstrap();
