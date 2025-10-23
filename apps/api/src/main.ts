import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const PORT = parseInt(process.env.PORT ?? '3000', 10);
  const NODE_ENV = process.env.NODE_ENV ?? 'development';

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(logger);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('AlgJudge API')
    .setDescription('API para juez en línea (Primera Entrega)')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(PORT, '0.0.0.0');
  const url = await app.getUrl();

  logger.log(`?? AlgJudge API iniciada en ${url} (NODE_ENV=${NODE_ENV})`);
  logger.log(`?? Swagger listo en ${url}/docs`);
}

bootstrap();