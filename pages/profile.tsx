import Link from "next/link";
import { useRouter } from "next/router";
import React, {
  FunctionComponent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  registerUser,
  getUserDetails,
} from "../frontend/reducers/userReducers";
import { RootState, useAppDispatch } from "../frontend/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  OrderListMyState,
  listMyOrders,
} from "../frontend/reducers/orderReducers";
import {
  updateUserProfile,
  userUpdateProfileSlice,
} from "../frontend/reducers/userReducers";
import { time } from "console";

export interface ProfileScreenProps {
  redirect?: string;
}
const ProfileScreen: FunctionComponent<ProfileScreenProps> = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();
  const dispatch = useAppDispatch();

  const userDetails = useSelector((state: RootState) => state.userDetails);
  const { loading, user, error } = userDetails;
  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo } = userLogin;
  const userUpdateProfile = useSelector(
    (state: RootState) => state.userUpdateProfile
  );
  const { success } = userUpdateProfile;
  const orderListMy = useSelector(
    (state: RootState) => state.orderListMy as OrderListMyState
  );
  const {
    loading: loadingMyOrders,
    error: errorMyOrders,
    orders,
  } = orderListMy;

  useEffect(() => {
    // redirect to login if not logged in
    if (!userInfo) {
      router.push("/login");
    }
    if (!user?.name || success) {
      // dont have user details yet or we have updated the user profile
      dispatch(userUpdateProfileSlice.actions.reset());
      dispatch(getUserDetails("profile"));
      dispatch(listMyOrders());
    } else {
      setName(user.name);
      setEmail(user.email);
    }
  }, [userInfo, success, user, router, dispatch]);

  const submitHandler = useCallback(
    (e: SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log("confirm", confirmPassword, "password", password);
      if (confirmPassword !== password) {
        setMessage("Passwords do not match");
      } else {
        setMessage("");

        dispatch(updateUserProfile({ name, email, password }));
      }
    },
    [dispatch, name, email, password, confirmPassword]
  );

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {message && <Message variant="danger">{message}</Message>}
        {success && <Message variant="success">Profile updated</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type="submit" variant="primary">
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {loadingMyOrders ? (
          <Loader />
        ) : errorMyOrders ? (
          <Message variant="danger">{errorMyOrders}</Message>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.toString().substring(0, 10)
                    ) : (
                      <FontAwesomeIcon icon={"times"} color="red" />
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.isDelivered.toString().substring(0, 10)
                    ) : (
                      <FontAwesomeIcon icon={"times"} color="red" />
                    )}
                  </td>
                  <td>
                    <Link href={`/order/${order._id}`}>
                      <Button
                        as="a"
                        href={`/order/${order._id}`}
                        variant="light"
                        className="btn-sm"
                      >
                        Details
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
