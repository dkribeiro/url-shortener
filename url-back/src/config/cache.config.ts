import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';

export const cacheConfig: CacheModuleAsyncOptions = {
  isGlobal: true,
  useFactory: async () => ({
    store: await redisStore({
      host: process.env.REDIS_HOST || 'redis',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      ttl: 60 * 1000, // 1 minute
    }),
  }),
};
