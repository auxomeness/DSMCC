import { ConcernVisibility, Role } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/appError";

// MVP uses relational vote counts. Add a denormalized counter only if public concern traffic requires it.

type VoteUser = {
  id: string;
  role: Role;
};

export class ConcernVoteService {
  async toggleVote(user: VoteUser, concernId: string) {
    if (user.role !== Role.TENANT) {
      throw new AppError("Only tenants can vote on concerns.", 403);
    }

    const concern = await prisma.concern.findUnique({
      where: { id: concernId },
      select: {
        id: true,
        visibility: true
      }
    });

    if (!concern) {
      throw new AppError("Concern was not found.", 404);
    }

    if (concern.visibility !== ConcernVisibility.PUBLIC) {
      throw new AppError("Only public concerns can receive votes.", 400);
    }

    const existingVote = await prisma.concernVote.findUnique({
      where: {
        concernId_tenantId: {
          concernId,
          tenantId: user.id
        }
      }
    });

    if (existingVote) {
      await prisma.concernVote.delete({
        where: { id: existingVote.id }
      });

      return {
        voted: false,
        voteCount: await this.getVoteCount(concernId)
      };
    }

    await prisma.concernVote.create({
      data: {
        concernId,
        tenantId: user.id
      }
    });

    return {
      voted: true,
      voteCount: await this.getVoteCount(concernId)
    };
  }

  async getVoteCount(concernId: string) {
    return prisma.concernVote.count({
      where: { concernId }
    });
  }
}

export const concernVoteService = new ConcernVoteService();
