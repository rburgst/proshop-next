import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { MiddlewareFunction } from ".";
import User from "../models/userModel";
import { IUserDoc } from "../models/userModel";

export interface NextApiRequestWithUser extends NextApiRequest {
  user?: IUserDoc;
}

export const protect: MiddlewareFunction<NextApiRequestWithUser> = async (
  req,
  res,
  next
) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      console.log("token found ", decoded);
      req.user = await User.findById(decoded.id).select("-password");
    } catch (error) {
      res.statusCode = 401;
      throw new Error("not authorized, invalid token");
    }
  } else {
    res.statusCode = 401;
    throw new Error("not authorized, no token");
  }
  next();
};
