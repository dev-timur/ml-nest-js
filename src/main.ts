import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './middlewares/swagger';
import { setupVersioning } from './middlewares/setupVersion';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupVersioning(app);
  setupSwagger(app);

  await app.listen(4000);
}
bootstrap();
