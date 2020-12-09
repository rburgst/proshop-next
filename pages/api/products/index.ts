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
import Product, {
  IProduct,
  IProductDoc,
  IProductPage,
  IProductWithId,
} from '../../../server/models/productModel'

const getAllProducts = async (
  req: NextApiRequest,
  res: NextApiResponse<IProductPage>
): Promise<void> => {
  const keyword = req.query?.keyword
  const query: FilterQuery<IProductDoc> = keyword
    ? { name: { $regex: keyword as string, $options: 'i' } }
    : {}

  const pageSize = 2
  const page = Number(req.query?.pageNumber ?? 1)

  console.error('get products, keyword', keyword)
  await connectDB()
  const count = await Product.countDocuments(query)
  const products = await Product.find(query)
    .limit(pageSize)
    .skip((page - 1) * pageSize)
  res.statusCode = 200

  res.json({ products: products as IProductWithId[], page, pages: Math.ceil(count / pageSize) })
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

  const product = new Product(newProduct)
  const createdProduct = await product.save()

  res.status(201).json(createdProduct)
}

export default nc({ onError: onError }).get(getAllProducts).post(protect, isAdmin, createProduct)
