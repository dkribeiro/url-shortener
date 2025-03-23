import {
  Controller,
  Get,
  Query,
  Headers,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiHeader,
} from '@nestjs/swagger';
import { ListUrlsService } from './list-urls.service';

@ApiTags('URL')
@Controller('url')
export class ListUrlsController {
  constructor(private readonly listUrlsService: ListUrlsService) {}

  @Get('list')
  @ApiOperation({ summary: 'Get paginated list of URLs for the logged user' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiHeader({
    name: 'user_id',
    description: 'User ID for URL ownership',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the paginated list of URLs for the user',
    schema: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              url: { type: 'string' },
              slug: { type: 'string' },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' },
            },
          },
        },
        total: { type: 'number' },
      },
    },
  })
  async getUrlsList(
    @Headers('user_id') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    if (!userId) {
      throw new ForbiddenException('User ID is required');
    }

    return this.listUrlsService.handle(userId, page, limit);
  }
}
