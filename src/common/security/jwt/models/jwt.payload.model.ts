import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class JwtPayloadModel {
  @ApiProperty()
  @Type(() => Number)
  id?: number;

  @ApiProperty()
  @Type(() => String)
  role?: string;

  static fromRefreshTokenPayload(payload: Partial<JwtPayloadModel>): JwtPayloadModel {
    const newPayload = new JwtPayloadModel();

    newPayload.id = payload.id;
    newPayload.role = payload.role;

    return newPayload;
  }
}
