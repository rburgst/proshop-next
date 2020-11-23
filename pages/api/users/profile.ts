// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../server/config/db";
import User from "../../../server/models/userModel";
import withMiddleware from "../../../server/middlewares/index";
import { IUserDoc } from "../../../server/models/userModel";
import { generateToken } from "../../../server/utils/generateToken";
import {
  protect,
  NextApiRequestWithUser,
} from "../../../server/middlewares/authMiddleware";

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  console.info("get user profile");
  if (req.method === "GET") {
    const mongoose = await connectDB();
    const user: IUserDoc = await User.findById(req.user!._id);

    if (user) {
      res.statusCode = 200;
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      // Handle any other HTTP method
      res.statusCode = 404;
      throw new Error("user not found");
    }
  } else {
    // Handle any other HTTP method
    res.statusCode = 400;
    throw new Error("wrong http method");
  }
};

export default withMiddleware(handler, protect);
