import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { TrackerRepository } from '../../db/tracker.repository';
import { UrlRepository } from '../../../url/db/url.repository';

@Injectable()
export class GetVisitsService {
  private readonly logger = new Logger(GetVisitsService.name);

  constructor(
    private trackerRepository: TrackerRepository,
    private urlRepository: UrlRepository,
  ) {}

  async handle(
    slug: string,
    page: number = 1,
    limit: number = 10,
    userId?: string,
  ): Promise<{
    items: any[];
    total: number;
  }> {
    try {
      const urlEntity = await this.urlRepository.findBySlug(slug);
      if (!urlEntity) {
        return { items: [], total: 0 };
      }

      // Check if URL has an owner and if it belongs to the requesting user
      if (urlEntity.user_id && urlEntity.user_id !== userId) {
        throw new ForbiddenException(
          "You do not have permission to view this URL's statistics",
        );
      }

      return this.trackerRepository.getVisits(urlEntity.id, page, limit);
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      this.logger.error(
        `Error getting visits for slug ${slug}: ${error.message}`,
        error.stack,
      );
      return { items: [], total: 0 };
    }
  }
}
