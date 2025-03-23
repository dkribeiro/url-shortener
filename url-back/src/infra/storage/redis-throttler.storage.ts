import { ThrottlerStorage } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

type ThrottlerStorageRecord = {
  totalHits: number;
  timeToExpire: number;
  blockDuration: number;
  throttlerName: string;
  isBlocked: boolean;
  timeToBlockExpire: number;
};

@Injectable()
export class RedisThrottlerStorage implements ThrottlerStorage {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
    });
  }

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string,
  ): Promise<ThrottlerStorageRecord> {
    const multi = this.redis.multi();
    multi.incr(key);
    multi.pexpire(key, ttl);
    const results = await multi.exec();
    const totalHits = (results?.[0]?.[1] as number) || 0;
    const isBlocked = totalHits > limit;

    return {
      totalHits,
      timeToExpire: ttl,
      blockDuration,
      throttlerName,
      isBlocked,
      timeToBlockExpire: isBlocked ? blockDuration : 0,
    };
  }
} 