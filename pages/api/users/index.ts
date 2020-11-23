// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../server/config/db";
import User, { IUser } from "../../../server/models/userModel";
import withMiddleware from "../../../server/middlewares/index";
import { IUserDoc, ICreateUserInput } from "../../../server/models/userModel";
import { generateToken } from "../../../server/utils/generateToken";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.info("register user");
  if (req.method === "POST") {
    const { name, email, password } = req.body;
    const mongoose = await connectDB();
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
  } else {
    // Handle any other HTTP method
    res.statusCode = 400;
    throw new Error("wrong http method");
  }
};

export default withMiddleware(handler);
