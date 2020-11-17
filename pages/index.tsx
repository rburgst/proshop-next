import Head from "next/head";
import styles from "../styles/Home.module.css";

import { Col, Row } from "react-bootstrap";
import Product from "../components/Product";
import { useEffect, useState } from "react";
import fetch from "isomorphic-unfetch";
import { useAppDispatch } from "../frontend/store";
import productListSlice from "../frontend/reducers/productReducers";
import { fetchProducts } from "../frontend/reducers/productReducers";
const Home = () => {
  const dispatch = useAppDispatch();
  const products = [];

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <>
      <h1>Latest Products</h1>
      <Row>
        {products.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Home;
