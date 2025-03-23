import { Test, TestingModule } from '@nestjs/testing';
import { NewUrlService } from './new-url.service';
import { UrlRepository } from '../../db/url.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { NewUrlDto } from './new-url.dto';
import { BadRequestException } from '@nestjs/common';
import { UrlEntity } from '../../db/url.entity';

describe('NewUrlService', () => {
  let service: NewUrlService;
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
        NewUrlService,
        {
          provide: UrlRepository,
          useValue: {
            findBySlug: jest.fn(),
            save: jest.fn(),
            saveAndGenerateSlug: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NewUrlService>(NewUrlService);
    urlRepository = module.get<UrlRepository>(UrlRepository);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  // Test service instantiation
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handle', () => {
    // Test successful creation with custom slug
    it('should create URL with custom slug', async () => {
      const dto: NewUrlDto = {
        url: 'https://example.com',
        slug: 'custom-slug',
      };
      const userId = 'user123';

      jest.spyOn(urlRepository, 'findBySlug').mockResolvedValue(null);
      jest.spyOn(urlRepository, 'save').mockResolvedValue(mockUrl);

      const result = await service.handle(dto, userId);
      expect(result).toEqual({ slug: dto.slug });
      expect(urlRepository.findBySlug).toHaveBeenCalledWith(dto.slug);
      expect(urlRepository.save).toHaveBeenCalledWith({
        url: dto.url,
        slug: dto.slug,
        user_id: userId,
      });
      expect(cacheManager.set).toHaveBeenCalledWith(`url:${dto.slug}`, mockUrl.url);
    });

    // Test creation with auto-generated slug
    it('should create URL with auto-generated slug', async () => {
      const dto: NewUrlDto = {
        url: 'https://example.com',
      };
      const userId = 'user123';
      const generatedSlug = 'abc123';

      jest.spyOn(urlRepository, 'saveAndGenerateSlug').mockResolvedValue(generatedSlug);

      const result = await service.handle(dto, userId);
      expect(result).toEqual({ slug: generatedSlug });
      expect(urlRepository.saveAndGenerateSlug).toHaveBeenCalledWith(dto.url, userId);
    });

    // Test creation without user ID
    it('should create URL without user ID', async () => {
      const dto: NewUrlDto = {
        url: 'https://example.com',
        slug: 'custom-slug',
      };

      jest.spyOn(urlRepository, 'findBySlug').mockResolvedValue(null);
      jest.spyOn(urlRepository, 'save').mockResolvedValue(mockUrl);

      const result = await service.handle(dto);
      expect(result).toEqual({ slug: dto.slug });
      expect(urlRepository.save).toHaveBeenCalledWith({
        url: dto.url,
        slug: dto.slug,
        user_id: null,
      });
    });

    // Test duplicate slug error
    it('should throw BadRequestException when slug already exists', async () => {
      const dto: NewUrlDto = {
        url: 'https://example.com',
        slug: 'existing-slug',
      };

      jest.spyOn(urlRepository, 'findBySlug').mockResolvedValue(mockUrl);

      await expect(service.handle(dto)).rejects.toThrow(BadRequestException);
      expect(urlRepository.findBySlug).toHaveBeenCalledWith(dto.slug);
      expect(urlRepository.save).not.toHaveBeenCalled();
      expect(cacheManager.set).not.toHaveBeenCalled();
    });
  });
}); 