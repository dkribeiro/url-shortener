import { Injectable, Logger } from '@nestjs/common';
import { TrackerRepository } from '../../db/tracker.repository';
import { UrlRepository } from '../../../url/db/url.repository';

@Injectable()
export class TrackVisitProcessorService {
  private readonly logger = new Logger(TrackVisitProcessorService.name);

  constructor(
    private trackerRepository: TrackerRepository,
    private urlRepository: UrlRepository,
  ) {}

  /**
   * Process a track visit job
   * @param slug The URL slug to track
   * @param visitData The visit data to log
   * @returns Result of the tracking operation
   */
  async processTrackVisit(slug: string, visitData: any): Promise<any> {
    try {
      // Find the URL entity by slug
      const urlEntity = await this.urlRepository.findBySlug(slug);

      if (!urlEntity) {
        this.logger.warn(
          `Attempted to track visit for non-existent slug: ${slug}`,
        );
        return { success: false, reason: 'URL not found' };
      }

      // Use the transaction method to ensure both operations succeed or fail together
      await this.trackerRepository.trackVisitWithTransaction(
        urlEntity.id,
        visitData,
      );

      this.logger.debug(
        `Successfully tracked visit for slug: ${slug} within a transaction`,
      );
      return { success: true, urlId: urlEntity.id };
    } catch (error) {
      this.logger.error(
        `Error tracking visit for slug ${slug}: ${error.message}`,
        error.stack,
      );
      return { success: false, reason: error.message };
    }
  }
}
