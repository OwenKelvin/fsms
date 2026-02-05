/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';

import { AppModule } from './app/app.module';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const processRequest = require('graphql-upload/processRequest.js')

function fastifyGraphQLUpload(fastify) {
  fastify.addContentTypeParser('multipart', (req, body, done) => {
    req.isMultipart = true
    done()
  })

  fastify.addHook('preValidation', async function(request, reply) {
    if (!request.isMultipart) {
      return
    }
    request.body = await processRequest(request.raw, reply.raw)
  })
}


async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();
  fastifyGraphQLUpload(fastifyAdapter.getInstance());

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter
  );
  // app.useGlobalPipes(new ValidationPipe());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,

      exceptionFactory: (errors) => {
        const fields = errors.map((err) => ({
          field: err.property,
          message: Object.values(err.constraints ?? {}).join(' ,'),
        }));

        return new BadRequestException({
          message: 'Validation failed',
          fields,
        });
      },
    }),
  );

  app.enableCors();

  const port = process.env['FSMS_BACKEND_PORT'] || 3000;
  await app.listen(port, '0.0.0.0');
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/graphql`
  );
}

bootstrap().then();
