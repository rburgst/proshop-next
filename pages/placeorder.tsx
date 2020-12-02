import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FunctionComponent, SyntheticEvent, useCallback, useEffect, useMemo } from 'react'
import { Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'

import CheckoutSteps from '../components/CheckoutSteps'
import Message from '../components/Message'
import { CartItem, cartSlice, CartState } from '../frontend/reducers/cartReducers'
import { createOrder, orderCreateSlice, OrderCreateState } from '../frontend/reducers/orderReducers'
import { userDetailsSlice } from '../frontend/reducers/userReducers'
import { RootState, useAppDispatch } from '../frontend/store'
import { OrderItem } from '../server/models/orderModel'
import { calculatePrices } from '../server/utils/prices'

const PlaceOrderScreen: FunctionComponent = () => {
  const cart: CartState = useSelector((state: RootState) => state.cart)
  const { cartItems } = cart

  const cartPrices = useMemo(() => {
    const itemsPrice = cartItems.reduce((acc, cur) => acc + cur.qty * cur.price, 0)
    return calculatePrices(itemsPrice)
  }, [cartItems])

  const dispatch = useAppDispatch()
  const router = useRouter()

  const orderCreate = useSelector((state: RootState) => state.orderCreate as OrderCreateState)
  const { order, error, success } = orderCreate

  // if we placed the order successfully, redirect to order screen
  useEffect(() => {
    if (success) {
      router.push(`/order/${order._id}`)
      dispatch(userDetailsSlice.actions.reset())
      dispatch(orderCreateSlice.actions.reset())
      dispatch(cartSlice.actions.reset())
    }
  }, [dispatch, router, success, order])

  const placeOrderHandler = useCallback(() => {
    console.log('place order')

    dispatch(
      createOrder({
        orderItems: (cart.cartItems as unknown) as OrderItem[],
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
      })
    )
  }, [dispatch, router, cart])
  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong>
                <br />
                {cart.shippingAddress.address}
                <br />
                {cart.shippingAddress.postalCode} {cart.shippingAddress.city}
                <br />
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method:</strong>
                {cart.paymentMethod}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cartItems.map((item: CartItem, index) => (
                    <ListGroup.Item key={`cartitem-${index}`}>
                      <Row>
                        <Col md={1}>
                          <Image src={item.image} fluid alt={item.name} rounded />
                        </Col>
                        <Col>
                          <Link href={`/product/${item.product}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${cartPrices.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${cartPrices.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${cartPrices.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${cartPrices.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  className="btn btn-block"
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen
