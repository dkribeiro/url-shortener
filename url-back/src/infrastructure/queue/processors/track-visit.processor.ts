import { Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { TrackerRepository } from '../../../modules/tracker/db/tracker.repository';
import { UrlRepository } from '../../../modules/url/db/url.repository';

@Processor('url-queue')
@Injectable()
export class TrackVisitProcessor {
  private readonly logger = new Logger(TrackVisitProcessor.name);

  constructor(
    private trackerRepository: TrackerRepository,
    private urlRepository: UrlRepository,
  ) {}

  @Process('track-visit')
  async handleTrackVisit(job: Job): Promise<any> {
    this.logger.debug(`Processing track-visit job: ${job.id}`);
    const { slug, visitData } = job.data;

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
