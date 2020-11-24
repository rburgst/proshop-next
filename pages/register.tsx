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
import { registerUser } from "../frontend/reducers/userReducers";
import { RootState, useAppDispatch } from "../frontend/store";

export interface RegisterScreenProps {
  redirect?: string;
}
const RegisterScreen: FunctionComponent<RegisterScreenProps> = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();
  const redirect = (router.query.redirect as string) ?? "/";
  const dispatch = useAppDispatch();

  const userRegister = useSelector((state: RootState) => state.userRegister);
  const { loading, userInfo, error } = userRegister;

  useEffect(() => {
    if (userInfo) {
      router.push(redirect);
    }
  }, [userInfo, router, redirect]);

  const submitHandler = useCallback(
    (e: SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log("confirm", confirmPassword, "password", password);
      if (confirmPassword !== password) {
        setMessage("Passwords do not match");
      } else {
        setMessage("");

        dispatch(registerUser({ name, email, password }));
      }
    },
    [dispatch, name, email, password, confirmPassword]
  );

  return (
    <FormContainer>
      <h1>Sign up</h1>
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
          Sign in
        </Button>
        <Row className="py-3">
          <Col>
            Have an Account?{" "}
            <Link href={redirect ? `/login?redirect=${redirect}` : `/login`}>
              Login
            </Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  );
};

export default RegisterScreen;
