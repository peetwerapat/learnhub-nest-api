import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class SortQuery {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Sort field' })
  sort?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Sort order [asc , desc]' })
  order?: 'asc' | 'desc';
}

/**
 * DTO for pagination query parameters.
 */
export class PaginationQuery extends SortQuery {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false, description: 'Search query' })
  search?: string;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  @ApiProperty({ required: false, description: 'Page number', default: 1 })
  page?: number = 1;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  @ApiProperty({ required: false, description: 'Limit per page', default: 10 })
  limit?: number = 10;
}

/**
 * DTO for paginated response.
 */
export class PaginatedResponse<T> {
  data: T[];

  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
