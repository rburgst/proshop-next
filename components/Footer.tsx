import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const Footer = () => {
  return (
    <footer>
      <Row>
        <Col className="text-center py-3">
          <Container>Copyright &copy; ProShop</Container>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
