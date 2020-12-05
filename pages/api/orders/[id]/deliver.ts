// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiResponse } from 'next'
import nc from 'next-connect'

import connectDB from '../../../../server/config/db'
import { onError } from '../../../../server/middlewares'
import {
  isAdmin,
  NextApiRequestWithUser,
  protect,
} from '../../../../server/middlewares/authMiddleware'
import Order from '../../../../server/models/orderModel'

const deliverOrder = async (req: NextApiRequestWithUser, res: NextApiResponse): Promise<void> => {
  await connectDB()
  console.log('set order by ', req.query.id, 'to paid, user', req.user)
  const order = await Order.findById(req.query.id)
  if (!order) {
    res.status(404)
    throw new Error('order not found')
  }
  if (!order.isPaid) {
    res.status(400)
    throw new Error('order not paid yet')
  }
  order.deliveredAt = new Date()
  order.isDelivered = true

  const updatedOrder = await order.save()
  res.json(updatedOrder)
}
export default nc({ onError: onError }).put(protect, isAdmin, deliverOrder)
