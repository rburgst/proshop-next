// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiResponse } from 'next'
import nc from 'next-connect'

import connectDB from '../../../server/config/db'
import { NextApiRequestWithUser, protect } from '../../../server/middlewares/authMiddleware'
import { onError } from '../../../server/middlewares/index'
import User from '../../../server/models/userModel'

const getUserProfile = async (req: NextApiRequestWithUser, res: NextApiResponse): Promise<void> => {
  await connectDB()
  const user = await User.findById(req.user._id)

  if (user) {
    res.statusCode = 200
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    // user not found
    res.statusCode = 404
    throw new Error('user not found')
  }
}

const updateUserProfile = async (
  req: NextApiRequestWithUser,
  res: NextApiResponse
): Promise<void> => {
  const { name, email, password } = req.body
  await connectDB()

  const user = await User.findById(req.user._id)

  if (!user) {
    res.statusCode = 404
    throw new Error('user not found')
  }

  if (email && user.email !== email) {
    const userExists = await User.findOne({ email })

    if (userExists) {
      res.statusCode = 400
      throw new Error('this email already exists')
    }
  }

  if (email) {
    user.email = email
  }
  if (name) {
    user.name = name
  }
  if (password) {
    user.password = password
  }

  const updatedUser = await user.save()
  if (updatedUser) {
    res.statusCode = 200
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.statusCode = 400
    throw new Error('invalid user data')
  }
}

export default nc({ onError: onError }).get(protect, getUserProfile).put(protect, updateUserProfile)
