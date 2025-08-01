import { Query } from "mongoose";
import { excludeField } from "../app/constants";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  filter(): any {
    const filter = { ...this.query };
    for (const field of excludeField) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete filter[field];
    }
    this.modelQuery = this.modelQuery.find(filter);

    return this;
  }

  search(searchAbleField: string): this {
    // const searchTerm = this.query.search || "";
    const searchQuery = {
      $or: [
        { title: { $regex: searchAbleField, $options: "i" } },
        { description: { $regex: searchAbleField, $options: "i" } },
        { location: { $regex: searchAbleField, $options: "i" } },
      ],
    };

    this.modelQuery = this.modelQuery.find(searchQuery);

    return this;
  }

  sort(): this {
    const sort = this.query.sort || "-createdAt";

    this.modelQuery = this.modelQuery.sort(sort);

    return this;
  }
  fields(): this {
    const fields = this.query.fields?.split(",")?.join(" ") || "";

    this.modelQuery = this.modelQuery.select(fields);

    return this;
  }
  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  build(): any {
    return this.modelQuery;
  }

  async getMeta() {
    const totalDocs = await this.modelQuery.model.countDocuments();

    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    const totalPage = Math.ceil(totalDocs / limit);

    return {
      page,
      limit,
      total: totalDocs,
      totalPage,
    };
  }
}
