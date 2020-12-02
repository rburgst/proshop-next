// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next'

import connectDB from '../../../server/config/db'
import withMiddleware from '../../../server/middlewares/index'
import Product from '../../../server/models/productModel'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.error('get products')
  if (req.method === 'GET') {
    const mongoose = await connectDB()
    const products = await Product.find({})
    res.statusCode = 200

    res.json(products)
  } else {
    // Handle any other HTTP method
    res.statusCode = 400
    res.json({ error: 'wrong http method' })
  }
}

export default withMiddleware(handler)
