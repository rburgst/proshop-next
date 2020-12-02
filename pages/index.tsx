import { FunctionComponent, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'

import Loader from '../components/Loader'
import Message from '../components/Message'
import Product from '../components/Product'
import { fetchProducts, ProductListState } from '../frontend/reducers/productReducers'
import { RootState, useAppDispatch } from '../frontend/store'

const Home: FunctionComponent = () => {
  const dispatch = useAppDispatch()
  const productList = useSelector((state: RootState) => state.productList as ProductListState)
  const { loading, products, error } = productList

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  return (
    <>
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  )
}

export default Home
