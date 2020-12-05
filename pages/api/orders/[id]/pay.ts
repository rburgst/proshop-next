// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiResponse } from 'next'
import nc from 'next-connect'

import connectDB from '../../../../server/config/db'
import { onError } from '../../../../server/middlewares'
import { NextApiRequestWithUser, protect } from '../../../../server/middlewares/authMiddleware'
import Order from '../../../../server/models/orderModel'
import { IUserDoc } from '../../../../server/models/userModel'

const payOrder = async (req: NextApiRequestWithUser, res: NextApiResponse): Promise<void> => {
  await connectDB()
  console.log('set order by ', req.query.id, 'to paid, user', req.user)
  const order = await Order.findById(req.query.id)
  if (!order) {
    res.status(404)
    throw new Error('order not found')
  }
  const orderUser = order.user as IUserDoc
  // only allow the user itself or an admin to view this order
  if (req.user.isAdmin || req.user._id.toString() === orderUser._id.toString()) {
    order.isPaid = true
    order.paidAt = new Date()
    order.paymentResult = {
      id: req.body.id as string,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    }

    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } else {
    console.log(
      'rejecting order to be viewed by',
      req.user.email,
      'as he is not the owner of the order, owner',
      orderUser.email
    )
    res.status(404)
    throw new Error('order not found')
  }
}
export default nc({ onError: onError }).put(protect, payOrder)
