// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import connectDB from "../../../server/config/db";
import { isAdmin, protect } from "../../../server/middlewares/authMiddleware";
import { onError } from "../../../server/middlewares/index";
import User, {
  IUserWithId,
  IUserWithToken,
} from "../../../server/models/userModel";
import { generateToken } from "../../../server/utils/generateToken";

async function registerUser(
  req: NextApiRequest,
  res: NextApiResponse<IUserWithToken>
): Promise<void> {
  const { name, email, password } = req.body;
  await connectDB();
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.statusCode = 400;
    throw new Error("user already exists");
  }

  const user = await User.create({ name, email, password, isAdmin: false });
  if (user) {
    res.statusCode = 200;
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.statusCode = 400;
    throw new Error("invalid user data");
  }
}

async function getAllUsers(
  req: NextApiRequest,
  res: NextApiResponse<IUserWithId[]>
): Promise<void> {
  await connectDB();
  const users = await User.find().select("-password");
  res.json(users);
}

const handler = nc({ onError: onError })
  .post(registerUser)
  .get(protect, isAdmin, getAllUsers);

export default handler;
