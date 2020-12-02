import { NextApiResponse } from 'next'

import connectDB from '../../../server/config/db'
import withMiddleware from '../../../server/middlewares'
import { NextApiRequestWithUser, protect } from '../../../server/middlewares/authMiddleware'
import Order from '../../../server/models/orderModel'

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  if (req.method === 'GET') {
    console.log('get single product by id', req.query.id, 'user', req.user)
    const conn = await connectDB()
    const orders = await Order.find({ user: req.user._id })
    res.json(orders)
  } else {
    // Handle any other HTTP method
    res.statusCode = 400
    res.json({ error: 'wrong http method' })
  }
}
export default withMiddleware(handler, protect)
