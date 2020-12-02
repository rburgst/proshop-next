// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

import connectDB from '../../../server/config/db'
import { onError } from '../../../server/middlewares/index'
import Product from '../../../server/models/productModel'

const getAllProducts = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  console.error('get products')
  await connectDB()
  const products = await Product.find({})
  res.statusCode = 200

  res.json(products)
}

export default nc({ onError: onError }).get(getAllProducts)
