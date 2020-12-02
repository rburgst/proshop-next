import { NextApiResponse } from "next";
import nc from "next-connect";
import connectDB from "../../../server/config/db";
import { onError } from "../../../server/middlewares";
import {
  isAdmin,
  NextApiRequestWithUser,
  protect,
} from "../../../server/middlewares/authMiddleware";
import User, { IUserWithId } from "../../../server/models/userModel";
import { IUserDoc } from "../../../server/models/userModel";

async function deleteUser(
  req: NextApiRequestWithUser,
  res: NextApiResponse<unknown>
): Promise<void> {
  await connectDB();
  const userId = req.query.id;
  const user = await User.findById(userId);
  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.statusCode = 404;
    throw new Error("User not found");
  }
}

async function getUserById(
  req: NextApiRequestWithUser,
  res: NextApiResponse<IUserDoc>
): Promise<void> {
  await connectDB();
  const userId = req.query.id;
  const user = await User.findById(userId).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.statusCode = 404;
    throw new Error("User not found");
  }
}

async function updateUser(
  req: NextApiRequestWithUser,
  res: NextApiResponse<IUserWithId>
): Promise<void> {
  const userId = req.query.id;
  console.info("update user", userId);

  const { name, email, isAdmin } = req.body;
  await connectDB();

  const user = await User.findById(userId);

  if (!user) {
    res.statusCode = 404;
    throw new Error("user not found");
  }

  if (email && user.email !== email) {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.statusCode = 400;
      throw new Error("this email already exists");
    }
  }

  user.email = email ?? user.email;
  user.name = name ?? user.name;
  if (isAdmin !== undefined) {
    user.isAdmin = isAdmin;
  }

  const updatedUser = await user.save();
  if (updatedUser) {
    res.statusCode = 200;
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.statusCode = 400;
    throw new Error("invalid user data");
  }
}
const handler = nc({ onError: onError })
  .get(protect, isAdmin, getUserById)
  .delete(protect, isAdmin, deleteUser)
  .put(protect, isAdmin, updateUser);
export default handler;
