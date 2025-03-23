import { Injectable, NotFoundException } from '@nestjs/common';
import { UrlRepository } from '../../db/url.repository';

@Injectable()
export class RedirectService {
  constructor(private urlRepository: UrlRepository) {}

  async handle(slug: string) {
    const urlEntity = await this.urlRepository.findBySlug(slug);
    if (!urlEntity) 
      return null;
    
    return  urlEntity?.url ;
  }
}