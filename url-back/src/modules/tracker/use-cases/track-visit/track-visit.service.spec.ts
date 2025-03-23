import { Test, TestingModule } from '@nestjs/testing';
import { TrackVisitService } from './track-visit.service';
import { TrackerRepository } from '../../db/tracker.repository';
import { UrlRepository } from '../../../url/db/url.repository';
import { QueueServiceInterface } from '../../../../infra/queue/queue.service.interface';

describe('TrackVisitService', () => {
  let service: TrackVisitService;
  let queueService: QueueServiceInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackVisitService,
        {
          provide: TrackerRepository,
          useValue: {},
        },
        {
          provide: UrlRepository,
          useValue: {},
        },
        {
          provide: 'QueueService',
          useValue: {
            addJob: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TrackVisitService>(TrackVisitService);
    queueService = module.get<QueueServiceInterface>('QueueService');
  });

  // Test service instantiation
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handle', () => {
    // Test successful job addition
    it('should add track visit job to queue', async () => {
      const slug = 'example';
      const visitData = {
        user_agent: 'Mozilla/5.0',
        referrer: 'https://google.com',
        ip: '127.0.0.1',
        location: 'US',
      };

      jest.spyOn(queueService, 'addJob').mockResolvedValue({ id: 'job123' });

      await service.handle(slug, visitData);
      expect(queueService.addJob).toHaveBeenCalledWith('track-visit', {
        slug,
        visitData,
      });
    });

    // Test error handling
    it('should handle queue service errors gracefully', async () => {
      const slug = 'example';
      const visitData = {
        user_agent: 'Mozilla/5.0',
      };

      const error = new Error('Queue service error');
      jest.spyOn(queueService, 'addJob').mockRejectedValue(error);

      await expect(service.handle(slug, visitData)).resolves.not.toThrow();
      expect(queueService.addJob).toHaveBeenCalledWith('track-visit', {
        slug,
        visitData,
      });
    });

    // Test with minimal visit data
    it('should handle minimal visit data', async () => {
      const slug = 'example';
      const visitData = {};

      jest.spyOn(queueService, 'addJob').mockResolvedValue({ id: 'job123' });

      await service.handle(slug, visitData);
      expect(queueService.addJob).toHaveBeenCalledWith('track-visit', {
        slug,
        visitData,
      });
    });
  });
}); 