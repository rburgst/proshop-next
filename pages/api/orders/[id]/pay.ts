// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import productModel from "../../../../server/models/productModel";
import connectDB from "../../../../server/config/db";
import withMiddleware from "../../../../server/middlewares";
import {
  protect,
  NextApiRequestWithUser,
} from "../../../../server/middlewares/authMiddleware";
import Order from "../../../../server/models/orderModel";
import { IUserDoc } from "../../../../server/models/userModel";

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  if (req.method === "PUT") {
    const conn = await connectDB();
    console.log("set order by ", req.query.id, "to paid, user", req.user);
    const order = await Order.findById(req.query.id);
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
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        id: req.body.id as string,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
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
