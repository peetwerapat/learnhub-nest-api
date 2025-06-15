import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadModel } from 'src/common/security/jwt';
import { FindOneUserByIdUseCase } from 'src/domain/user/usecase';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _findOneUserByIdUsecase: FindOneUserByIdUseCase,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: _configService.get('JWT_ACCESS_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayloadModel) {
    if (!payload.id) {
      throw new UnauthorizedException();
    }

    const user = await this._findOneUserByIdUsecase.execute(payload.id);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
