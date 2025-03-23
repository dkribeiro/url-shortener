import { Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { TrackVisitProcessorService } from '../../../modules/tracker/use-cases/track-visit/track-visit-processor.service';

@Processor('url-queue')
@Injectable()
export class TrackVisitProcessor {
  private readonly logger = new Logger(TrackVisitProcessor.name);

  constructor(
    private trackVisitProcessorService: TrackVisitProcessorService,
  ) {}

  @Process('track-visit')
  async handleTrackVisit(job: Job): Promise<any> {
    this.logger.debug(`Processing track-visit job: ${job.id}`);
    const { slug, visitData } = job.data;

    // Delegate the processing to the dedicated service in the tracker module
    const result = await this.trackVisitProcessorService.processTrackVisit(slug, visitData);
    
    if (result.success) {
      this.logger.debug(`Successfully processed track-visit job: ${job.id}`);
    } else {
      this.logger.warn(`Failed to process track-visit job: ${job.id} - ${result.reason}`);
    }
    
    return result;
  }
}
