import 'colorts/lib/string'

import mongoose, { Mongoose } from 'mongoose'

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentiatlly
 * during API Route usage.
 */
let cachedMongoose: Mongoose

const connectDB = async () => {
  try {
    if (cachedMongoose) {
      console.warn('reusing existing connection')
      return cachedMongoose
    }
    console.log('connecting to ', process.env.MONGO_URI)
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    console.warn(`MongoDB connected ${conn.connection.host}`.cyan.underline)
    cachedMongoose = conn
  } catch (e) {
    console.error(`error connecting to mongo: ${e.message}`.red.bold)
    process.exit(1)
  }
}

export default connectDB
