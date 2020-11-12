// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../server/config/db";
import Product from "../../../server/models/productModel";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.error("get products");
  if (req.method === "GET") {
    const mongoose = await connectDB();
    const products = await Product.find({});
    res.statusCode = 200;

    res.json(products);
  } else {
    // Handle any other HTTP method
    res.statusCode = 400;
    res.json({ error: "wrong http method" });
  }
};
