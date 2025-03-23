import {
  Controller,
  Get,
  Param,
  Headers,
  ForbiddenException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiHeader } from '@nestjs/swagger';
import { GetCountService } from './get-count.service';

@ApiTags('Tracker')
@Controller('tracker')
export class GetCountController {
  constructor(private readonly getCountService: GetCountService) {}

  @Get(':slug/count')
  @ApiOperation({ summary: 'Get visit count for a URL' })
  @ApiHeader({
    name: 'user_id',
    description: 'Optional user ID for URL ownership verification',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the visit count for the URL',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          example: 42,
          description: 'The number of visits for the URL',
        },
      },
    },
  })
  async getVisitCount(
    @Param('slug') slug: string,
    @Headers('user_id') userId?: string,
  ) {
    const count = await this.getCountService.handle(slug, userId);
    return { count };
  }
}
