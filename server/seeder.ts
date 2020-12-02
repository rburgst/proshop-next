import 'colorts/lib/string'

import dotenv from 'dotenv-flow'

import products from '../pages/api/data/products'
import users from '../pages/api/data/users'
import connectDB from './config/db'
import Order from './models/orderModel'
import Product from './models/productModel'
import User from './models/userModel'

dotenv.config()

connectDB()

const importData = async (): Promise<void> => {
  try {
    await Order.deleteMany({})
    await Product.deleteMany({})
    await User.deleteMany({})

    const createdUsers = await User.insertMany(users)
    const adminUser = createdUsers[0]._id
    const sampleProducts = products.map((product) => ({
      ...product,
      user: adminUser,
    }))
    await Product.insertMany(sampleProducts)
    console.log('Data imported'.green.inverse)
  } catch (e) {
    console.error(`${e}`.red.inverse)
  }
}

const destroyData = async (): Promise<void> => {
  try {
    await Order.deleteMany({})
    await Product.deleteMany({})
    await User.deleteMany({})

    console.log('Data destroyed!'.red.inverse)
  } catch (e) {
    console.error(`${e}`.red.inverse)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
