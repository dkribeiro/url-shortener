import { Injectable, Logger } from '@nestjs/common';
import { TrackerRepository } from '../../db/tracker.repository';
import { UrlRepository } from '../../../url/db/url.repository';

@Injectable()
export class TrackVisitService {
  private readonly logger = new Logger(TrackVisitService.name);

  constructor(
    private trackerRepository: TrackerRepository,
    private urlRepository: UrlRepository,
  ) {}

  async handle(slug: string, visitData: {
    user_agent?: string;
    referrer?: string;
    ip?: string;
    location?: string;
  }): Promise<void> {
    try {
      // Find the URL entity by slug
      const urlEntity = await this.urlRepository.findBySlug(slug);
      
      if (!urlEntity) {
        this.logger.warn(`Attempted to track visit for non-existent slug: ${slug}`);
        return;
      }

      // Use the transaction method to ensure both operations succeed or fail together
      await this.trackerRepository.trackVisitWithTransaction(urlEntity.id, visitData);
      
      this.logger.debug(`Tracked visit for slug: ${slug} within a transaction`);
    } catch (error) {
      this.logger.error(`Error tracking visit for slug ${slug}: ${error.message}`, error.stack);
    }
  }
}