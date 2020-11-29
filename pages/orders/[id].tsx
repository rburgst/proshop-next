import React, { useMemo } from "react";
import { FunctionComponent, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  OrderDetailsState,
  getOrderDetails,
} from "../../frontend/reducers/orderReducers";
import { RootState, useAppDispatch } from "../../frontend/store";
import { useRouter } from "next/router";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Col, ListGroup, Row, Image, Card, Button } from "react-bootstrap";
import { OrderItem } from "../../server/models/orderModel";
import Link from "next/link";
import { IUserWithId } from "../../frontend/reducers/userReducers";

const OrderScreen: FunctionComponent = () => {
  const orderDetails = useSelector(
    (state: RootState) => state.orderDetails as OrderDetailsState
  );
  const { order, loading, error } = orderDetails;

  const router = useRouter();
  const orderId = router.query.id as string;
  const dispatch = useAppDispatch();
  useEffect(() => {
    console.log(
      "useEffect orderId",
      orderId,
      "loading",
      loading,
      "order",
      order
    );
    if (orderId && !loading) {
      if (!order || order._id !== orderId) {
        console.log("dispatch loading", orderId);
        dispatch(getOrderDetails(orderId));
      }
    }
  }, [orderId, dispatch, order]);
  const itemsPrice = useMemo(() => {
    if (order?.orderItems) {
      const itemsPrice = order.orderItems.reduce(
        (acc, cur) => acc + cur.qty * cur.price,
        0
      );
      return Number(itemsPrice).toFixed(2);
    } else {
      return 0;
    }
  }, [order?.orderItems]);
  const orderUser: IUserWithId = order?.user as IUserWithId;

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : !order ? (
    <Message variant="danger">No Order</Message>
  ) : (
    <>
      <h1>Order {order?._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong>
                {orderUser?.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${orderUser?.email}`}>{orderUser?.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                <br />
                {order.shippingAddress.address}
                <br />
                {order.shippingAddress.postalCode} {order.shippingAddress.city}
                <br />
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method:</strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item: OrderItem, index) => (
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
                  <Col>${itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
