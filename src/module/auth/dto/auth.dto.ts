import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({ example: 'johndoe@mail.com' })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;
}
