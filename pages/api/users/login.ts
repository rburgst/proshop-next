// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

import connectDB from '../../../server/config/db'
import { onError } from '../../../server/middlewares'
import User from '../../../server/models/userModel'
import { generateToken } from '../../../server/utils/generateToken'

const loginUser = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { email, password } = req.body
  await connectDB()
  const user = await User.findOne({ email })

  if (user) {
    const matchesPassword = await user.matchPassword(password)
    if (matchesPassword) {
      res.statusCode = 200
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      })
      return
    }
  }

  res.statusCode = 401
  throw new Error('invalid email or password')
}

export default nc({ onError: onError }).post(loginUser)
