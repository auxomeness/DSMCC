import type { Role, UserStatus } from "@prisma/client";

export type UserListItem = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  role: Role;
  status: UserStatus;
  building: string | null;
  floor: string | null;
  unitNumber: string | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UserPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
