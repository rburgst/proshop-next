import dotenv from "dotenv-flow";
import connectDB from "./config/db";
import Order from "./models/orderModel";
import Product from "./models/productModel";
import User from "./models/userModel";
import users from "../pages/api/data/users";
import products from "../pages/api/data/products";
import "colorts/lib/string";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;
    const sampleProducts = products.map((product) => ({
      ...product,
      user: adminUser,
    }));
    await Product.insertMany(sampleProducts);
    console.log("Data imported".green.inverse);
  } catch (e) {
    console.error(`${e}`.red.inverse);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    console.log("Data destroyed!".red.inverse);
  } catch (e) {
    console.error(`${e}`.red.inverse);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
