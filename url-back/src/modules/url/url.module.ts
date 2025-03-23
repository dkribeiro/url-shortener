import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewUrlController } from './use-cases/new/new-url.controller';
import { NewUrlService } from './use-cases/new/new-url.service';
import { UrlRepository } from './db/url.repository';
import { UrlEntity } from './db/url.entity';
import { IdEncoderService } from './utils/id-encoder.service';
import { RedirectController } from './use-cases/redirect/redirect.controller';
import { RedirectService } from './use-cases/redirect/redirect.service';

@Module({
  imports: [TypeOrmModule.forFeature([UrlEntity])],
  controllers: [NewUrlController, RedirectController],
  providers: [NewUrlService, UrlRepository, IdEncoderService, RedirectService],
  exports: [NewUrlService, UrlRepository],
})
export class UrlModule {}