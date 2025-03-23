import { Injectable, Logger, Inject } from '@nestjs/common';
import { TrackerRepository } from '../../db/tracker.repository';
import { UrlRepository } from '../../../url/db/url.repository';
import { QueueServiceInterface } from '../../../../infrastructure/queue/queue.service.interface';

@Injectable()
export class TrackVisitService {
  private readonly logger = new Logger(TrackVisitService.name);

  constructor(
    private trackerRepository: TrackerRepository,
    private urlRepository: UrlRepository,
    @Inject('QueueService') private queueService: QueueServiceInterface,
  ) {}

  async handle(
    slug: string,
    visitData: {
      user_agent?: string;
      referrer?: string;
      ip?: string;
      location?: string;
    },
  ): Promise<void> {
    try {
      const job = await this.queueService.addJob('track-visit', {
        slug,
        visitData,
      });
    } catch (error) {
      this.logger.error(
        `Error adding track visit job to queue for slug ${slug}: ${error.message}`,
        error.stack,
      );
    }
  }
}
