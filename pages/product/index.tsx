import { GetServerSideProps } from 'next'
import { FunctionComponent } from 'react'
import { Col, Row } from 'react-bootstrap'

import Product from '../../components/Product'
import connectDB from '../../server/config/db'
import ProductModel, { IProductDoc, IProductWithId } from '../../server/models/productModel'

interface ProductsProps {
  products: IProductWithId[]
}

const Home: FunctionComponent<ProductsProps> = ({ products }) => {
  return (
    <>
      <h1>Latest Products</h1>
      <Row>
        {products.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  await connectDB()
  console.log('get server props')
  const products = (await ProductModel.find({}).lean()) as IProductDoc[]
  const leanProducts = products.map((product) => ({
    ...product,
    _id: product._id.toString(),
    user: product.user.toString(),
    // @ts-ignore: timestamps are not represented in the schema
    createdAt: product.createdAt.toString(),
    // @ts-ignore: timestamps are not represented in the schema
    updatedAt: product.updatedAt.toString(),
  }))

  return {
    props: {
      products: leanProducts,
    }, // will be passed to the page component as props
  }
}

export default Home
