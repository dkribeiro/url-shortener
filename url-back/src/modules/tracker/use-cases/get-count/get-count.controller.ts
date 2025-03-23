import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetCountService } from './get-count.service';

@ApiTags('Tracker')
@Controller('tracker')
export class GetCountController {
  constructor(private readonly getCountService: GetCountService) {}

  @Get(':slug/count')
  @ApiOperation({ summary: 'Get visit count for a URL' })
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
  async getVisitCount(@Param('slug') slug: string) {
    const count = await this.getCountService.handle(slug);
    return { count };
  }
}