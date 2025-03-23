import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { databaseConfig } from './config/database.config';
import { UrlModule } from './modules/url/url.module';
import { QueueModule } from './infra/queue/queue.module';
import { TrackerModule } from './modules/tracker/tracker.module';
import { cacheConfig } from './config/cache.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(databaseConfig.write),
    TypeOrmModule.forRoot({
      ...databaseConfig.read,
      name: 'read',
    }),
    CacheModule.registerAsync(cacheConfig),
    UrlModule,
    QueueModule,
    TrackerModule,
  ],
})
export class AppModule {}
