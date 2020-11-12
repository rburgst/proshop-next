// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import productModel from "../../../server/models/productModel";
import connectDB from "../../../server/config/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const conn = await connectDB();
    console.log("get single product by id", req.query.id);
    const product = await productModel.findById(req.query.id);
    if (!product) {
      res.status(404);
      res.send("not found");
      return;
    }
    res.json(product);
  } else {
    // Handle any other HTTP method
    res.statusCode = 400;
    res.json({ error: "wrong http method" });
  }
};
