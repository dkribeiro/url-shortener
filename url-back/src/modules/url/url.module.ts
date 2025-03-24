import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewUrlController } from './use-cases/new/new-url.controller';
import { NewUrlService } from './use-cases/new/new-url.service';
import { UrlRepository } from './db/url.repository';
import { UrlReadRepository } from './db/url-read.repository';
import { UrlEntity } from './db/url.entity';
import { IdEncoderService } from './utils/id-encoder.service';
import { RedirectController } from './use-cases/redirect/redirect.controller';
import { RedirectService } from './use-cases/redirect/redirect.service';
import { ListUrlsController } from './use-cases/list/list-urls.controller';
import { ListUrlsService } from './use-cases/list/list-urls.service';
import { TrackerModule } from '../tracker/tracker.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UrlEntity]),
    forwardRef(() => TrackerModule),
  ],
  controllers: [NewUrlController, RedirectController, ListUrlsController],
  providers: [
    NewUrlService,
    UrlRepository,
    UrlReadRepository,
    IdEncoderService,
    RedirectService,
    ListUrlsService,
  ],
  exports: [NewUrlService, UrlRepository],
})
export class UrlModule {}
