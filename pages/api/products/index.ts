// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { FilterQuery } from 'mongoose'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

import connectDB from '../../../server/config/db'
import {
  isAdmin,
  NextApiRequestWithUser,
  protect,
} from '../../../server/middlewares/authMiddleware'
import { onError } from '../../../server/middlewares/index'
import Product, { IProduct, IProductDoc } from '../../../server/models/productModel'

const getAllProducts = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const keyword = req.query.keyword
  const query: FilterQuery<IProductDoc> = keyword
    ? { name: { $regex: keyword as string, $options: 'i' } }
    : {}

  console.error('get products, keyword', keyword)
  await connectDB()
  const products = await Product.find(query)
  res.statusCode = 200

  res.json(products)
}

const createProduct = async (req: NextApiRequestWithUser, res: NextApiResponse): Promise<void> => {
  console.error('create product')
  await connectDB()

  let newProduct = req.body as IProduct

  if (!newProduct?.name) {
    newProduct = {
      name: 'Sample name',
      price: 0,
      image: '/images/sample.jpg',
      brand: 'Sample brand',
      category: 'Sample category',
      countInStock: 0,
      numReviews: 0,
      description: 'Sample description',
      rating: 0,
      user: req.user._id,
      reviews: [],
    }
  } else {
    newProduct.user = req.user._id
  }

  const order = new Product(newProduct)

  const createdProduct = await order.save()
  res.status(201).json(createdProduct)
}

export default nc({ onError: onError }).get(getAllProducts).post(protect, isAdmin, createProduct)
