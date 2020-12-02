import { useRouter } from 'next/router'
import React, { FunctionComponent, SyntheticEvent, useCallback, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useSelector } from 'react-redux'

import CheckoutSteps from '../components/CheckoutSteps'
import FormContainer from '../components/FormContainer'
import { cartSlice } from '../frontend/reducers/cartReducers'
import { RootState, useAppDispatch } from '../frontend/store'

const ShippingScreen: FunctionComponent = () => {
  const cart = useSelector((state: RootState) => state.cart)
  const { shippingAddress } = cart

  const [address, setAddress] = useState(shippingAddress?.address)
  const [city, setCity] = useState(shippingAddress?.city)
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode)
  const [country, setCountry] = useState(shippingAddress?.country)

  const dispatch = useAppDispatch()
  const router = useRouter()

  const submitHandler = useCallback(
    (e: SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault()
      dispatch(
        cartSlice.actions.saveShippingAddress({
          address,
          city,
          postalCode,
          country,
        })
      )
      router.push('/payment')
    },

    [dispatch, router, address, city, postalCode, country]
  )
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h2>Shipping</h2>
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
  )
}

export default ShippingScreen
