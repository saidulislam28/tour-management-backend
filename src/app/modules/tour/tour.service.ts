/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import AppError from "../../../helpers/CustomError";
import { Query, Types } from "mongoose";
import { Tour, TourType } from "./tour.model";
import { ITour, ITourType } from "./tour.interface";
import { excludeField } from "../../constants";
import { QueryBuilder } from "../../../utils/QueryBuilder";
import { deleteCloudinaryImage } from "../../../configs/cloudinary.config";

const CreateTourType = async (payload: ITourType) => {
  const checkTourType = await TourType.findOne({ name: payload.name });

  if (checkTourType) {
    throw new AppError(httpStatus.BAD_REQUEST, "Already Exist!!!");
  }
  // return;

  const tourType = await TourType.create(payload);

  return tourType;
};
const GetAllTourType = async () => {
  const tourType = await TourType.find();

  return tourType;
};

const UpdateTourType = async (id: string, payload: Partial<ITourType>) => {
  const findTour = await TourType.findOne({ name: payload.name });

  if (findTour) {
    throw new AppError(httpStatus.BAD_REQUEST, "Already exist!!!");
  }

  const tour = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return tour;
};

const DeleteTourType = async (id: string) => {
  const findById = await TourType.findOne({ _id: id });

  if (!findById) {
    throw new AppError(httpStatus.BAD_REQUEST, "Data not found");
  }

  const data = await TourType.findByIdAndDelete(id);
  return {
    delete: true,
  };
};

const CreateTour = async (payload: ITour) => {
  const { title, ...rest } = payload;

  // throw new AppError(httpStatus.BAD_REQUEST, "Slug Already exist ");

  const createSlug = title?.split(" ").join("-").toLocaleLowerCase();

  const checkSlugExisting = await Tour.findOne({ slug: createSlug });
  if (checkSlugExisting) {
    throw new AppError(httpStatus.BAD_REQUEST, "Slug Already exist ");
  }
  const TourData = {
    ...rest,
    title,
    slug: createSlug,
  };


  const tour = await Tour.create(TourData);

  return tour;
};
const GetAllTour = async (query: Record<string, string>) => {
  const search: any = query.search || "";

  console.log("search", search);

  const queryBuilder = new QueryBuilder(Tour.find(), query);

  const tour = await queryBuilder
    .search(search)
    .filter()
    .sort()
    .fields()
    .paginate()
    .build();

  const meta = await queryBuilder.getMeta();

  // const totalTour = await Tour.countDocuments();
  // const totalPage = Math.ceil(totalTour / limit);
  // const meta = {
  //   totalTour,
  //   skip,
  //   limit,
  //   totalPage,
  // };

  return { data: tour, meta };
};

// previous code static code
// const GetAllTour = async (query: any) => {
//   console.log(query);
//   const filter = query;
//   const searchTerm = query.search || "";
//   const sort = query.sort || "-createdAt";
//   const fields = query.fields?.split(",")?.join(" ") || "";
//   const page = Number(query.page) || 1;
//   const limit = Number(query.limit) || 10;
//   const skip = (page - 1) * limit;

//   // Static method
//   // delete filter["search"];
//   // delete filter["sort"];

//   // dynamic method

//   for (const field of excludeField) {
//     // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//     delete filter[field];
//   }

//   const tour = await Tour.find({
//     $or: [
//       { title: { $regex: searchTerm, $options: "i" } },
//       { description: { $regex: searchTerm, $options: "i" } },
//       { location: { $regex: searchTerm, $options: "i" } },
//     ],
//   })
//     .find(filter)
//     .sort(sort)
//     .select(fields)
//     .skip(skip)
//     .limit(limit);

//   const totalTour = await Tour.countDocuments();
//   const totalPage = Math.ceil(totalTour / limit);
//   const meta = {
//     totalTour,
//     skip,
//     limit,
//     totalPage,
//   };

//   return { data: tour, meta };
// };

const UpdateTour = async (id: string, payload: Partial<ITour>) => {
  const { title, ...rest } = payload;


  console.log("payload", payload)

  const findTour = await Tour.findById(id);

  console.log("find tour", findTour)

  if (!findTour) {
    payload.slug = title?.split(" ").join("-").toLocaleLowerCase();
  }

  if (payload.images && payload.images.length > 0 && findTour?.images && findTour.images.length > 0) {
    console.log("hitting 1")
    payload.images = [...payload.images, ...findTour.images]
  }

  if (payload.deleteImages && payload.deleteImages.length > 0 && findTour?.images && findTour.images.length > 0) {
    const restDBImages = findTour.images.filter(img => !payload.deleteImages?.includes(img));

    const updatedPayloadImages = (payload.images || [])
      .filter(img => !payload.deleteImages?.includes(img))
      .filter(img => !restDBImages.includes(img));

    payload.images = [...restDBImages, ...updatedPayloadImages]
  }

  const updatedTour = await Tour.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (payload.deleteImages && payload.deleteImages.length > 0 && findTour?.images && findTour.images.length > 0) {

    await Promise.all(payload.deleteImages.map(url => deleteCloudinaryImage(url)))

  }
  return updatedTour;
};

const DeleteTour = async (id: string) => {
  const findById = await Tour.findOne({ _id: id });

  if (!findById) {
    throw new AppError(httpStatus.BAD_REQUEST, "Data not found");
  }

  const data = await Tour.findByIdAndDelete(id);
  return {
    delete: true,
  };
};

export const tourService = {
  CreateTour,
  GetAllTour,
  UpdateTour,
  DeleteTour,
  CreateTourType,
  GetAllTourType,
  UpdateTourType,
  DeleteTourType,
};
