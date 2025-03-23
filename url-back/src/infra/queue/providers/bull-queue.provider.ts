import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { QueueProvider } from './queue.provider.interface';

@Injectable()
export class BullQueueProvider implements QueueProvider, OnModuleInit {
  private queues: Map<string, Queue> = new Map();

  constructor(@InjectQueue('url-queue') private readonly urlQueue: Queue) {}

  /**
   * Initialize queues on module initialization
   */
  onModuleInit() {
    this.queues.set('url-queue', this.urlQueue);
  }

  /**
   * Register a Bull queue
   * @param queueName The name of the queue
   * @param queue The Bull queue instance
   */
  registerQueue(queueName: string, queue: Queue): void {
    this.queues.set(queueName, queue);
  }

  /**
   * Get a Bull queue by name
   * @param queueName The name of the queue
   */
  getQueue(queueName: string): Queue {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }
    return queue;
  }

  /**
   * Add a job to the queue
   * @param queueName The name of the queue
   * @param jobName The name of the job
   * @param data The data to be processed
   * @param options Optional job options
   */
  async addJob(
    queueName: string,
    jobName: string,
    data: any,
    options?: any,
  ): Promise<any> {
    const queue = this.getQueue(queueName);
    return await queue.add(jobName, data, options);
  }

  /**
   * Get a job by its ID
   * @param queueName The name of the queue
   * @param jobId The ID of the job
   */
  async getJob(queueName: string, jobId: string): Promise<any> {
    const queue = this.getQueue(queueName);
    return await queue.getJob(jobId);
  }

  /**
   * Get jobs by status
   * @param queueName The name of the queue
   * @param status The status of the jobs to retrieve
   */
  async getJobs(queueName: string, status: string): Promise<any[]> {
    const queue = this.getQueue(queueName);
    return await queue.getJobs([
      status as
        | 'completed'
        | 'failed'
        | 'delayed'
        | 'active'
        | 'waiting'
        | 'paused',
    ]);
  }
}
