import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateContentDto {
  @ApiProperty()
  @IsString()
  videoUrl: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comment: string;

  @ApiProperty()
  @IsNumber()
  rating: number;

  @IsOptional()
  userId?: number;
}
