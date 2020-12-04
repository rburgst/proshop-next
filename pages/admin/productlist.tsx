import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FunctionComponent, useCallback, useEffect } from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap'
import { useSelector } from 'react-redux'

import Loader from '../../components/Loader'
import Message from '../../components/Message'
import {
  deleteProduct,
  fetchProducts,
  ProductDeleteState,
  ProductListState,
} from '../../frontend/reducers/productReducers'
import { UserLoginState } from '../../frontend/reducers/userReducers'
import { RootState, useAppDispatch } from '../../frontend/store'

const ProductListScreen: FunctionComponent = () => {
  const dispatch = useAppDispatch()
  const productList = useSelector((state: RootState) => state.productList as ProductListState)
  const { loading, error, products } = productList
  const userLogin = useSelector((state: RootState) => state.userLogin as UserLoginState)
  const { userInfo } = userLogin
  const productDelete = useSelector((state: RootState) => state.productDelete as ProductDeleteState)
  const { loading: loadingDelete, success: successDelete, error: errorDelete } = productDelete

  const router = useRouter()

  useEffect(() => {
    // lets use the successDelete here since otherwise the depencency linter would complain
    console.log('successDelete', successDelete)
    if (userInfo) {
      if (userInfo.isAdmin) {
        dispatch(fetchProducts())
      } else {
        router.push('/login')
      }
    }
  }, [router, dispatch, userInfo, successDelete])

  const deleteHandler = useCallback(
    (productId) => {
      if (window.confirm('Are you sure')) {
        // delete product
        console.log('delete product', productId)
        dispatch(deleteProduct(productId))
      }
    },
    [dispatch]
  )
  const createProductHandler = useCallback(() => {
    console.log('create product')
  }, [])
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <FontAwesomeIcon icon={'plus'} /> Create Product
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className={'table-sm'}>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <Link href={`/admin/user/${product._id}/edit`}>
                    <Button
                      variant="light"
                      as="a"
                      href={`/admin/user/${product._id}/edit`}
                      className="btn-sm"
                    >
                      <FontAwesomeIcon icon="edit" />
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(product._id)}
                  >
                    <FontAwesomeIcon icon="trash" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default ProductListScreen
