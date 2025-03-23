import { DataSource, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { TrackerCounterEntity } from './tracker-counter.entity';
import { TrackerVisitEntity } from './tracker-visit.entity';

@Injectable()
export class TrackerRepository {
  private counterRepository: Repository<TrackerCounterEntity>;
  private visitRepository: Repository<TrackerVisitEntity>;
  private readonly logger = new Logger(TrackerRepository.name);

  constructor(private dataSource: DataSource) {
    this.counterRepository =
      this.dataSource.getRepository(TrackerCounterEntity);
    this.visitRepository = this.dataSource.getRepository(TrackerVisitEntity);
  }

  async incrementCounter(urlId: number): Promise<void> {
    // Check if counter exists for this URL
    let counter = await this.counterRepository.findOne({
      where: { url_id: urlId },
    });

    if (!counter) {
      // Create new counter if it doesn't exist
      counter = await this.counterRepository.save({ urlId, counter: 1 });
    } else {
      // Increment existing counter
      await this.counterRepository.increment({ id: counter.id }, 'counter', 1);
    }
  }

  async logVisit(
    urlId: number,
    visitData: {
      user_agent?: string;
      referrer?: string;
      ip?: string;
      location?: string;
    },
  ): Promise<TrackerVisitEntity> {
    return this.visitRepository.save({
      urlId,
      user_agent: visitData.user_agent || null,
      referrer: visitData.referrer || null,
      ip: visitData.ip || null,
      location: visitData.location || null,
    });
  }

  async trackVisitWithTransaction(
    urlId: number,
    visitData: {
      user_agent?: string;
      referrer?: string;
      ip?: string;
      location?: string;
    },
  ): Promise<void> {
    // Use a transaction to ensure both operations succeed or fail together
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      // Get repositories with transaction context
      const counterRepo =
        transactionalEntityManager.getRepository(TrackerCounterEntity);
      const visitRepo =
        transactionalEntityManager.getRepository(TrackerVisitEntity);

      // Check if counter exists for this URL
      let counter = await counterRepo.findOne({ where: { url_id: urlId } });

      if (!counter) {
        // Create new counter if it doesn't exist
        counter = await counterRepo.save({ url_id: urlId, counter: 1 });
      } else {
        // Increment existing counter
        await counterRepo.increment({ id: counter.id }, 'counter', 1);
      }

      // Log the visit details
      await visitRepo.save({
        url_id: urlId,
        user_agent: visitData.user_agent || null,
        referrer: visitData.referrer || null,
        ip: visitData.ip || null,
        location: visitData.location || null,
      });

      this.logger.debug(
        `Successfully tracked visit for URL ID: ${urlId} in a transaction`,
      );
    });
  }

  async getVisitCount(urlId: number): Promise<number> {
    const counter = await this.counterRepository.findOne({
      where: { url_id: urlId },
    });
    return counter ? counter.counter : 0;
  }

  async getVisits(
    urlId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ items: TrackerVisitEntity[]; total: number }> {
    const [items, total] = await this.visitRepository.findAndCount({
      where: { url_id: urlId },
      take: limit,
      skip: (page - 1) * limit,
      order: { created_at: 'DESC' },
    });

    return { items, total };
  }
}
