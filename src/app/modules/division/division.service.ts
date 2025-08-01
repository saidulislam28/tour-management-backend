/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import AppError from "../../../helpers/CustomError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import { Types } from "mongoose";

const CreateDivision = async (payload: IDivision) => {
  const { name, ...rest } = payload;

  const createSlug = name?.split(" ").join("-").toLocaleLowerCase();

  const checkSlugExisting = await Division.findOne({ slug: createSlug });
  if (checkSlugExisting) {
    throw new AppError(httpStatus.BAD_REQUEST, "Slug Already exist ");
  }
  const divisionData = {
    ...rest,
    name,
    slug: createSlug,
  };

  const division = await Division.create(divisionData);

  return division;
};
const GetAllDivision = async () => {
  const division = await Division.find();

  return division;
};
const GetSingleDivision = async (slug: string) => {
  const division = await Division.findOne({ slug });

  return division;
};

const UpdateDivision = async (id: string, payload: Partial<IDivision>) => {
  const { name, ...rest } = payload;

  const findDivision = await Division.findOne({ name: payload.name });

  if (!findDivision) {
    payload.slug = name?.split(" ").join("-").toLocaleLowerCase();
  }

  const division = await Division.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return division;
};

const DeleteDivision = async (id: string) => {
  const findById = await Division.findOne({ _id: id });

  if (!findById) {
    throw new AppError(httpStatus.BAD_REQUEST, "Data not found");
  }

  const data = await Division.findByIdAndDelete(id);
  return {
    delete: true,
  };
};

export const divisionService = {
  CreateDivision,
  GetAllDivision,
  UpdateDivision,
  DeleteDivision,
  GetSingleDivision,
};
