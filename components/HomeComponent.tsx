import React, { FunctionComponent, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'

import { fetchProducts, ProductListState } from '../frontend/reducers/productReducers'
import { RootState, useAppDispatch } from '../frontend/store'
import Loader from './Loader'
import Message from './Message'
import Product from './Product'

interface HomeComponentProps {
  keyword?: string
}
const HomeComponent: FunctionComponent<HomeComponentProps> = ({ keyword = '' }) => {
  const dispatch = useAppDispatch()
  const productList = useSelector((state: RootState) => state.productList as ProductListState)
  const { loading, products, error } = productList

  useEffect(() => {
    dispatch(fetchProducts(keyword))
  }, [dispatch, keyword])

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

export default HomeComponent
