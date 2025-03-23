import { Test, TestingModule } from '@nestjs/testing';
import { TrackVisitProcessorService } from './track-visit-processor.service';
import { TrackerRepository } from '../../db/tracker.repository';
import { UrlRepository } from '../../../url/db/url.repository';
import { UrlEntity } from '../../../url/db/url.entity';

describe('TrackVisitProcessorService', () => {
  let service: TrackVisitProcessorService;
  let trackerRepository: TrackerRepository;
  let urlRepository: UrlRepository;

  // Mock data
  const mockUrl: UrlEntity = {
    id: 1,
    url: 'https://example.com',
    slug: 'example',
    user_id: 'user123',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackVisitProcessorService,
        {
          provide: TrackerRepository,
          useValue: {
            trackVisitWithTransaction: jest.fn(),
          },
        },
        {
          provide: UrlRepository,
          useValue: {
            findBySlug: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TrackVisitProcessorService>(TrackVisitProcessorService);
    trackerRepository = module.get<TrackerRepository>(TrackerRepository);
    urlRepository = module.get<UrlRepository>(UrlRepository);
  });

  // Test service instantiation
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processTrackVisit', () => {
    // Test successful visit tracking
    it('should successfully track visit for existing URL', async () => {
      const slug = 'example';
      const visitData = {
        user_agent: 'Mozilla/5.0',
        referrer: 'https://google.com',
        ip: '127.0.0.1',
        location: 'US',
      };

      jest.spyOn(urlRepository, 'findBySlug').mockResolvedValue(mockUrl);
      jest.spyOn(trackerRepository, 'trackVisitWithTransaction').mockResolvedValue(undefined);

      const result = await service.processTrackVisit(slug, visitData);
      expect(result).toEqual({ success: true, urlId: mockUrl.id });
      expect(urlRepository.findBySlug).toHaveBeenCalledWith(slug);
      expect(trackerRepository.trackVisitWithTransaction).toHaveBeenCalledWith(mockUrl.id, visitData);
    });

    // Test handling non-existent URL
    it('should handle non-existent URL gracefully', async () => {
      const slug = 'nonexistent';
      const visitData = {
        user_agent: 'Mozilla/5.0',
      };

      jest.spyOn(urlRepository, 'findBySlug').mockResolvedValue(null);

      const result = await service.processTrackVisit(slug, visitData);
      expect(result).toEqual({ success: false, reason: 'URL not found' });
      expect(urlRepository.findBySlug).toHaveBeenCalledWith(slug);
      expect(trackerRepository.trackVisitWithTransaction).not.toHaveBeenCalled();
    });

    // Test error handling
    it('should handle tracking errors gracefully', async () => {
      const slug = 'example';
      const visitData = {
        user_agent: 'Mozilla/5.0',
      };

      const error = new Error('Database error');
      jest.spyOn(urlRepository, 'findBySlug').mockResolvedValue(mockUrl);
      jest.spyOn(trackerRepository, 'trackVisitWithTransaction').mockRejectedValue(error);

      const result = await service.processTrackVisit(slug, visitData);
      expect(result).toEqual({ success: false, reason: error.message });
      expect(urlRepository.findBySlug).toHaveBeenCalledWith(slug);
      expect(trackerRepository.trackVisitWithTransaction).toHaveBeenCalledWith(mockUrl.id, visitData);
    });
  });
}); 