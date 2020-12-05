import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FunctionComponent, useCallback, useEffect } from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap'
import { useSelector } from 'react-redux'

import Loader from '../../components/Loader'
import Message from '../../components/Message'
import { listAdminOrders, OrderListState } from '../../frontend/reducers/orderReducers'
import {
  createProduct,
  deleteProduct,
  fetchProducts,
} from '../../frontend/reducers/productReducers'
import { UserLoginState } from '../../frontend/reducers/userReducers'
import { RootState, useAppDispatch } from '../../frontend/store'

const ProductListScreen: FunctionComponent = () => {
  const dispatch = useAppDispatch()
  const orderList = useSelector((state: RootState) => state.orderList as OrderListState)
  const { loading, error, orders } = orderList

  const userLogin = useSelector((state: RootState) => state.userLogin as UserLoginState)
  const { userInfo } = userLogin

  const router = useRouter()

  useEffect(() => {
    // lets use the successDelete here since otherwise the depencency linter would complain
    if (userInfo) {
      if (userInfo.isAdmin) {
        dispatch(listAdminOrders())
      } else {
        router.push('/login')
      }
    }
  }, [router, dispatch, userInfo])

  return (
    <>
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className={'table-sm'}>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user?.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>${order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt?.toString()?.substring(0, 10)
                  ) : (
                    <FontAwesomeIcon icon="times" color="red" />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt?.toString()?.substring(0, 10)
                  ) : (
                    <FontAwesomeIcon icon="times" color="red" />
                  )}
                </td>
                <td>
                  <Link href={`/order/${order._id}`}>
                    <Button variant="light" as="a" href={`/order/${order._id}`} className="btn-sm">
                      Details
                    </Button>
                  </Link>
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
