import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 모든 출처 허용
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      // whiteList -> 엔티티 데코레이터에 없는 프로퍼티 값은 무조건 거름
      // forbidNonWhitelisted -> 엔티티 데코레이터에 없는 값 인입시 그 값에 대한 에러메세지 알려줌
      // transform -> 컨트롤러가 값을 받을때 컨트롤러에 정의한 타입으로 형변환
      whitelist: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('CHERRY_POINT')
    .setDescription('CHERRY_POINT API DOCS')
    .setVersion('0.1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        in: 'header',
        name: 'JWT',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
  });

  await app.listen(3000);
}
bootstrap();
