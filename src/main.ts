import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Main-Orders-MS');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    { 
      /// Aca los cambios
      transport: Transport.NATS,
      options: {
        ///
        servers: envs.natsServers
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen();

  logger.log(`Microservice Orders-MS started on port ${envs.port}`);
}
bootstrap();
