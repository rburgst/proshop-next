import Link from 'next/link'
import React, { FunctionComponent } from 'react'
import { Nav } from 'react-bootstrap'

interface CheckoutStepsProps {
  step1?: boolean
  step2?: boolean
  step3?: boolean
  step4?: boolean
}
const CheckoutSteps: FunctionComponent<CheckoutStepsProps> = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className="justify-content-center mb-4">
      <Nav.Item>
        {step1 ? (
          <Link href="/login">
            <Nav.Link as="a" href="/login">
              Sign In
            </Nav.Link>
          </Link>
        ) : (
          <Nav.Link disabled>Sign In</Nav.Link>
        )}
      </Nav.Item>
      <Nav.Item>
        {step2 ? (
          <Link href="/shipping">
            <Nav.Link as="a" href="/shipping">
              Shipping
            </Nav.Link>
          </Link>
        ) : (
          <Nav.Link disabled>Shipping</Nav.Link>
        )}
      </Nav.Item>
      <Nav.Item>
        {step3 ? (
          <Link href="/payment">
            <Nav.Link as="a" href="/payment">
              Payment
            </Nav.Link>
          </Link>
        ) : (
          <Nav.Link disabled>Payment</Nav.Link>
        )}
      </Nav.Item>
      <Nav.Item>
        {step4 ? (
          <Link href="/placeorder">
            <Nav.Link as="a" href="/placeorder">
              Place Order
            </Nav.Link>
          </Link>
        ) : (
          <Nav.Link disabled>Place Order</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  )
}

export default CheckoutSteps
