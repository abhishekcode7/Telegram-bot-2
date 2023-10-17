import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  let port = process.env.PORT || 5173
  await app.listen(port);
}
bootstrap();
