import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { UrlModule } from './modules/url/url.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(databaseConfig.write),
    TypeOrmModule.forRoot({
      ...databaseConfig.read,
      name: 'read',
    }),
    UrlModule,
  ]
})
export class AppModule {}
