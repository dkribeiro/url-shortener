import { Test, TestingModule } from '@nestjs/testing';
import { GetCountService } from './get-count.service';
import { TrackerRepository } from '../../db/tracker.repository';
import { UrlRepository } from '../../../url/db/url.repository';
import { UrlEntity } from '../../../url/db/url.entity';
import { ForbiddenException } from '@nestjs/common';

describe('GetCountService', () => {
  let service: GetCountService;
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
        GetCountService,
        {
          provide: TrackerRepository,
          useValue: {
            getVisitCount: jest.fn(),
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

    service = module.get<GetCountService>(GetCountService);
    trackerRepository = module.get<TrackerRepository>(TrackerRepository);
    urlRepository = module.get<UrlRepository>(UrlRepository);
  });

  // Test service instantiation
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handle', () => {
    // Test successful retrieval of visit count
    it('should return visit count for URL', async () => {
      const slug = 'example';
      const userId = 'user123';
      const visitCount = 42;

      jest.spyOn(urlRepository, 'findBySlug').mockResolvedValue(mockUrl);
      jest.spyOn(trackerRepository, 'getVisitCount').mockResolvedValue(visitCount);

      const result = await service.handle(slug, userId);
      expect(result).toBe(visitCount);
      expect(urlRepository.findBySlug).toHaveBeenCalledWith(slug);
      expect(trackerRepository.getVisitCount).toHaveBeenCalledWith(mockUrl.id);
    });

    // Test handling non-existent URL
    it('should return 0 for non-existent URL', async () => {
      const slug = 'nonexistent';
      const userId = 'user123';

      jest.spyOn(urlRepository, 'findBySlug').mockResolvedValue(null);

      const result = await service.handle(slug, userId);
      expect(result).toBe(0);
      expect(urlRepository.findBySlug).toHaveBeenCalledWith(slug);
      expect(trackerRepository.getVisitCount).not.toHaveBeenCalled();
    });

    // Test access control
    it('should throw ForbiddenException for unauthorized access', async () => {
      const slug = 'example';
      const userId = 'different-user';

      jest.spyOn(urlRepository, 'findBySlug').mockResolvedValue(mockUrl);

      await expect(service.handle(slug, userId)).rejects.toThrow(ForbiddenException);
      expect(urlRepository.findBySlug).toHaveBeenCalledWith(slug);
      expect(trackerRepository.getVisitCount).not.toHaveBeenCalled();
    });

    // Test access to public URL
    it('should allow access to URL without owner', async () => {
      const publicUrl: UrlEntity = {
        ...mockUrl,
        user_id: null,
      };
      const slug = 'public';
      const userId = 'any-user';
      const visitCount = 42;

      jest.spyOn(urlRepository, 'findBySlug').mockResolvedValue(publicUrl);
      jest.spyOn(trackerRepository, 'getVisitCount').mockResolvedValue(visitCount);

      const result = await service.handle(slug, userId);
      expect(result).toBe(visitCount);
      expect(urlRepository.findBySlug).toHaveBeenCalledWith(slug);
      expect(trackerRepository.getVisitCount).toHaveBeenCalledWith(publicUrl.id);
    });

    // Test error handling
    it('should handle repository errors gracefully', async () => {
      const slug = 'example';
      const userId = 'user123';

      jest.spyOn(urlRepository, 'findBySlug').mockResolvedValue(mockUrl);
      jest.spyOn(trackerRepository, 'getVisitCount').mockImplementation(() => {
        throw new Error('Database error');
      });

      const result = await service.handle(slug, userId);
      expect(result).toBe(0);
      expect(urlRepository.findBySlug).toHaveBeenCalledWith(slug);
      expect(trackerRepository.getVisitCount).toHaveBeenCalledWith(mockUrl.id);
    });
  });
}); 