import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user.adminId) {
      throw new ForbiddenException(
        'You are not authorized to access this api.',
      );
    }

    return true;
  }
}

@Injectable()
export class AdvertiseGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user.adminId && !user.advertiserId && !user.member_idx) {
      throw new ForbiddenException(
        'You are not authorized to access this api.',
      );
    }

    return true;
  }
}
