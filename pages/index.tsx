import Head from "next/head";
import styles from "../styles/Home.module.css";

import { Col, Row } from "react-bootstrap";
import Product from "../components/Product";
import { useEffect, useState } from "react";
import fetch from "isomorphic-unfetch";
import { useAppDispatch, RootState } from "../frontend/store";
import { fetchProducts } from "../frontend/reducers/productReducers";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
const Home = () => {
  const dispatch = useAppDispatch();
  const productList = useSelector((state: RootState) => state.productList);
  const { loading, products, error } = productList;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <>
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default Home;
