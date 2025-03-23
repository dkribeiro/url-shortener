import { Test, TestingModule } from '@nestjs/testing';
import { GetVisitsService } from './get-visits.service';
import { TrackerRepository } from '../../db/tracker.repository';
import { UrlRepository } from '../../../url/db/url.repository';
import { UrlEntity } from '../../../url/db/url.entity';
import { ForbiddenException } from '@nestjs/common';
import { TrackerVisitEntity } from '../../db/tracker-visit.entity';

describe('GetVisitsService', () => {
  let service: GetVisitsService;
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

  const mockVisits: TrackerVisitEntity[] = [
    {
      id: 1,
      url_id: 1,
      url: mockUrl,
      user_agent: 'Mozilla/5.0',
      referrer: 'https://google.com',
      ip: '127.0.0.1',
      location: 'US',
      created_at: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetVisitsService,
        {
          provide: TrackerRepository,
          useValue: {
            getVisits: jest.fn(),
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

    service = module.get<GetVisitsService>(GetVisitsService);
    trackerRepository = module.get<TrackerRepository>(TrackerRepository);
    urlRepository = module.get<UrlRepository>(UrlRepository);
  });

  // Test service instantiation
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handle', () => {
    // Test successful retrieval of visits
    it('should return visits for URL', async () => {
      const slug = 'example';
      const page = 1;
      const limit = 10;
      const userId = 'user123';

      jest.spyOn(urlRepository, 'findBySlug').mockResolvedValue(mockUrl);
      jest.spyOn(trackerRepository, 'getVisits').mockResolvedValue({
        items: mockVisits,
        total: 1,
      });

      const result = await service.handle(slug, page, limit, userId);
      expect(result).toEqual({
        items: mockVisits,
        total: 1,
      });
      expect(urlRepository.findBySlug).toHaveBeenCalledWith(slug);
      expect(trackerRepository.getVisits).toHaveBeenCalledWith(mockUrl.id, page, limit);
    });

    // Test handling non-existent URL
    it('should return empty result for non-existent URL', async () => {
      const slug = 'nonexistent';
      const page = 1;
      const limit = 10;
      const userId = 'user123';

      jest.spyOn(urlRepository, 'findBySlug').mockResolvedValue(null);

      const result = await service.handle(slug, page, limit, userId);
      expect(result).toEqual({
        items: [],
        total: 0,
      });
      expect(urlRepository.findBySlug).toHaveBeenCalledWith(slug);
      expect(trackerRepository.getVisits).not.toHaveBeenCalled();
    });

    // Test access control
    it('should throw ForbiddenException for unauthorized access', async () => {
      const slug = 'example';
      const page = 1;
      const limit = 10;
      const userId = 'different-user';

      jest.spyOn(urlRepository, 'findBySlug').mockResolvedValue(mockUrl);

      await expect(service.handle(slug, page, limit, userId)).rejects.toThrow(ForbiddenException);
      expect(urlRepository.findBySlug).toHaveBeenCalledWith(slug);
      expect(trackerRepository.getVisits).not.toHaveBeenCalled();
    });

    // Test access to public URL
    it('should allow access to URL without owner', async () => {
      const publicUrl: UrlEntity = {
        ...mockUrl,
        user_id: null,
      };
      const slug = 'public';
      const page = 1;
      const limit = 10;
      const userId = 'any-user';

      jest.spyOn(urlRepository, 'findBySlug').mockResolvedValue(publicUrl);
      jest.spyOn(trackerRepository, 'getVisits').mockResolvedValue({
        items: mockVisits,
        total: 1,
      });

      const result = await service.handle(slug, page, limit, userId);
      expect(result).toEqual({
        items: mockVisits,
        total: 1,
      });
      expect(urlRepository.findBySlug).toHaveBeenCalledWith(slug);
      expect(trackerRepository.getVisits).toHaveBeenCalledWith(publicUrl.id, page, limit);
    });

    // Test error handling
    it('should handle repository errors gracefully', async () => {
      const slug = 'example';
      const page = 1;
      const limit = 10;
      const userId = 'user123';

      jest.spyOn(urlRepository, 'findBySlug').mockResolvedValue(mockUrl);
      jest.spyOn(trackerRepository, 'getVisits').mockImplementation(() => {
        throw new Error('Database error');
      });

      const result = await service.handle(slug, page, limit, userId);
      expect(result).toEqual({
        items: [],
        total: 0,
      });
      expect(urlRepository.findBySlug).toHaveBeenCalledWith(slug);
      expect(trackerRepository.getVisits).toHaveBeenCalledWith(mockUrl.id, page, limit);
    });
  });
}); 