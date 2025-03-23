import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { GetVisitsService } from './get-visits.service';

@ApiTags('Tracker')
@Controller('tracker')
export class GetVisitsController {
  constructor(private readonly getVisitsService: GetVisitsService) {}

  @Get(':slug/visits')
  @ApiOperation({ summary: 'Get visit details for a URL' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiResponse({
    status: 200,
    description: 'Returns the visit details for the URL',
    schema: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              user_agent: { type: 'string', nullable: true },
              referrer: { type: 'string', nullable: true },
              ip: { type: 'string', nullable: true },
              location: { type: 'string', nullable: true },
              created_at: { type: 'string', format: 'date-time' },
            },
          },
        },
        total: { type: 'number' },
      },
    },
  })
  async getVisits(
    @Param('slug') slug: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.getVisitsService.handle(slug, page, limit);
  }
}