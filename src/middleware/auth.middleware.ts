import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "@/models/user.modal";
import { ENV } from "@/config/env";

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
    res.status(401).json({ error: "Unauthorized - No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, ENV.JWT_SECRET!) as { id: string };

    const user = await User.findOne({ id: payload.id, tokens: token });
    if (!user) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    (req as any).user = user;
    (req as any).token = token;

    next();
  } catch (error) {
    res.status(401).json({ error: "Token verification failed", details: error });
  }
};
