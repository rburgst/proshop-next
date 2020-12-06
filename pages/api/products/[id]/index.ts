// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

import connectDB from '../../../../server/config/db'
import { onError } from '../../../../server/middlewares'
import {
  isAdmin,
  NextApiRequestWithUser,
  protect,
} from '../../../../server/middlewares/authMiddleware'
import productModel, { IProduct } from '../../../../server/models/productModel'

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

const deleteProductById = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  await connectDB()
  const productId = req.query.id
  console.log('delete a single product by id', productId)
  const product = await productModel.findById(productId)
  if (product) {
    await product.remove()
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('product not found')
  }
}

const updateProduct = async (req: NextApiRequestWithUser, res: NextApiResponse): Promise<void> => {
  await connectDB()
  const productId = req.query.id
  console.log('update a single product by id', productId)
  const product = await productModel.findById(productId)

  const productInput: IProduct = req.body as IProduct
  const { name, description, image, category, countInStock, price, brand } = productInput

  if (product) {
    product.name = name
    product.description = description
    product.price = price
    product.image = image
    product.category = category
    product.countInStock = countInStock
    product.brand = brand

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('product not found')
  }
}

export default nc({ onError: onError })
  .get(getProductById)
  .delete(protect, isAdmin, deleteProductById)
  .put(protect, isAdmin, updateProduct)
