import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiHeader } from '@nestjs/swagger';
import { NewUrlDto } from './new-url.dto';
import { NewUrlService } from './new-url.service';

@ApiTags('URL')
@Controller('url')
export class NewUrlController {
  constructor(private readonly newUrlService: NewUrlService) {}

  @Post('new')
  @ApiOperation({ summary: 'Create a new shortened URL' })
  @ApiHeader({
    name: 'user_id',
    description: 'Optional user ID for URL ownership',
    required: false,
  })
  @ApiResponse({
    status: 201,
    description: 'URL shortened successfully',
    schema: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          example: 'abc123xy',
          description: 'The generated or custom slug for the shortened URL',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid URL format or slug already exists',
  })
  async create(@Body() dto: NewUrlDto, @Headers('user_id') userId?: string) {
    return this.newUrlService.handle(dto, userId);
  }
}
