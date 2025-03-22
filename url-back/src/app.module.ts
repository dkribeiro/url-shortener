import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(databaseConfig.write),
    TypeOrmModule.forRoot({
      ...databaseConfig.read,
      name: 'read',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
