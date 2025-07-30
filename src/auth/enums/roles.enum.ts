import { UserRole } from '@prisma/client';

export enum AdditionalRole {
  PUBLIC = 'PUBLIC',
}

type Role = UserRole | AdditionalRole;

const Role = {
  ...UserRole,
  ...AdditionalRole,
};

export { Role };
