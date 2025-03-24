import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { BullQueueProvider } from './providers/bull-queue.provider';
import { BullQueueService } from './bull-queue.service';
import { TrackVisitProcessor } from './processors/track-visit.processor';
import { UrlModule } from '../../modules/url/url.module';
import { TrackerModule } from '../../modules/tracker/tracker.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const redisHost = configService.get('REDIS_HOST');
        const redisPort = configService.get('REDIS_PORT');
        console.log('Redis configuration:', { redisHost, redisPort });
        
        return {
          redis: {
            host: redisHost || 'localhost',
            port: parseInt(redisPort || '6379'),
          },
        };
      },
      inject: [ConfigService],
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
