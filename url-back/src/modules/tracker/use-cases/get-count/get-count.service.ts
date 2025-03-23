import { Injectable, Logger } from '@nestjs/common';
import { TrackerRepository } from '../../db/tracker.repository';
import { UrlRepository } from '../../../url/db/url.repository';

@Injectable()
export class GetCountService {
  private readonly logger = new Logger(GetCountService.name);

  constructor(
    private trackerRepository: TrackerRepository,
    private urlRepository: UrlRepository,
  ) {}

  async handle(slug: string): Promise<number> {
    try {
      const urlEntity = await this.urlRepository.findBySlug(slug);
      if (!urlEntity) {
        return 0;
      }
      
      return this.trackerRepository.getVisitCount(urlEntity.id);
    } catch (error) {
      this.logger.error(`Error getting visit count for slug ${slug}: ${error.message}`, error.stack);
      return 0;
    }
  }
}