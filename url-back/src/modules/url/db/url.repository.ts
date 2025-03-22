import { DataSource, Repository, UpdateResult } from 'typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import { UrlEntity } from './url.entity';
import { IdEncoderService } from '../utils/id-encoder.service';

@Injectable()
export class UrlRepository extends Repository<UrlEntity> {
  constructor(private dataSource: DataSource, private idEncoderService: IdEncoderService) {
    super(UrlEntity, dataSource.createEntityManager());
  }

  async findBySlug(slug: string): Promise<UrlEntity | null> {
    return this.findOne({ where: { slug } });
  }

  async saveAndGenerateSlug(url: string, user_id?: string): Promise<string> {
    
    const savedEntity = await this.save({ url, user_id: user_id || null });
    let slug = this.idEncoderService.encodeId(savedEntity.id);

    let retryCount = 0;
    const maxRetries = process.env.MAX_RETRIES ? parseInt(process.env.MAX_RETRIES) : 5;

    while (retryCount < maxRetries) {
      try {
        await this.update(savedEntity.id, { slug });
        return slug;
      } catch (error) {
        retryCount++;
        slug = `${this.idEncoderService.encodeId(savedEntity.id)}_${Math.random().toString(36).substring(2, 4)}`;
        continue;
      }
    }
    throw new ConflictException('Failed to generate unique slug after maximum retries');
  }

  async findByUserId(userId: string, page: number = 1, limit: number = 10): Promise<{ items: UrlEntity[]; total: number }> {
    const [items, total] = await this.findAndCount({
      where: { user_id: userId },
      take: limit,
      skip: (page - 1) * limit,
      order: { created_at: 'DESC' }
    });

    return { items, total };
  }

  async softDelete(id: number): Promise<UpdateResult> {
    return this.update(id, { deleted_at: new Date() });
  }

}
