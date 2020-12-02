import mongoose, { Model } from 'mongoose'

import { ShippingAddress } from './models'
import { ID } from './productModel'
import { IUserDoc } from './userModel'

export interface PaymentResult {
  id: string
  status: string
  update_time: string
  email_address: string
}
export interface OrderItem {
  name: string
  qty: number
  image: string
  price: number
  product: ID
}
export interface IOrder {
  user: ID | IUserDoc
  orderItems: OrderItem[]

  shippingAddress: ShippingAddress
  paymentMethod: string
  paymentResult: PaymentResult
  taxPrice: number
  shippingPrice: number
  totalPrice: number
  isPaid: boolean
  paidAt: Date
  isDelivered: boolean
  deliveredAt: Date
  createdAt?: string
  updatedAt?: string
}
export interface IOrderInput {
  orderItems: OrderItem[]

  shippingAddress: ShippingAddress
  paymentMethod: string
}

export interface IOrderDoc extends IOrder, mongoose.Document {}

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

const Order: Model<IOrderDoc> = mongoose.models.Order ?? mongoose.model('Order', orderSchema)
export default Order
