import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FormEvent, FunctionComponent, useCallback, useEffect, useState } from 'react'
import { Button, Card, Col, Form, Image, ListGroup, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'

import Loader from '../../components/Loader'
import Message from '../../components/Message'
import Rating from '../../components/Rating'
import {
  createProductReview,
  createProductReviewSlice,
  fetchProduct,
  ProductCreateReviewState,
} from '../../frontend/reducers/productReducers'
import { UserLoginState } from '../../frontend/reducers/userReducers'
import { RootState, useAppDispatch } from '../../frontend/store'
import { IReview } from '../../server/models/productModel'

interface IReviewWithTimestamp extends IReview {
  createdAt: string
  _id: string
}
const ProductScreen: FunctionComponent = () => {
  const router = useRouter()
  const { id } = router.query
  const dispatch = useAppDispatch()
  const productDetails = useSelector((state: RootState) => state.productDetails)
  const { loading, product, error } = productDetails
  const reviews: IReviewWithTimestamp[] = product?.review ?? []

  const productReviewCreate = useSelector(
    (state: RootState) => state.createProductReview as ProductCreateReviewState
  )
  const { success: successProduceReview, error: errorProductReview } = productReviewCreate

  const userLogin = useSelector((state: RootState) => state.userLogin as UserLoginState)
  const { userInfo } = userLogin

  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  useEffect(() => {
    if (successProduceReview) {
      dispatch(createProductReviewSlice.actions.reset())
      alert('Review submitted!')
      setRating(0)
      setComment('')
    }
    if (id) {
      dispatch(fetchProduct(id as string))
    }
  }, [id, dispatch, successProduceReview])

  const addToCartHandler = useCallback(() => {
    router.push(`/cart/${id}?qty=${qty}`)
  }, [router, id, qty])

  const submitHandler = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      dispatch(createProductReview({ productId: id as string, comment, rating }))
    },
    [dispatch, id, comment, rating]
  )

  return (
    <>
      <Link href="/">
        <a className="btn btn-light my-3">Go Back</a>
      </Link>
      {loading || !product ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
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
                  <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>Description: ${product.description}</ListGroup.Item>
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
                      <Col>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</Col>
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
                      className={'btn-block'}
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
          <Row>
            <Col md={6}>
              <h2>Reviews</h2>
              {reviews.length === 0 && <Message>No reviews</Message>}
              <ListGroup variant="flush">
                {reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Write a customer review</h2>
                  {errorProductReview && <Message variant="danger">{errorProductReview}</Message>}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(Number(e.currentTarget.value))}
                        >
                          <option value="">Select</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          value={comment}
                          onChange={(e) => setComment(e.currentTarget.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button type="submit" variant="primary">
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link href="/login">sign in</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default ProductScreen
