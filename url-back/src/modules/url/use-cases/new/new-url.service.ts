import { BadRequestException, Injectable } from '@nestjs/common';
import { UrlRepository } from '../../db/url.repository';
import { NewUrlDto } from './new-url.dto';
import { IdEncoderService } from '../../utils/id-encoder.service';

@Injectable()
export class NewUrlService {

  constructor(private urlRepository: UrlRepository) {}

  async handle(dto: NewUrlDto, userId?: string) {
    if (dto.slug) {
      const existingUrl = await this.urlRepository.findBySlug(dto.slug);
      if (existingUrl) {
        throw new BadRequestException('Slug already exists');
      }
      await this.urlRepository.save({
        url: dto.url,
        slug: dto.slug,
        user_id: userId || null,
      });
      return { slug: dto.slug };
    }

    const slug = await this.urlRepository.saveAndGenerateSlug(dto.url, userId);

    return { slug };
  }
}