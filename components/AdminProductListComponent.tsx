import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FunctionComponent, useCallback, useEffect } from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap'
import { useSelector } from 'react-redux'

import {
  createProduct,
  deleteProduct,
  fetchProducts,
  productCreateSlice,
  ProductCreateState,
  ProductDeleteState,
  ProductListState,
} from '../frontend/reducers/productReducers'
import { UserLoginState } from '../frontend/reducers/userReducers'
import { RootState, useAppDispatch } from '../frontend/store'
import Loader from './Loader'
import Message from './Message'
import Paginate from './Paginate'

interface AdminProductListComponentProps {
  pageNumber: number
}
const AdminProductListComponent: FunctionComponent<AdminProductListComponentProps> = ({
  pageNumber = 1,
}) => {
  const dispatch = useAppDispatch()
  const productList = useSelector((state: RootState) => state.productList as ProductListState)
  const { loading, error, products, page, pages } = productList
  const userLogin = useSelector((state: RootState) => state.userLogin as UserLoginState)
  const { userInfo } = userLogin
  const productDelete = useSelector((state: RootState) => state.productDelete as ProductDeleteState)
  const { loading: loadingDelete, success: successDelete, error: errorDelete } = productDelete
  const productCreate = useSelector((state: RootState) => state.productCreate as ProductCreateState)
  const {
    loading: loadingCreate,
    success: successCreate,
    error: errorCreate,
    product: createdProduct,
  } = productCreate

  const router = useRouter()
  const { keyword } = router.query

  useEffect(() => {
    // lets use the successDelete here since otherwise the depencency linter would complain
    console.log('successDelete', successDelete)
    if (userInfo) {
      if (userInfo.isAdmin) {
        dispatch(fetchProducts({ keyword: '', pageNumber }))
      } else {
        router.push('/login')
      }
    }
  }, [router, dispatch, userInfo, successDelete, pageNumber])

  useEffect(() => {
    dispatch(productCreateSlice.actions.reset())
    // lets use the successDelete here since otherwise the depencency linter would complain
    console.log('successDelete', successDelete)
    if (userInfo) {
      if (!userInfo.isAdmin) {
        router.push('/login')
      }
      if (successCreate) {
        router.push(`/admin/product/${createdProduct?._id}/edit`)
      } else {
        dispatch(fetchProducts({ keyword: '', pageNumber }))
      }
    }
  }, [router, dispatch, userInfo, successDelete, successCreate, createdProduct, pageNumber])

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
    dispatch(createProduct())
  }, [dispatch])
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
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
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
                    <Link href={`/admin/product/${product._id}/edit`}>
                      <Button
                        variant="light"
                        as="a"
                        href={`/admin/product/${product._id}/edit`}
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
          {pages > 1 && (
            <Paginate
              isAdmin={true}
              page={page}
              pages={pages}
              keyword={(keyword as string) ?? ''}
            />
          )}
        </>
      )}
    </>
  )
}

export default AdminProductListComponent
