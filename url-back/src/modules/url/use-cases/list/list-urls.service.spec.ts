import { Test, TestingModule } from '@nestjs/testing';
import { ListUrlsService } from './list-urls.service';
import { UrlReadRepository } from '../../db/url-read.repository';
import { UrlEntity } from '../../db/url.entity';

describe('ListUrlsService', () => {
  let service: ListUrlsService;
  let urlReadRepository: UrlReadRepository;

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
        ListUrlsService,
        {
          provide: UrlReadRepository,
          useValue: {
            findByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ListUrlsService>(ListUrlsService);
    urlReadRepository = module.get<UrlReadRepository>(UrlReadRepository);
  });

  // Test service instantiation
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handle', () => {
    // Test successful retrieval of user's URLs
    it('should return paginated URLs for user', async () => {
      const mockUrls = [mockUrl];
      const mockCount = 1;
      const page = 1;
      const limit = 10;
      const userId = 'user123';

      jest.spyOn(urlReadRepository, 'findByUserId').mockResolvedValue({
        items: mockUrls,
        total: mockCount,
      });

      const result = await service.handle(userId, page, limit);
      expect(result).toEqual({
        items: mockUrls,
        total: mockCount,
      });
      expect(urlReadRepository.findByUserId).toHaveBeenCalledWith(userId, page, limit);
    });

    // Test empty result for non-existent user
    it('should return empty array for user with no URLs', async () => {
      jest.spyOn(urlReadRepository, 'findByUserId').mockResolvedValue({
        items: [],
        total: 0,
      });

      const result = await service.handle('nonexistent', 1, 10);
      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    // Test error handling
    it('should throw error when repository fails', async () => {
      const error = new Error('Database error');
      jest.spyOn(urlReadRepository, 'findByUserId').mockRejectedValue(error);

      await expect(service.handle('user123', 1, 10)).rejects.toThrow(error);
    });
  });
}); 