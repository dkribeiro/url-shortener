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
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig.write),
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
