import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FunctionComponent, useCallback } from 'react'
import { Button, Card, Col, Form, Image, ListGroup, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'

import Message from '../../components/Message'
import { addToCart, cartSlice, CartState } from '../../frontend/reducers/cartReducers'
import { RootState, useAppDispatch } from '../../frontend/store'

const CartScreen: FunctionComponent = () => {
  const cart = useSelector((state: RootState) => state.cart as CartState)
  const { cartItems } = cart
  const dispatch = useAppDispatch()
  const router = useRouter()

  const onRemoveFromCartHandler = useCallback(
    (id) => {
      dispatch(cartSlice.actions.removeItem(id))
    },
    [dispatch]
  )
  const checkoutHandler = useCallback(() => {
    console.log('checkout')
    router.push('/login?redirect=shipping')
  }, [router])

  return (
    <>
      <Link href="/">
        <a className="btn btn-light my-3">Go Back</a>
      </Link>
      <Row>
        <Col md={8}>
          <h1>Cart Overview {cartItems.length} items</h1>
          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty. <Link href="/">Go Back</Link>
            </Message>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map((item) => (
                <ListGroup.Item key={item.product}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <Link href={`product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={2}>${item.price}</Col>
                    <Col md={2}>
                      <Form.Control
                        as="select"
                        value={item.qty}
                        onChange={(e) =>
                          dispatch(
                            addToCart({
                              productId: item.product,
                              qty: Number(e.target.value),
                            })
                          )
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={2}>
                      <Button variant="light" onClick={() => onRemoveFromCartHandler(item.product)}>
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Subtotal ({cartItems.reduce((acc, cur) => acc + cur.qty, 0)}) items</h2>$
                {cartItems.reduce((acc, cur) => acc + cur.price * cur.qty, 0).toFixed(2)}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed to Checkout
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
      <ul></ul>
    </>
  )
}

export default CartScreen
