import { IUser, ICreateUserInput } from "../../../server/models/userModel";
import bcrypt from "bcryptjs";

const users: ICreateUserInput[] = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "123456",
    isAdmin: true,
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "123456",
  },
  {
    name: "Jane Doe",
    email: "jane@example.com",
    password: "123456",
  },
];

export default users;
