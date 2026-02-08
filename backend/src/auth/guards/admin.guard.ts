import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class AdminGuard extends JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    const validatedUser = super.handleRequest(err, user, info);

    if (validatedUser.role !== 'admin') {
      throw new ForbiddenException('Yêu cầu quyền quản trị viên');
    }

    return validatedUser;
  }
}
