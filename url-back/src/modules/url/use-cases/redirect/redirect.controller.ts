import { Controller, Get, NotFoundException, Param, Res, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { RedirectService } from './redirect.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('')
export class RedirectController {
  constructor(private redirectService: RedirectService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60000)
  @Get(':slug')
  async redirect(@Param('slug') slug: string, @Res() res: Response) {
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
    return res.redirect(result);
}
}