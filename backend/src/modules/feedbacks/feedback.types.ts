import type { FeedbackType } from "@prisma/client";

export type FeedbackListItem = {
  id: string;
  name: string | null;
  email: string | null;
  type: FeedbackType;
  message: string;
  createdAt: Date;
  updatedAt: Date;
};

export type FeedbackPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type FeedbackStats = {
  feedbackCount: number;
  suggestionCount: number;
};
