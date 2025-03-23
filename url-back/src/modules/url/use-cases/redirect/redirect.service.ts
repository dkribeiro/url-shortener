import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UrlRepository } from '../../db/url.repository';

@Injectable()
export class RedirectService {
  private readonly logger = new Logger(RedirectService.name);

  constructor(
    private urlRepository: UrlRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async handle(slug: string) {
    // Try to get the URL from cache first
    const cachedUrl = await this.cacheManager.get<string>(`url:${slug}`);
    if (cachedUrl) {
      this.logger.debug(`Cache hit for slug: ${slug}`);
      return cachedUrl;
    }

    this.logger.debug(`Cache miss for slug: ${slug}`);

    // If not in cache, get from database
    const urlEntity = await this.urlRepository.findBySlug(slug);
    if (!urlEntity) {
      return null;
    }

    // Store in cache for future requests
    await this.cacheManager.set(`url:${slug}`, urlEntity.url);

    return urlEntity.url;
  }
}
