import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { UrlModule } from './modules/url/url.module';
import { TrackerModule } from './modules/tracker/tracker.module';
import { CustomThrottlerGuard } from './infra/guards/throttler.guard';
import { RedisThrottlerStorage } from './infra/storage/redis-throttler.storage';
import { cacheConfig } from './config/cache.config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'url_shortener',
      autoLoadEntities: true,
      synchronize: true,
    }),
    CacheModule.registerAsync(cacheConfig),
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        throttlers: [{
          ttl: 60000,
          limit: 30,
        }],
        storage: new RedisThrottlerStorage(),
      }),
    }),
    UrlModule,
    TrackerModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
