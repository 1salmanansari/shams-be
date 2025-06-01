import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as UserService from "@/services/user.service";
import { ENV } from "@/config/env";
import i18n from "@/i18n/en";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await UserService.createUser({ ...req.body, password: hashedPassword });
    res.status(201).json({ message: i18n.PASS_USER_POST, user });
  } catch (error) {
    res.status(500).json({ error: i18n.FAIL_USER_POST, details: error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const user = await UserService.auth(req.body.email);
    if (!user) return res.status(404).json({ error: i18n.FAIL_USER_EMPTY });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(401).json({ error: i18n.FAIL_AUTH_INVALID });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, ENV.JWT_SECRET!, { expiresIn: "1d" });

    // Invalidate old tokens (logout from previous devices)
    user.tokens = [token];
    user.lastLogin = Date.now();
    await user.save();

    res.json({
      message: i18n.PASS_LOGIN,
      token: `Bearer ${token}`
    });
  } catch (error) {
    res.status(500).json({ error: i18n.FAIL_USER_LOGIN, details: error });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: i18n.FAIL_AUTH_EMPTY });

    const payload = jwt.verify(token, ENV.JWT_SECRET!);

    if (!payload || typeof payload !== "object" || !("id" in payload)) {
      return res.status(401).json({ error: i18n.FAIL_AUTH_INVALID });
    }

    const userId = (payload as JwtPayload).id;
    const user = await UserService.authFromToken(userId, token);
    if (!user) return res.status(401).json({ error: i18n.FAIL_AUTH_INVALID });

    user.tokens = user.tokens.filter(t => t !== token);
    await user.save();

    res.json({ message: i18n.PASS_LOGOUT });
  } catch (error) {
    res.status(500).json({ error: i18n.FAIL_USER_LOGOUT, details: error });
  }
};


export const getUsers = async (_req: Request, res: Response) => {
  const users = await UserService.getAllUsers();
  res.json(users);
};

export const getUser = async (req: Request, res: Response) => {
  const user = await UserService.getUserById(req.params.id);
  user ? res.json(user) : res.status(404).json({ error: i18n.FAIL_USER_EMPTY });
};

export const updateUser = async (req: Request, res: Response) => {
  const user = await UserService.updateUser(req.params.id, req.body);
  user ? res.json(user) : res.status(404).json({ error: i18n.FAIL_USER_EMPTY });
};

export const deleteUser = async (req: Request, res: Response) => {
  const user = await UserService.deleteUser(req.params.id);
  user ? res.json({ message: i18n.PASS_USER_REMOVE }) : res.status(404).json({ error: i18n.FAIL_USER_EMPTY });
};
