import { Role, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt";
import type { AuthUser } from "./auth.types";
import type { LoginInput, RefreshTokenInput, RegisterTenantInput } from "./auth.validation";

// TEMP MVP STORAGE: replace with a DB-backed session store before scaling beyond single-process deployment.
const refreshTokenStore = new Map<string, AuthUser>();

const toAuthUser = (user: {
  id: string;
  role: Role;
  email: string;
  status: UserStatus;
}): AuthUser => ({
  id: user.id,
  role: user.role,
  email: user.email,
  status: user.status
});

const createTokens = (user: AuthUser) => {
  const payload = {
    id: user.id,
    role: user.role,
    email: user.email
  };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  refreshTokenStore.set(refreshToken, user);

  return {
    accessToken,
    refreshToken
  };
};

export class AuthService {
  async registerTenant(input: RegisterTenantInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email }
    });

    if (existingUser) {
      throw new AppError("Email is already registered.", 409);
    }

    const password = await bcrypt.hash(input.password, 12);

    const user = await prisma.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phoneNumber: input.phoneNumber,
        password,
        role: Role.TENANT,
        status: UserStatus.PENDING,
        building: input.building,
        floor: input.floor,
        unitNumber: input.unitNumber
      },
      select: {
        id: true,
        role: true,
        email: true,
        status: true
      }
    });

    return toAuthUser(user);
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: {
        staffProfile: {
          select: {
            id: true
          }
        }
      }
    });

    if (!user) {
      throw new AppError("Invalid email or password.", 401);
    }

    const passwordMatches = await bcrypt.compare(input.password, user.password);

    if (!passwordMatches) {
      throw new AppError("Invalid email or password.", 401);
    }

    if (user.role !== Role.ADMIN && user.status !== UserStatus.APPROVED) {
      throw new AppError("Account is not approved for login.", 403);
    }

    if (user.role === Role.STAFF && !user.staffProfile) {
      throw new AppError("Staff account is not linked to a staff profile.", 403);
    }

    const authUser = toAuthUser(user);
    const tokens = createTokens(authUser);

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    return {
      ...tokens,
      user: authUser
    };
  }

  async refreshToken(input: RefreshTokenInput) {
    const storedUser = refreshTokenStore.get(input.refreshToken);

    if (!storedUser) {
      throw new AppError("Invalid refresh token.", 401);
    }

    try {
      const payload = verifyRefreshToken(input.refreshToken);

      if (payload.id !== storedUser.id) {
        throw new AppError("Invalid refresh token.", 401);
      }
    } catch {
      refreshTokenStore.delete(input.refreshToken);
      throw new AppError("Invalid or expired refresh token.", 401);
    }

    const accessToken = generateAccessToken({
      id: storedUser.id,
      role: storedUser.role,
      email: storedUser.email
    });

    return {
      accessToken,
      user: storedUser
    };
  }

  async logout(input: RefreshTokenInput) {
    refreshTokenStore.delete(input.refreshToken);
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        email: true,
        status: true
      }
    });

    if (!user) {
      throw new AppError("Authenticated user was not found.", 404);
    }

    return toAuthUser(user);
  }
}

export const authService = new AuthService();
