import { Injectable, Logger } from '@nestjs/common';
import { UrlRepository } from '../../db/url.repository';

@Injectable()
export class ListUrlsService {
  private readonly logger = new Logger(ListUrlsService.name);

  constructor(private urlRepository: UrlRepository) {}

  async handle(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    items: any[];
    total: number;
  }> {
    try {
      return this.urlRepository.findByUserId(userId, page, limit);
    } catch (error) {
      this.logger.error(`Error retrieving URLs for user ${userId}:`, error);
      throw error;
    }
  }
}
