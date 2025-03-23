import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { TrackerRepository } from '../../db/tracker.repository';
import { UrlRepository } from '../../../url/db/url.repository';

@Injectable()
export class GetCountService {
  private readonly logger = new Logger(GetCountService.name);

  constructor(
    private trackerRepository: TrackerRepository,
    private urlRepository: UrlRepository,
  ) {}

  async handle(slug: string, userId?: string): Promise<number> {
    try {
      const urlEntity = await this.urlRepository.findBySlug(slug);
      if (!urlEntity) {
        return 0;
      }
      
      // Check if URL has an owner and if it belongs to the requesting user
      if (urlEntity.user_id && urlEntity.user_id !== userId) {
        throw new ForbiddenException('You do not have permission to view this URL\'s statistics');
      }
      
      return this.trackerRepository.getVisitCount(urlEntity.id);
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      this.logger.error(`Error getting visit count for slug ${slug}: ${error.message}`, error.stack);
      return 0;
    }
  }
}