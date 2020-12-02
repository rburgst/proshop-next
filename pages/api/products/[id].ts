// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

import connectDB from '../../../server/config/db'
import { onError } from '../../../server/middlewares'
import productModel from '../../../server/models/productModel'

const getProductById = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  await connectDB()
  console.log('get single product by id', req.query.id)
  const product = await productModel.findById(req.query.id)
  if (!product) {
    res.status(404)
    throw new Error('product not found')
  }
  res.json(product)
}

export default nc({ onError: onError }).get(getProductById)
