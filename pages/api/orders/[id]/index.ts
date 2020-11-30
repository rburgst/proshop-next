// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiResponse } from "next";
import connectDB from "../../../../server/config/db";
import withMiddleware from "../../../../server/middlewares";
import {
  NextApiRequestWithUser,
  protect,
} from "../../../../server/middlewares/authMiddleware";
import Order from "../../../../server/models/orderModel";
import { IUserDoc } from "../../../../server/models/userModel";

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  if (req.method === "GET") {
    console.log("get single product by id", req.query.id, "user", req.user);
    const conn = await connectDB();
    const order = await Order.findById(req.query.id).populate(
      "user",
      "name email"
    );
    if (!order) {
      res.status(404);
      throw new Error("order not found");
    }
    const orderUser = order.user as IUserDoc;
    // only allow the user itself or an admin to view this order
    if (
      req.user.isAdmin ||
      req.user._id.toString() === orderUser._id.toString()
    ) {
      res.json(order);
    } else {
      console.log(
        "rejecting order to be viewed by",
        req.user.email,
        "as he is not the owner of the order, owner",
        orderUser.email
      );
      res.status(404);
      throw new Error("order not found");
    }
  } else {
    // Handle any other HTTP method
    res.statusCode = 400;
    res.json({ error: "wrong http method" });
  }
};
export default withMiddleware(handler, protect);
