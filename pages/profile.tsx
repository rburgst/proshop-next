import Link from "next/link";
import { useRouter } from "next/router";
import React, {
  FunctionComponent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  registerUser,
  getUserDetails,
} from "../frontend/reducers/userReducers";
import { RootState, useAppDispatch } from "../frontend/store";

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
  const redirect = (router.query.redirect as string) ?? "/";
  const dispatch = useAppDispatch();

  const userDetails = useSelector((state: RootState) => state.userDetails);
  const { loading, user, error } = userDetails;
  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    // redirect to login if not logged in
    if (!userInfo) {
      router.push("/login");
    }
    if (!user?.name) {
      // dont have user details yet
      dispatch(getUserDetails("profile"));
    } else {
      setName(user.name);
      setEmail(user.email);
    }
  }, [userInfo, user, router, dispatch]);

  const submitHandler = useCallback(
    (e: SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log("confirm", confirmPassword, "password", password);
      if (confirmPassword !== password) {
        setMessage("Passwords do not match");
      } else {
        setMessage("");

        // DISPATCH update profile
      }
    },
    [dispatch, name, email, password, confirmPassword]
  );

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {message && <Message variant="danger">{message}</Message>}
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
      </Col>
    </Row>
  );
};

export default ProfileScreen;
