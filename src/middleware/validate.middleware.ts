import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import i18n from "../i18n/en";

export const validate = (schema: ZodSchema<any>) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            error: i18n.FAIL_VALIDATION,
            details: result.error.errors,
        });
    }

    next();
};
