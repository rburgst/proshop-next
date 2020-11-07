// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import products from "../data/products";

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    res.statusCode = 200;
    res.json(products);
  } else {
    // Handle any other HTTP method
    res.statusCode = 400;
    res.json({ error: "wrong http method" });
  }
};
