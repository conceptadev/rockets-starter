import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AccessControlService } from '@concepta/nestjs-access-control/dist/services/access-control.service';
import { UserEntity } from '../entities/user.entity';

export class ACService implements AccessControlService {
  async getUser<T>(context: ExecutionContext): Promise<T> {
    const request = context.switchToHttp().getRequest();
    return request.user as T;
  }
  async getUserRoles(context: ExecutionContext): Promise<string | string[]> {
    const user = await this.getUser<UserEntity>(context);
    if (!user || !user.userRoles) throw new UnauthorizedException();
    return user.userRoles.map((userRole) => userRole.role.name);
  }
}
