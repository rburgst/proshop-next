import React, { FunctionComponent, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'

import { fetchProducts, ProductListState } from '../frontend/reducers/productReducers'
import { UserLoginState } from '../frontend/reducers/userReducers'
import { RootState, useAppDispatch } from '../frontend/store'
import Loader from './Loader'
import Message from './Message'
import Paginate from './Paginate'
import Product from './Product'
import ProductCarousel from './ProductCarousel'

interface HomeComponentProps {
  keyword?: string
  pageNumber?: number
}
const HomeComponent: FunctionComponent<HomeComponentProps> = ({ keyword = '', pageNumber = 1 }) => {
  const dispatch = useAppDispatch()
  const productList = useSelector((state: RootState) => state.productList as ProductListState)
  const { loading, products, error, page, pages } = productList
  const userLogin = useSelector((state: RootState) => state.userLogin as UserLoginState)
  const { userInfo } = userLogin

  useEffect(() => {
    dispatch(fetchProducts({ keyword, pageNumber }))
  }, [dispatch, keyword, pageNumber])

  return (
    <>
      {!keyword && <ProductCarousel />}
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            page={page}
            pages={pages}
            keyword={keyword}
            isAdmin={userInfo?.isAdmin ?? false}
          />
        </>
      )}
    </>
  )
}

export default HomeComponent
