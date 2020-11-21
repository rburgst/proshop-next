import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import Link from "next/link";

const Header = () => {
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
              <Link href="/login">
                <Nav.Link>
                  <i className="fas fa-user"></i> Login
                </Nav.Link>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
