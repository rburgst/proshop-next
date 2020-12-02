import jwt from 'jsonwebtoken'
import { NextApiRequest } from 'next'

import connectDB from '../config/db'
import User, { IUserDoc } from '../models/userModel'
import { MiddlewareFunction } from '.'

export interface NextApiRequestWithUser extends NextApiRequest {
  user: IUserDoc | null
}

export const protect: MiddlewareFunction<NextApiRequestWithUser> = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (authHeader?.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1]
    try {
      await connectDB()
      const secret = process.env.JWT_SECRET as string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded: any = jwt.verify(token, secret)
      console.log('token found ', decoded)
      req.user = await User.findById(decoded.id).select('-password')
    } catch (error) {
      res.statusCode = 401
      throw new Error('not authorized, invalid token')
    }
  } else {
    res.statusCode = 401
    throw new Error('not authorized, no token')
  }
  next()
}

export const isAdmin: MiddlewareFunction<NextApiRequestWithUser> = async (req, res, next) => {
  if (req.user?.isAdmin) {
    next()
  } else {
    res.statusCode = 401
    throw new Error('not authorized as an admin')
  }
}
