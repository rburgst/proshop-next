import { NextApiResponse } from 'next'
import nc from 'next-connect'

import connectDB from '../../../server/config/db'
import { onError } from '../../../server/middlewares'
import { NextApiRequestWithUser, protect } from '../../../server/middlewares/authMiddleware'
import Order from '../../../server/models/orderModel'

const getMyOrders = async (req: NextApiRequestWithUser, res: NextApiResponse): Promise<void> => {
  console.log('get users orders, user', req.user)
  await connectDB()
  const orders = await Order.find({ user: req.user._id })
  res.json(orders)
}
export default nc({ onError: onError }).get(protect, getMyOrders)
