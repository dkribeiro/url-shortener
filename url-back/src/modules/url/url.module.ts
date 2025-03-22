import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewUrlController } from './use-cases/new/new-url.controller';
import { NewUrlService } from './use-cases/new/new-url.service';
import { UrlRepository } from './db/url.repository';
import { UrlEntity } from './db/url.entity';
import { IdEncoderService } from './utils/id-encoder.service';

@Module({
  imports: [TypeOrmModule.forFeature([UrlEntity])],
  controllers: [NewUrlController],
  providers: [NewUrlService, UrlRepository, IdEncoderService],
  exports: [NewUrlService, UrlRepository],
})
export class UrlModule {}