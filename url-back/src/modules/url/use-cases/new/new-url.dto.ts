import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';
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
    example: 'myslug',
    required: false,
    maxLength: 10,
  })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Slug must contain only alphanumeric characters',
  })
  slug?: string;
}
