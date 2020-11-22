// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../server/config/db";
import User from "../../../server/models/userModel";
import withMiddleware from "../../../server/middlewares/index";
import { IUserDoc } from "../../../server/models/userModel";
import { generateToken } from "../../../server/utils/generateToken";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.info("login user");
  if (req.method === "POST") {
    const { email, password } = req.body;
    const mongoose = await connectDB();
    const user: IUserDoc = await User.findOne({ email });

    if (user) {
      const matchesPassword = await user.matchPassword(password);
      if (matchesPassword) {
        res.statusCode = 200;
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id),
        });
      }
      return;
    }

    res.statusCode = 401;
    throw new Error("invalid email or password");
  } else {
    // Handle any other HTTP method
    res.statusCode = 400;
    throw new Error("wrong http method");
  }
};

export default withMiddleware(handler);
