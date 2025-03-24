import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation pipes globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      transform: true, // Automatically transform payloads
      forbidNonWhitelisted: true, // Throw errors if non-whitelisted properties are present
    }),
  );

  // Enable CORS for all localhost origins
  app.enableCors({
    origin: /^http:\/\/localhost:\d+$/, // Allow any localhost port
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'user_id',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    exposedHeaders: ['Content-Length', 'Content-Type'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const config = new DocumentBuilder()
    .setTitle('URL Shortener API')
    .setDescription(
      `
API documentation for URL Shortener service<br><br>

<b>Developed by DK Ribeiro</b><br>

<b>Links:</b><br>
• <a href="https://www.linkedin.com/in/dkribeiro/" target="_blank">LinkedIn</a><br>
• <a href="https://github.com/dkribeiro" target="_blank">GitHub</a>
    `,
    )
    .setVersion('1.0')
    .addTag('URL Shortener', 'API for shortening and tracking URLs')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'URL Shortener API',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .description a { color: #6C47FF; }
      .swagger-ui .description a:hover { color: #463297; }
    `,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
