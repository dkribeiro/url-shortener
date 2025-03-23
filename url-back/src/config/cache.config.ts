import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';

export const cacheConfig: CacheModuleAsyncOptions = {
  isGlobal: true,
  useFactory: async () => ({
    store: await redisStore({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      ttl: 60 * 1000, // 1 minute
    }),
  }),
};
