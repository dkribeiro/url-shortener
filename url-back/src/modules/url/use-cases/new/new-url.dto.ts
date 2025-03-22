import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class NewUrlDto {
  @ApiProperty({
    description: 'The URL to be shortened',
    example: 'https://www.example.com/very-long-url',
  })
  @IsUrl({}, { message: 'Invalid URL format' })
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