import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!parsed.success) {
      next(parsed.error);
      return;
    }

    req.body = parsed.data.body;
    req.params = parsed.data.params;
    req.query = parsed.data.query;
    next();
  };
