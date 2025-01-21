import { RequestHandler } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validate =
  (schema: AnyZodObject): RequestHandler =>
  async (req, res, next) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errorObject = error.errors.reduce((acc, err) => {
          const field = err.path.join("."); // Join path for nested fields
          acc[field] = err.message;
          return acc;
        }, {} as Record<string, string>);

        return res.status(400).json(errorObject);
      }
      next(error);
    }
  };
