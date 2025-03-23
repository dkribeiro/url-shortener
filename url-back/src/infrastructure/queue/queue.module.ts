import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BullQueueProvider } from './providers/bull-queue.provider';
import { BullQueueService } from './bull-queue.service';
import { TrackVisitProcessor } from './processors/track-visit.processor';
import { UrlModule } from '../../modules/url/url.module';
import { TrackerModule } from '../../modules/tracker/tracker.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    BullModule.registerQueue({
      name: 'url-queue',
    }),
    forwardRef(() => UrlModule),
    forwardRef(() => TrackerModule),
  ],
  providers: [
    BullQueueProvider,
    {
      provide: 'QueueService',
      useClass: BullQueueService,
    },
    TrackVisitProcessor,
  ],
  exports: ['QueueService', TrackVisitProcessor],
})
export class QueueModule {}
