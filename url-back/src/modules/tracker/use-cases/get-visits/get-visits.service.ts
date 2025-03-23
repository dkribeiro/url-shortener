import { Injectable, Logger } from '@nestjs/common';
import { TrackerRepository } from '../../db/tracker.repository';
import { UrlRepository } from '../../../url/db/url.repository';

@Injectable()
export class GetVisitsService {
  private readonly logger = new Logger(GetVisitsService.name);

  constructor(
    private trackerRepository: TrackerRepository,
    private urlRepository: UrlRepository,
  ) {}

  async handle(slug: string, page: number = 1, limit: number = 10): Promise<{
    items: any[];
    total: number;
  }> {
    try {
      const urlEntity = await this.urlRepository.findBySlug(slug);
      if (!urlEntity) {
        return { items: [], total: 0 };
      }
      
      return this.trackerRepository.getVisits(urlEntity.id, page, limit);
    } catch (error) {
      this.logger.error(`Error getting visits for slug ${slug}: ${error.message}`, error.stack);
      return { items: [], total: 0 };
    }
  }
}