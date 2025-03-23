import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { IsValidUrl } from '../../decorators/is-valid-url.decorator';

export class NewUrlDto {
  @ApiProperty({
    description: 'The URL to be shortened',
    example: 'https://www.example.com/very-long-url',
  })
  @IsValidUrl()
  url: string;

  @ApiProperty({
    description: 'Custom slug for the shortened URL (optional)',
    example: 'my-custom-slug',
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;
}