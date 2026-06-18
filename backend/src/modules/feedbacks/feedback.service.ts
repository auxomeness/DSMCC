import { FeedbackType, Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { getPagination } from "../../utils/pagination";
import type { CreateFeedbackInput, ListFeedbacksQuery } from "./feedback.validation";

const feedbackSelect = {
  id: true,
  name: true,
  email: true,
  type: true,
  message: true,
  createdAt: true,
  updatedAt: true
};

export class FeedbackService {
  async createFeedback(input: CreateFeedbackInput) {
    return prisma.feedback.create({
      data: {
        name: input.name || null,
        email: input.email || null,
        type: input.type,
        message: input.message
      },
      select: feedbackSelect
    });
  }

  async listFeedbacks(query: ListFeedbacksQuery) {
    const pagination = getPagination({
      page: query.page,
      limit: query.limit ?? 20
    });

    const where: Prisma.FeedbackWhereInput = {
      deletedAt: null,
      ...(query.type ? { type: query.type } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: Prisma.QueryMode.insensitive } },
              { email: { contains: query.search, mode: Prisma.QueryMode.insensitive } },
              { message: { contains: query.search, mode: Prisma.QueryMode.insensitive } }
            ]
          }
        : {})
    };

    const [feedbacks, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.take,
        select: feedbackSelect
      }),
      prisma.feedback.count({ where })
    ]);

    return {
      feedbacks,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit)
      }
    };
  }

  async getFeedbackById(id: string) {
    const feedback = await prisma.feedback.findFirst({
      where: {
        id,
        deletedAt: null
      },
      select: feedbackSelect
    });

    if (!feedback) {
      throw new AppError("Feedback was not found.", 404);
    }

    return feedback;
  }

  async deleteFeedback(id: string) {
    const result = await prisma.feedback.updateMany({
      where: {
        id,
        deletedAt: null
      },
      data: { deletedAt: new Date() }
    });

    if (result.count === 0) {
      throw new AppError("Feedback was not found.", 404);
    }
  }

  async getFeedbackStats() {
    const [feedbackCount, suggestionCount] = await Promise.all([
      prisma.feedback.count({
        where: {
          type: FeedbackType.FEEDBACK,
          deletedAt: null
        }
      }),
      prisma.feedback.count({
        where: {
          type: FeedbackType.SUGGESTION,
          deletedAt: null
        }
      })
    ]);

    return {
      feedbackCount,
      suggestionCount
    };
  }
}

export const feedbackService = new FeedbackService();
