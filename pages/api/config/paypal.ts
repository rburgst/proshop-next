// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiResponse, NextApiRequest } from "next";
import withMiddleware from "../../../server/middlewares";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    res.json(process.env.PAYPAL_CLIENT_ID);
  } else {
    // Handle any other HTTP method
    res.statusCode = 400;
    res.json({ error: "wrong http method" });
  }
};
export default withMiddleware(handler);
