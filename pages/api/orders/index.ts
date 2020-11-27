import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../server/config/db";
import withMiddleware from "../../../server/middlewares";
import {
  NextApiRequestWithUser,
  protect,
} from "../../../server/middlewares/authMiddleware";
import {
  ShippingAddress,
  CartItem,
} from "../../../frontend/reducers/cartReducers";
import Product from "../../../server/models/productModel";
import { calculatePrices } from "../../../server/utils/prices";
import Order from "../../../server/models/orderModel";
import { IOrderInput } from "../../../server/models/orderModel";

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  console.error("add order");
  if (req.method === "POST") {
    const mongoose = await connectDB();
    const { shippingAddress, paymentMethod } = req.body as IOrderInput;
    const orderItems: CartItem[] = req.body.orderItems;

    if (!orderItems || orderItems.length === 0) {
      res.statusCode = 400;
      throw new Error("no order items");
    }
    const productIds = orderItems.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });
    console.log("got products", products);

    // dont trust the client to provide prices :)
    let itemsPrice = 0;
    orderItems.forEach((orderItem) => {
      const product = products.find(
        (prod) => prod._id.toString() === orderItem.product
      );
      if (!product) {
        res.statusCode = 400;
        throw new Error(`product ${orderItem.product} not found`);
      }
      orderItem.price = product.price;
      itemsPrice += Number(Number(orderItem.qty * product.price).toFixed(2));
    });
    const prices = calculatePrices(itemsPrice);

    const order = new Order({
      orderItems,
      shippingAddress,
      user: req.user,
      paymentMethod,
      shippingPrice: prices.shippingPrice,
      taxPrice: prices.taxPrice,
      totalPrice: prices.totalPrice,
      isPaid: false,
      deliveredAt: undefined,
      paidAt: undefined,
      isDelivered: false,
      paymentResult: undefined,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);

    res.json(products);
  } else {
    // Handle any other HTTP method
    res.statusCode = 400;
    res.json({ error: "wrong http method" });
  }
};

export default withMiddleware(handler, protect);
