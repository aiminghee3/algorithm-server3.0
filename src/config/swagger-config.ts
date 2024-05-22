import { DocumentBuilder } from '@nestjs/swagger';

export const appVersion = '3.0';

const title = 'Algorithm Server API';
const description = `알고리즘 서버를 위한 API입니다.`;
const localAPIServerUrl = 'http://localhost:8000';
const developmentAPIServerUrl = '개발서버 API';
const productionAPIServerUrl = '프로덕션 서버 API';

export const swaggerConfig = new DocumentBuilder()
  .addServer(localAPIServerUrl)
  .addServer(developmentAPIServerUrl)
  .addServer(productionAPIServerUrl)
  .setTitle(title)
  .setDescription(description)
  .setVersion(appVersion)
  .addBearerAuth()
  .build();
