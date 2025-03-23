import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('url-queue')
export class QueueProcessor {
  private readonly logger = new Logger(QueueProcessor.name);

  @Process('process-url')
  async handleUrl(job: Job) {
    this.logger.debug('Processing job: ' + job.id);
    this.logger.debug('Job data:', job.data);

    // Add your URL processing logic here
    // For example: shortening URLs, validating, etc.

    return { processed: true, jobId: job.id };
  }
} 