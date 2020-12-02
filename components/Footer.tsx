import React, { FunctionComponent } from 'react'
import { Col, Container, Row } from 'react-bootstrap'

const Footer: FunctionComponent = () => {
  return (
    <footer>
      <Row>
        <Col className="text-center py-3">
          <Container>Copyright &copy; ProShop</Container>
        </Col>
      </Row>
    </footer>
  )
}

export default Footer
