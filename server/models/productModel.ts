import mongoose, { Model, Types } from 'mongoose'

import { IUserDoc } from './userModel'

export type ID = Types.ObjectId

export interface ICreateProductInput {
  name: IProduct['name']
  image: IProduct['image']
  description: IProduct['description']
  brand: IProduct['brand']
  category: IProduct['category']
  price: IProduct['price']
  countInStock: IProduct['countInStock']
  rating: IProduct['rating']
  numReviews: IProduct['numReviews']
}

export interface IReview {
  name: string
  rating: number
  comment: string
  user: ID | IUserDoc
}

export interface ICreateReviewInput {
  rating: IReview['rating']
  comment: IReview['comment']
}

export interface IReviewDoc extends IReview, mongoose.Document {}

export interface IProduct {
  name: string
  image: string
  description: string
  brand: string
  category: string
  price: number
  countInStock: number
  rating: number
  numReviews: number
  reviews: ID[] | IReviewDoc[]
  user: ID | IUserDoc
}
export interface IProductWithId extends IProduct {
  _id: string
}
export interface IProductPage {
  products: IProductWithId[]
  page: number
  pages: number
}
// see also https://hackernoon.com/how-to-link-mongoose-and-typescript-for-a-single-source-of-truth-94o3uqc
export interface IProductDoc extends IProduct, mongoose.Document {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReviewSchemaFields: Record<keyof IReview, any> = {
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}

const reviewSchema = new mongoose.Schema(ReviewSchemaFields, {
  timestamps: true,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProductSchemaFields: Record<keyof IProduct, any> = {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0,
  },
}

const productSchema = new mongoose.Schema(ProductSchemaFields, {
  timestamps: true,
})

//const Product = mongoose.model("Product", productSchema);

// see https://github.com/vercel/next.js/issues/7328#issuecomment-519546743
const Product: Model<IProductDoc> =
  mongoose.models.Product ?? mongoose.model<IProductDoc>('Product', productSchema)
export default Product
