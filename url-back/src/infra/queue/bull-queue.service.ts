import { Injectable, Logger } from '@nestjs/common';
import { BullQueueProvider } from './providers/bull-queue.provider';
import { QueueServiceInterface } from './queue.service.interface';

@Injectable()
export class BullQueueService implements QueueServiceInterface {
  private readonly logger = new Logger(BullQueueService.name);
  private readonly queueName = 'url-queue';

  constructor(private readonly queueProvider: BullQueueProvider) {
    this.logger.log('BullQueueService initialized');
  }

  /**
   * Add a job to the queue
   * @param jobName The name of the job
   * @param data The data to be processed
   * @param options Optional job options
   */
  async addJob(jobName: string, data: any, options?: any): Promise<any> {
    this.logger.debug(`Adding job ${jobName} to queue ${this.queueName}`);
    try {
      const job = await this.queueProvider.addJob(
        this.queueName,
        jobName,
        data,
        options || {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      );
      this.logger.debug(`Job ${jobName} added successfully with ID: ${job.id}`);
      return job;
    } catch (error) {
      this.logger.error(`Error adding job ${jobName}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get a job by its ID
   * @param jobId The ID of the job
   */
  async getJob(jobId: string): Promise<any> {
    return this.queueProvider.getJob(this.queueName, jobId);
  }

  /**
   * Get jobs by status
   * @param status The status of the jobs to retrieve
   */
  async getJobs(status: string): Promise<any[]> {
    return this.queueProvider.getJobs(this.queueName, status);
  }
}
