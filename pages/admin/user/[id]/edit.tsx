import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FunctionComponent, SyntheticEvent, useCallback, useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useSelector } from 'react-redux'

import FormContainer from '../../../../components/FormContainer'
import Loader from '../../../../components/Loader'
import Message from '../../../../components/Message'
import { getUserDetails, UserDetailsState } from '../../../../frontend/reducers/userReducers'
import { RootState, useAppDispatch } from '../../../../frontend/store'

const UserEditScreen: FunctionComponent = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  const router = useRouter()
  const dispatch = useAppDispatch()

  const userDetails = useSelector((state: RootState) => state.userDetails as UserDetailsState)
  const { loading, user, error } = userDetails
  const userId = router.query.id as string

  useEffect(() => {
    if (userId) {
      if (!user?.name || user?._id !== userId) {
        dispatch(getUserDetails(userId))
      } else if (user) {
        setName(user.name)
        setEmail(user.email)
        setIsAdmin(user.isAdmin)
      }
    }
  }, [user, userId, dispatch])

  const submitHandler = useCallback((e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
  }, [])

  return (
    <>
      <Link href="/admin/userlist">
        <div className="btn btn-light my-3">Go Back</div>
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
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
            <Form.Group controlId="isadmin">
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.currentTarget.checked)}
              ></Form.Check>
            </Form.Group>
            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default UserEditScreen
