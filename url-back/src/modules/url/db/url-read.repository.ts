import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UrlEntity } from './url.entity';

@Injectable()
export class UrlReadRepository extends Repository<UrlEntity> {
  constructor(private dataSource: DataSource) {
    super(UrlEntity, dataSource.createEntityManager());
  }

  async findByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ items: UrlEntity[]; total: number }> {
    const [items, total] = await this.createQueryBuilder('url')
      .where('url.user_id = :userId', { userId })
      .orderBy('url.created_at', 'DESC')
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return { items, total };
  }
} 