import { PrismaService } from '@/prisma/prisma.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Permission } from '@prisma/client';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/roles.enum';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prismaService: PrismaService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) || [Role.COLLABORATOR];

    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Verify if is a public route
    if (requiredRoles.includes(Role.PUBLIC)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // Verify if user is authenticated
    const canActivateResult = await super.canActivate(context);

    if (!canActivateResult) {
      return false;
    }

    const user = request.user;

    if (!user || !user.role) {
      return false;
    }

    //If user has the ADMIN role, it can access any route
    if (user.role === Role.ADMIN) {
      return true;
    }

    // Veify if user has required role
    const hasRequiredRole = requiredRoles.some(
      (requiredRole) => user.role === requiredRole,
    );

    // verify permissions (we need to get the user permissions from the database)
    const userData = await this.getUserWithPermissions(user.id);
    const userPermissions = userData?.permissions || [];
    //verify if the user has 'ALL' permission
    if (userPermissions.includes(Permission.ALL)) {
      return true;
    }

    // Verify if the route needs permissions and  Verify if user has the required permissions, base on route and
    const hasRequiredPermissions = requiredPermissions
      ? requiredPermissions?.every((permission) =>
        userPermissions?.includes(permission),
      )
      : true;

    return hasRequiredRole && hasRequiredPermissions;
  }

  async getUserWithPermissions(userId: string) {
    return this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }
}
