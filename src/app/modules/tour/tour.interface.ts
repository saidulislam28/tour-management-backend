import { Types } from "mongoose";

export interface ITour {
  title: string;
  slug: string;
  description?: string;
  images?: string[];
  location?: string;
  costFrom?: number;
  departureLocation?: string;
  arrivalLocation?: string;
  startDate?: Date;
  endDate?: Date;
  included?: string[];
  excluded?: string[];
  amenities?: string[];
  tourPlan?: string[];
  maxGuest?: number;
  division: Types.ObjectId;
  tourType: Types.ObjectId;
}

export interface ITourType {
  name: string;
}
