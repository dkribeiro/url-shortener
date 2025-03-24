import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { UrlModule } from './modules/url/url.module';
import { TrackerModule } from './modules/tracker/tracker.module';
import { CustomThrottlerGuard } from './infra/guards/throttler.guard';
import { RedisThrottlerStorage } from './infra/storage/redis-throttler.storage';
import { cacheConfig } from './config/cache.config';
import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(getDatabaseConfig().write),
    TypeOrmModule.forRoot({
      ...getDatabaseConfig().read,
      name: 'read',
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
