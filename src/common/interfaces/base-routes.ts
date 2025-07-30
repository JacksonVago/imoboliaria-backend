import { Permission } from '@prisma/client';

export interface BaseRoutes {
  [key: string]: {
    name: string;
    route: string;
    permission: Permission;
  };
}
