import { Types } from "mongoose";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  GUIDE = "GUIDE",
}

export interface IAuthProvider {
  provider: "google"| "credentials"; // Google, "credential"
  providerId: string;
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: boolean;
  isActive?: IsActive;
  isVerified?: boolean;
  auths: IAuthProvider[];
  role: Role;
  bookings?: Types.ObjectId[];
  guides?: Types.ObjectId[];
}
