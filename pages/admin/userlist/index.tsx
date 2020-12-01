import React, { useCallback, useEffect } from "react";
import { FunctionComponent } from "react";
import { RootState, useAppDispatch } from "../../../frontend/store";
import { useSelector } from "react-redux";
import {
  listUsers,
  UserListState,
} from "../../../frontend/reducers/userReducers";
import Loader from "../../../components/Loader";
import Message from "../../../components/Message";
import { Button, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const ListUsersScreen: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const userList = useSelector(
    (state: RootState) => state.userList as UserListState
  );
  const { loading, error, users } = userList;

  useEffect(() => {
    dispatch(listUsers());
  }, [dispatch]);

  const deleteHandler = useCallback(
    (userId) => {
      console.log("deleting user", userId);
    },
    [users, dispatch]
  );
  return (
    <>
      <h1>List Users</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className={"table-sm"}>
          <thead>
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>ADMIN</th>
            <th></th>
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
                  <Link href={`/users/${user._id}`}>
                    <Button
                      variant="light"
                      as="a"
                      href={`/users/${user._id}`}
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
  );
};

export default ListUsersScreen;
