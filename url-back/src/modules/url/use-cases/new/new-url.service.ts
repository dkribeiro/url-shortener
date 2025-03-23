import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UrlRepository } from '../../db/url.repository';
import { NewUrlDto } from './new-url.dto';

@Injectable()
export class NewUrlService {

  constructor(
    private urlRepository: UrlRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async handle(dto: NewUrlDto, userId?: string) {

    if (dto.slug) {
      const existingUrl = await this.urlRepository.findBySlug(dto.slug);
      if (existingUrl) {
        throw new BadRequestException('Slug already exists');
      }
      const urlEntity = await this.urlRepository.save({
        url: dto.url,
        slug: dto.slug,
        user_id: userId || null,
      });
      await this.cacheManager.set(`url:${dto.slug}`, urlEntity.url);
      return { slug: dto.slug };
    }

    const slug = await this.urlRepository.saveAndGenerateSlug(dto.url, userId);

    return { slug };
  }
}