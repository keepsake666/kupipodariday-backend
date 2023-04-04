import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import helmet from 'helmet';

async function bootstrap() {
  const PORT = process.env.PORT_NEST || 3000;
  const app = await NestFactory.create(AppModule, { cors: { origin: '*' } });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);
}
bootstrap();
