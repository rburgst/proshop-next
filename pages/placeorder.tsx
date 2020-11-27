import Link from "next/link";
import { useRouter } from "next/router";
import React, { FunctionComponent, SyntheticEvent, useCallback } from "react";
import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";
import { CartItem, CartState } from "../frontend/reducers/cartReducers";
import { RootState, useAppDispatch } from "../frontend/store";
import { useMemo } from "react";

const taxRate = 0.2;

const PlaceOrderScreen: FunctionComponent = () => {
  const cart: CartState = useSelector((state: RootState) => state.cart);
  const { cartItems } = cart;

  const cartPrices = useMemo(() => {
    const itemsPrice = cartItems.reduce(
      (acc, cur) => acc + cur.qty * cur.price,
      0
    );
    const shippingPrice = Number(itemsPrice > 100 ? 0 : 10).toFixed(2);
    const taxPrice = Number(taxRate * itemsPrice).toFixed(2);
    const totalPrice = Number(
      Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)
    ).toFixed(2);
    return { itemsPrice, shippingPrice, taxPrice, totalPrice };
  }, [cartItems]);

  const dispatch = useAppDispatch();
  const router = useRouter();

  // useEffect(() => {
  //   if (!shippingAddress) {
  //     router.push("/shipping");
  //   }
  // }, [router, shippingAddress]);

  const placeOrderHandler = useCallback(
    (e: SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log("place order");
      //router.push("/placeorder");
    },

    [dispatch, router]
  );
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
                          <Image
                            src={item.image}
                            fluid
                            alt={item.name}
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link href={`/product/${item.product}`}>
                            {item.name}
                          </Link>
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
  );
};

export default PlaceOrderScreen;
