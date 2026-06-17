import type { Role, UserStatus } from "@prisma/client";

export type AuthUser = {
  id: string;
  role: Role;
  email: string;
  status: UserStatus;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};
