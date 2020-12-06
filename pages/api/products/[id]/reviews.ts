// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import mongoose from 'mongoose'
import { NextApiResponse } from 'next'
import nc from 'next-connect'

import connectDB from '../../../../server/config/db'
import { onError } from '../../../../server/middlewares'
import { NextApiRequestWithUser, protect } from '../../../../server/middlewares/authMiddleware'
import productModel, { IReviewDoc } from '../../../../server/models/productModel'

const createProductReview = async (
  req: NextApiRequestWithUser,
  res: NextApiResponse
): Promise<void> => {
  await connectDB()
  const productId = req.query.id
  console.log('create review for product', productId, 'user', req.user._id)
  const product = await productModel.findById(productId)

  if (product) {
    const reviews = product.reviews as IReviewDoc[]
    const alreadyReviewed = reviews.find((rev) => rev.user?.toString() === req.user._id.toString())

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed')
    }
    const newReview = {
      name: req.user.name,
      rating: Number(req.body.rating),
      comment: req.body.comment,
      user: req.user._id,
    } as IReviewDoc & mongoose.Types.ObjectId
    product.reviews.push(newReview)
    product.numReviews = product.reviews.length
    product.rating = reviews.reduce((acc, item) => acc + item.rating, 0) / product.numReviews
    await product.save()
    res.status(201).send({ message: 'review added' })
  } else {
    res.status(404)
    throw new Error('product not found')
  }
}

export default nc({ onError: onError }).post(protect, createProductReview)
