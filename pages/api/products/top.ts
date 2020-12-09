// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

import connectDB from '../../../server/config/db'
import { onError } from '../../../server/middlewares/index'
import Product, { IProductWithId } from '../../../server/models/productModel'

const getTopProducts = async (
  req: NextApiRequest,
  res: NextApiResponse<IProductWithId[]>
): Promise<void> => {
  console.error('get top products')
  await connectDB()
  const products = await Product.find({}).sort('-rating').limit(3)

  res.json(products as IProductWithId[])
}

export default nc({ onError: onError }).get(getTopProducts)
