import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    desc: { type: String },
    thumbnail: { type: String },
  },
  {
    timestamps: true,
  }
);


divisionSchema.pre("save", async function(next){

  


  next();
})



export const Division = model<IDivision>("Division", divisionSchema);
