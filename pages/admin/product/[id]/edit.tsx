import fetch from 'isomorphic-unfetch'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, {
  ChangeEvent,
  FunctionComponent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { Button, Form } from 'react-bootstrap'
import { useSelector } from 'react-redux'

import FormContainer from '../../../../components/FormContainer'
import Loader from '../../../../components/Loader'
import Message from '../../../../components/Message'
import {
  fetchProduct,
  ProductDetailsState,
  productUpdateSlice,
  ProductUpdateState,
  updateProduct,
} from '../../../../frontend/reducers/productReducers'
import { UserLoginState } from '../../../../frontend/reducers/userReducers'
import { RootState, useAppDispatch } from '../../../../frontend/store'
import { IProductWithId } from '../../../../server/models/productModel'

const ProductEditScreen: FunctionComponent = () => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [uploading, setUploading] = useState(false)

  const router = useRouter()
  const dispatch = useAppDispatch()

  const userLogin = useSelector((state: RootState) => state.userLogin as UserLoginState)
  const { userInfo } = userLogin
  const productDetails = useSelector(
    (state: RootState) => state.productDetails as ProductDetailsState
  )
  const { loading, product, error } = productDetails

  const productUpdate = useSelector((state: RootState) => state.productUpdate as ProductUpdateState)
  const { loading: loadingUpdate, success: successUpdate, error: errorUpdate } = productUpdate
  const productId = router.query.id as string

  // when we first enter the screen make sure that everything is reset
  useEffect(() => {
    dispatch(productUpdateSlice.actions.reset())
  }, [dispatch])

  useEffect(() => {
    if (productId) {
      if (successUpdate) {
        dispatch(productUpdateSlice.actions.reset())
        router.push('/admin/productlist')
      } else {
        if (!product?.name || product?._id !== productId) {
          dispatch(fetchProduct(productId))
        } else if (product) {
          setName(product.name)
          setBrand(product.brand)
          setCategory(product.category)
          setCountInStock(product.countInStock)
          setDescription(product.description)
          setImage(product.image)
          setPrice(product.price)
        }
      }
    }
  }, [product, productId, dispatch, router, successUpdate])

  const uploadFileHandler = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) {
        throw new Error('no file provided')
      }
      const formData = new FormData()
      formData.append('image', file)
      setUploading(true)
      try {
        const token = userInfo?.token
        if (!token) {
          throw new Error('no auth')
        }
        const response = await fetch(`/api/upload`, {
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: 'POST',
        })
        const data = await response.text()
        setImage(data)
        setUploading(false)
      } catch (error) {
        console.error('error uploading', error)
        setUploading(false)
      }
    },
    [userInfo]
  )
  const submitHandler = useCallback(
    (e: SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault()
      dispatch(
        updateProduct({
          _id: productId,
          name,
          brand,
          image,
          category,
          countInStock,
          description,
          price,
        } as IProductWithId)
      )
    },
    [dispatch, productId, name, brand, image, category, countInStock, description, price]
  )

  return (
    <>
      <Link href="/admin/productlist">
        <div className="btn btn-light my-3">Go Back</div>
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

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
                onChange={(e) => setName(e.currentTarget.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(Number(e.currentTarget.value))}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                placeholder="Enter image"
                value={image}
                onChange={(e) => setImage(e.currentTarget.value)}
              ></Form.Control>
              <Form.File id="image-file" label="Choose file" custom onChange={uploadFileHandler} />

              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.currentTarget.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock">
              <Form.Label>Count in stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter count in stock"
                value={countInStock}
                onChange={(e) => setCountInStock(Number(e.currentTarget.value))}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.currentTarget.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>description</Form.Label>
              <Form.Control
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.currentTarget.value)}
              ></Form.Control>
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

export default ProductEditScreen
