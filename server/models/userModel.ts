import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

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

  matchPassword(givenPassword: string): Promise<boolean>;
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

userSchema.methods.matchPassword = async function (
  givenPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, this.password);
};

userSchema.pre<IUserDoc>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  } else {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  }
});

// const User = mongoose.model<IUser>("User", userSchema);
// see https://github.com/vercel/next.js/issues/7328#issuecomment-519546743
const User: Model<IUserDoc> =
  mongoose.models.User ?? mongoose.model<IUserDoc>("User", userSchema);
export default User;
