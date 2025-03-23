import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackerRepository } from './db/tracker.repository';
import { TrackerCounterEntity } from './db/tracker-counter.entity';
import { TrackerVisitEntity } from './db/tracker-visit.entity';
import { UrlModule } from '../url/url.module';
import { GetCountController } from './use-cases/get-count/get-count.controller';
import { GetCountService } from './use-cases/get-count/get-count.service';
import { GetVisitsController } from './use-cases/get-visits/get-visits.controller';
import { GetVisitsService } from './use-cases/get-visits/get-visits.service';
import { TrackVisitService } from './use-cases/track-visit/track-visit.service';
import { TrackVisitProcessorService } from './use-cases/track-visit/track-visit-processor.service';
import { QueueModule } from '../../infra/queue/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrackerCounterEntity, TrackerVisitEntity]),
    forwardRef(() => UrlModule),
    QueueModule,
  ],
  controllers: [GetCountController, GetVisitsController],
  providers: [
    GetCountService,
    GetVisitsService,
    TrackVisitService,
    TrackVisitProcessorService,
    TrackerRepository,
  ],
  exports: [TrackVisitService, TrackVisitProcessorService, TrackerRepository],
})
export class TrackerModule {}
