import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "@/models/user.modal";
import { ENV } from "@/config/env";
import { ROLES } from "@/utils/constants";
import i18n from "@/i18n/en";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: i18n.FAIL_AUTH_EMPTY });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: i18n.FAIL_AUTH_INVALID });
  }
};

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: i18n.FAIL_AUTH_EMPTY });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, ENV.JWT_SECRET!) as { id: string };

    const user = await User.findOne({ id: payload.id, tokens: token });
    if (!user) {
      res.status(401).json({ error: i18n.FAIL_AUTH_INVALID });
      return;
    }

    (req as any).user = user;
    (req as any).token = token;

    next();
  } catch (error) {
    res.status(401).json({ error: i18n.FAIL_AUTH, details: error });
  }
};

export const roleAuth = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req?.headers?.authorization || "";
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: i18n.FAIL_AUTH_EMPTY });
      return;
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, ENV.JWT_SECRET!) as { role?: string };
    const isPublic = Boolean(payload?.role === ROLES.PUBLIC);
    if (!isPublic && !roles.includes(payload?.role || "")) {
      res.status(403).json({ error: i18n.FAIL_ROLE });
      return;
    }

    next();
  };
};
