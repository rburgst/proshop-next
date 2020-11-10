// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import products from "../data/products";
import connectDB from "../../../server/config/db";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const mongoose = connectDB();
  console.error("get products");
  if (req.method === "GET") {
    res.statusCode = 200;
    res.json(products);
  } else {
    // Handle any other HTTP method
    res.statusCode = 400;
    res.json({ error: "wrong http method" });
  }
};
