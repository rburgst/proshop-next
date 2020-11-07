// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import products from "../data/products";

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const product = products.find((p) => p._id === req.query.id);
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
