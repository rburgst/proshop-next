import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FunctionComponent, useCallback, useEffect } from 'react'
import { Button, Table } from 'react-bootstrap'
import { useSelector } from 'react-redux'

import Loader from '../../../components/Loader'
import Message from '../../../components/Message'
import {
  deleteUser,
  listUsers,
  UserDeleteState,
  UserListState,
  UserLoginState,
} from '../../../frontend/reducers/userReducers'
import { RootState, useAppDispatch } from '../../../frontend/store'

const ListUsersScreen: FunctionComponent = () => {
  const dispatch = useAppDispatch()
  const userList = useSelector((state: RootState) => state.userList as UserListState)
  const { loading, error, users } = userList
  const userLogin = useSelector((state: RootState) => state.userLogin as UserLoginState)
  const { userInfo } = userLogin
  const userDelete = useSelector((state: RootState) => state.userDelete as UserDeleteState)
  const { success: successDelete } = userDelete

  const router = useRouter()

  useEffect(() => {
    if (userInfo) {
      if (userInfo.isAdmin) {
        dispatch(listUsers())
      } else {
        router.push('/login')
      }
    }
  }, [router, dispatch, userInfo, successDelete])

  const deleteHandler = useCallback(
    (userId) => {
      if (window.confirm('Are you sure')) {
        dispatch(deleteUser(userId))
      }
    },
    [dispatch]
  )
  return (
    <>
      <h1>List Users</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className={'table-sm'}>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={user.email}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <FontAwesomeIcon icon="check" color="green" />
                  ) : (
                    <FontAwesomeIcon icon="times" color="red" />
                  )}
                </td>
                <td>
                  <Link href={`/admin/user/${user._id}/edit`}>
                    <Button
                      variant="light"
                      as="a"
                      href={`/admin/user/${user._id}/edit`}
                      className="btn-sm"
                    >
                      <FontAwesomeIcon icon="edit" />
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(user._id)}
                  >
                    <FontAwesomeIcon icon="trash" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default ListUsersScreen
