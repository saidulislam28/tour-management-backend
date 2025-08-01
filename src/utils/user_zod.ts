import z from "zod";
import { Role } from "../app/modules/user/user.interface";

export const createUserZod = z.object({
  name: z.string("must be a string"),
  email: z.string().email({ message: "Email is required" }),
  password: z.string("Password is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
});
export const updateUserZod = z.object({
  name: z.string("must be a string").optional(),
  password: z.string("Password is required").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  isDeleted: z.boolean().optional(), 
  isActive: z.enum(["BLOCKED", "INACTIVE", "ACTIVE"]).optional(),
  isVerified: z.boolean().optional(),
  role: z.enum(Object.values(Role) as [string]),
});
