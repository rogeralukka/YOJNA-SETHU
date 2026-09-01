import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../utils/errors';

export function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = parsed.body || req.body;
      req.query = parsed.query || req.query;
      req.params = parsed.params || req.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issue = error.issues[0];
        const fieldName = issue.path.slice(1).join('.');
        const message = fieldName ? `${fieldName}: ${issue.message}` : issue.message;
        return next(new ValidationError(message, error.issues));
      }
      next(error);
    }
  };
}
