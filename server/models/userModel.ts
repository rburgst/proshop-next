import mongoose, { Document } from "mongoose";

export interface ICreateUserInput {
  name: IUser["name"];
  email: IUser["email"];
  password: IUser["password"];
  isAdmin?: IUser["isAdmin"];
}
export interface IUser {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}
export interface IUserDoc extends Document, IUser {}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// const User = mongoose.model<IUser>("User", userSchema);
// see https://github.com/vercel/next.js/issues/7328#issuecomment-519546743
export default mongoose.models.User ??
  mongoose.model<IUser>("User", userSchema);
