import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class OEmbedErrorDto {
  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiProperty()
  @IsString()
  error: string;
}
