import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuardName } from 'src/domain/auth/constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard(JwtAuthGuardName) {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('JWT Token:', request.headers.authorization);
    return super.canActivate(context);
  }
}
