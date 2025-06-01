import { z } from "zod";

export const createUserSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    password: z.string().min(6),
    mobile: z.string().optional(),
    DOB: z.string().optional(),
});

export const loginSchema = z.object({
    firstName: z.string().min(1),
    password: z.string().min(6),
});
