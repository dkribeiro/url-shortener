import { Controller, Get, NotFoundException, Param, Req, Res, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';
import { RedirectService } from './redirect.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { TrackVisitService } from '../../../tracker/use-cases/track-visit/track-visit.service';

@Controller('')
export class RedirectController {
  constructor(
    private redirectService: RedirectService,
    private trackVisitService: TrackVisitService
  ) {}

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60000)
  @Get(':slug')
  async redirect(@Param('slug') slug: string, @Req() req: Request, @Res() res: Response) {
    const result = await this.redirectService.handle(slug);
    if (!result) {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>404 - Not Found</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
              h1 { font-size: 36px; color: #333; }
              p { font-size: 18px; color: #666; }
            </style>
          </head>
          <body>
            <h1>404 - Not Found</h1>
            <p>The requested URL was not found on this server.</p>
          </body>
        </html>
      `;
      res.status(404).header('Content-Type', 'text/html').send(html);
      return;
    }
    // Track the visit asynchronously (don't await to avoid delaying the redirect)
    this.trackVisitService.handle(slug, {
      user_agent: req.headers['user-agent'],
      referrer: req?.headers?.referer || req?.headers?.referrer?.toString(),
      ip: req.ip || req.socket.remoteAddress,
      location: req.headers['x-forwarded-for']?.toString() || req?.socket?.remoteAddress,
    });
    
    return res.redirect(result);
}
}