import Link from "next/link";
import { useRouter } from "next/router";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  ListGroup,
  Row,
} from "react-bootstrap";
import Rating from "../../components/Rating";
import products from "../api/data/products";
import { IProduct } from "../api/data/products";
import { useAppDispatch, RootState } from "../../frontend/store";
import { fetchProduct } from "../../frontend/reducers/productReducers";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

interface ProductScreenProps {}

const ProductScreen: FunctionComponent<ProductScreenProps> = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useAppDispatch();
  const productDetails = useSelector(
    (state: RootState) => state.productDetails
  );
  const { loading, product, error } = productDetails;

  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id as string));
    }
  }, [id, dispatch]);

  const addToCartHandler = useCallback(() => {
    router.push(`/cart/${id}?qty=${qty}`);
  }, [router, id, qty]);

  return (
    <>
      <Link href="/">
        <a className="btn btn-light my-3">Go Back</a>
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          <Col md={6}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>
          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </ListGroup.Item>
              <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
              <ListGroup.Item>
                Description: ${product.description}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qty</Col>
                      <Col>
                        <Form.Control
                          as="select"
                          value={qty}
                          onChange={(e) => setQty(parseInt(e.target.value))}
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}

                <ListGroup.Item>
                  <Button
                    type="button"
                    className={"btn-block"}
                    disabled={product.countInStock === 0}
                    onClick={addToCartHandler}
                  >
                    Add To Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProductScreen;
