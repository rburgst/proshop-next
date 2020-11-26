import React, { SyntheticEvent, useCallback, useState } from "react";
import { FunctionComponent } from "react";
import { Button, Form } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useAppDispatch, RootState } from "../frontend/store";
import { cartSlice } from "../frontend/reducers/cartReducers";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const ShippingScreen: FunctionComponent = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address);
  const [city, setCity] = useState(shippingAddress?.city);
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode);
  const [country, setCountry] = useState(shippingAddress?.country);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const submitHandler = useCallback(
    (e: SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      dispatch(
        cartSlice.actions.saveShippingAddress({
          address,
          city,
          postalCode,
          country,
        })
      );
      //router.push("/payment");
    },

    [dispatch, router]
  );
  return (
    <FormContainer>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            placeholder="Enter address"
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="city">
          <Form.Label>City</Form.Label>
          <Form.Control
            placeholder="Enter city"
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="postalCode">
          <Form.Label>Postal Code </Form.Label>
          <Form.Control
            placeholder="Enter postal code"
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="country">
          <Form.Label>Country</Form.Label>
          <Form.Control
            placeholder="Enter country"
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
