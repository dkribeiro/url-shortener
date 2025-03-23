import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('url-queue') private readonly urlQueue: Queue,
  ) {}

  async addToQueue(data: any) {
    return await this.urlQueue.add('process-url', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }

  async getJob(jobId: string) {
    return await this.urlQueue.getJob(jobId);
  }

  async getJobs(status: 'completed' | 'failed' | 'active' | 'waiting') {
    return await this.urlQueue.getJobs([status]);
  }
} 