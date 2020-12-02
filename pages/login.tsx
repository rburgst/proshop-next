import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FunctionComponent, SyntheticEvent, useCallback, useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'

import FormContainer from '../components/FormContainer'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { loginUser } from '../frontend/reducers/userReducers'
import { RootState, useAppDispatch } from '../frontend/store'

export interface LoginScreenProps {
  redirect?: string
}
const LoginScreen: FunctionComponent<LoginScreenProps> = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const redirect = (router.query.redirect as string) ?? '/'
  const dispatch = useAppDispatch()

  const userLogin = useSelector((state: RootState) => state.userLogin)
  const { loading, userInfo, error } = userLogin

  useEffect(() => {
    if (userInfo) {
      router.push(redirect)
    }
  }, [userInfo, router, redirect])

  const submitHandler = useCallback(
    (e: SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault()
      dispatch(loginUser({ email, password }))
    },
    [dispatch, email, password]
  )

  return (
    <FormContainer>
      <h1>Sign in</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading ? (
        <Loader />
      ) : (
        <Form onSubmit={submitHandler}>
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
          <Button type="submit" variant="primary">
            Sign in
          </Button>
          <Row className="py-3">
            <Col>
              New Customer?{' '}
              <Link href={redirect ? `/register?redirect=${redirect}` : `/register`}>Register</Link>
            </Col>
          </Row>
        </Form>
      )}
    </FormContainer>
  )
}

export default LoginScreen
