import { UserRole } from './user.role';

export interface SimplyUserEntity {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface NewUserEntity {
  id?: string;
  name: string;
  email: string;
  password?: string;
  currentTokenId?: string | null;
  role?: UserRole;
}

export type UserId = {
  id: string;
}