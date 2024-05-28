import { DocumentBuilder } from '@nestjs/swagger';

export const appVersion = '3.0';

const title: string = 'Algorithm Server API';
const description: string = `알고리즘 서버를 위한 API입니다.`;
const localAPIServerUrl: string = 'http://localhost:8000';
const developmentAPIServerUrl: string = '개발서버 API';
const productionAPIServerUrl: string = '프로덕션 서버 API';

export const swaggerConfig = new DocumentBuilder()
  .addServer(localAPIServerUrl)
  .addServer(developmentAPIServerUrl)
  .addServer(productionAPIServerUrl)
  .setTitle(title)
  .setDescription(description)
  .setVersion(appVersion)
  .addBearerAuth()
  .build();
