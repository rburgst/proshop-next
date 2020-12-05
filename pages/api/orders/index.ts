import { NextApiResponse } from 'next'
import nc from 'next-connect'

import { CartItem } from '../../../frontend/reducers/cartReducers'
import connectDB from '../../../server/config/db'
import { onError } from '../../../server/middlewares'
import {
  isAdmin,
  NextApiRequestWithUser,
  protect,
} from '../../../server/middlewares/authMiddleware'
import Order, { IOrderInput } from '../../../server/models/orderModel'
import Product from '../../../server/models/productModel'
import { calculatePrices } from '../../../server/utils/prices'

const createOrder = async (req: NextApiRequestWithUser, res: NextApiResponse): Promise<void> => {
  console.error('add order')

  await connectDB()
  const { shippingAddress, paymentMethod } = req.body as IOrderInput
  const orderItems: CartItem[] = req.body.orderItems

  if (!orderItems || orderItems.length === 0) {
    res.statusCode = 400
    throw new Error('no order items')
  }
  const productIds = orderItems.map((item) => item.product)
  const products = await Product.find({ _id: { $in: productIds } })
  console.log('got products', products)

  // dont trust the client to provide prices :)
  let itemsPrice = 0
  orderItems.forEach((orderItem) => {
    const product = products.find((prod) => prod._id.toString() === orderItem.product)
    if (!product) {
      res.statusCode = 400
      throw new Error(`product ${orderItem.product} not found`)
    }
    orderItem.price = product.price
    itemsPrice += Number(Number(orderItem.qty * product.price).toFixed(2))
  })
  const prices = calculatePrices(itemsPrice)

  const order = new Order({
    orderItems,
    shippingAddress,
    user: req.user,
    paymentMethod,
    shippingPrice: prices.shippingPrice,
    taxPrice: prices.taxPrice,
    totalPrice: prices.totalPrice,
    isPaid: false,
    deliveredAt: undefined,
    paidAt: undefined,
    isDelivered: false,
    paymentResult: undefined,
  })

  const createdOrder = await order.save()

  res.status(201).json(createdOrder)
}

const getOrders = async (req: NextApiRequestWithUser, res: NextApiResponse): Promise<void> => {
  console.log('get all orders')
  await connectDB()
  const orders = await Order.find().populate('user', '_id name')
  res.json(orders)
}

export default nc({ onError: onError }).post(protect, createOrder).get(protect, isAdmin, getOrders)
