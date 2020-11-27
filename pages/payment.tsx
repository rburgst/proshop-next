import React, { SyntheticEvent, useCallback, useState } from "react";
import { FunctionComponent, useEffect } from "react";
import { Button, Col, Form } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useAppDispatch, RootState } from "../frontend/store";
import { cartSlice } from "../frontend/reducers/cartReducers";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import CheckoutSteps from "../components/CheckoutSteps";

const PaymentScreen: FunctionComponent = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!shippingAddress) {
      router.push("/shipping");
    }
  }, [router, shippingAddress]);

  const submitHandler = useCallback(
    (e: SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      dispatch(cartSlice.actions.savePaymentMethod(paymentMethod));
      router.push("/placeorder");
    },

    [dispatch, router, paymentMethod]
  );
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h2>Shipping</h2>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="paymentMethod">
          <Form.Label as="legend">Payment Method</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              label="PayPal or Credit Card"
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
            <Form.Check
              type="radio"
              label="Stripe"
              id="Stripe"
              name="paymentMethod"
              value="Stripe"
              onChange={(e: SyntheticEvent<HTMLInputElement>) =>
                setPaymentMethod(e.currentTarget.value)
              }
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
