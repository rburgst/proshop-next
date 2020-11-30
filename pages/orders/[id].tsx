import React, {
  useMemo,
  useState,
  useCallback,
  FunctionComponent,
  useEffect,
} from "react";
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
import fetch from "isomorphic-unfetch";
import { GetServerSideProps } from "next";
import { env } from "process";
import {
  OrderPayState,
  payOrder,
  orderPaySlice,
} from "../../frontend/reducers/orderReducers";
import { PayPalButton } from "react-paypal-button-v2";

interface OrderScreenProps {
  clientId: string;
}

const OrderScreen: FunctionComponent<OrderScreenProps> = ({ clientId }) => {
  const [sdkReady, setSdkReady] = useState(false);
  const orderDetails = useSelector(
    (state: RootState) => state.orderDetails as OrderDetailsState
  );
  const { order, loading, error } = orderDetails;
  const orderPay = useSelector(
    (state: RootState) => state.orderPay as OrderPayState
  );
  const { loading: loadingPay, success: successPay } = orderPay;

  const router = useRouter();
  const orderId = router.query.id as string;
  const dispatch = useAppDispatch();
  useEffect(() => {
    console.log("ClientId from props", clientId);
    console.log(
      "useEffect orderId",
      orderId,
      "loading",
      loading,
      "successPay",
      successPay,
      "order",
      order
    );

    const addPaypalScript = async () => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (orderId && !loading) {
      if (!order || order._id !== orderId || successPay) {
        console.log("dispatch reset");
        dispatch(orderPaySlice.actions.reset());
        console.log("dispatch loading", orderId);
        dispatch(getOrderDetails(orderId));
      } else if (!order.isPaid) {
        // @ts-ignore: this is added by the paypal script
        if (!window.paypal) {
          addPaypalScript();
        } else {
          setSdkReady(true);
        }
      }
    }
  }, [orderId, dispatch, order, clientId, successPay]);
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

  const successPaymentHandler = useCallback(
    (paymentResult) => {
      console.log("paymentResult", paymentResult);
      dispatch(payOrder({ orderId, paymentResult }));
    },
    [dispatch, orderId]
  );

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
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    ></PayPalButton>
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return { props: { clientId: process.env.PAYPAL_CLIENT_ID } };
};
export default OrderScreen;
