import { Injectable, Logger } from '@nestjs/common';
import { UrlReadRepository } from '../../db/url-read.repository';

@Injectable()
export class ListUrlsService {
  private readonly logger = new Logger(ListUrlsService.name);

  constructor(private urlReadRepository: UrlReadRepository) {}

  async handle(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    items: any[];
    total: number;
  }> {
    try {
      return this.urlReadRepository.findByUserId(userId, page, limit);
    } catch (error) {
      this.logger.error(`Error retrieving URLs for user ${userId}:`, error);
      throw error;
    }
  }
}
