import React, { useCallback } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../frontend/store";
import { userLoginSlice } from "../frontend/reducers/userReducers";

const Header = () => {
  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo } = userLogin;
  const dispatch = useAppDispatch();
  const logoutHandler = useCallback(() => {
    dispatch(userLoginSlice.actions.logout());
  }, [dispatch]);
  return (
    <header>
      <Navbar bg="dark" variant="dark" collapseOnSelect expand="lg">
        <Container>
          <Link href="/">
            <Navbar.Brand>ProShop</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Link href="/products">
                <Nav.Link as="a" href="/products">
                  <i className="fas fa-shopping-cart"></i> Products
                </Nav.Link>
              </Link>
              <Link href="/cart">
                <Nav.Link as="a" href="/cart">
                  <i className="fas fa-shopping-cart"></i> Cart
                </Nav.Link>
              </Link>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <Link href="/profile">
                    <NavDropdown.Item as="a" href="/profile">
                      Profile
                    </NavDropdown.Item>
                  </Link>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Link href="/login">
                  <Nav.Link as="a" href="/login">
                    <i className="fas fa-user"></i> Login
                  </Nav.Link>
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
