import { Test, TestingModule } from '@nestjs/testing';
import { RedirectService } from './redirect.service';
import { UrlRepository } from '../../db/url.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UrlEntity } from '../../db/url.entity';

describe('RedirectService', () => {
  let service: RedirectService;
  let urlRepository: UrlRepository;
  let cacheManager: Cache;

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
        RedirectService,
        {
          provide: UrlRepository,
          useValue: {
            findBySlug: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RedirectService>(RedirectService);
    urlRepository = module.get<UrlRepository>(UrlRepository);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  // Test service instantiation
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handle', () => {
    // Test successful cache hit
    it('should return URL from cache when available', async () => {
      const cachedUrl = 'https://example.com';
      jest.spyOn(cacheManager, 'get').mockResolvedValue(cachedUrl);

      const result = await service.handle('example');
      expect(result).toBe(cachedUrl);
      expect(cacheManager.get).toHaveBeenCalledWith('url:example');
      expect(urlRepository.findBySlug).not.toHaveBeenCalled();
    });

    // Test cache miss with database hit
    it('should fetch URL from database when not in cache', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest.spyOn(urlRepository, 'findBySlug').mockResolvedValue(mockUrl);

      const result = await service.handle('example');
      expect(result).toBe(mockUrl.url);
      expect(cacheManager.get).toHaveBeenCalledWith('url:example');
      expect(urlRepository.findBySlug).toHaveBeenCalledWith('example');
      expect(cacheManager.set).toHaveBeenCalledWith('url:example', mockUrl.url);
    });

    // Test when URL is not found
    it('should return null when URL is not found', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest.spyOn(urlRepository, 'findBySlug').mockResolvedValue(null);

      const result = await service.handle('nonexistent');
      expect(result).toBeNull();
      expect(cacheManager.get).toHaveBeenCalledWith('url:nonexistent');
      expect(urlRepository.findBySlug).toHaveBeenCalledWith('nonexistent');
      expect(cacheManager.set).not.toHaveBeenCalled();
    });
  });
}); 