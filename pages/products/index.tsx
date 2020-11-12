import Head from "next/head";
import styles from "../styles/Home.module.css";
import { GetServerSideProps } from "next";

import { Col, Row } from "react-bootstrap";
import Product from "../../components/Product";
import { FunctionComponent, useEffect, useState } from "react";
import { IProduct } from "../api/data/products";
import connectDB from "../../server/config/db";
import ProductModel from "../../server/models/productModel";

interface ProductsProps {
  products: IProduct[];
}

const Home: FunctionComponent<ProductsProps> = ({ products }) => {
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const mongoose = await connectDB();
  console.log("get server props");
  const products = await ProductModel.find({}).lean();
  const leanProducts = products.map((product) => ({
    ...product,
    _id: product._id.toString(),
    user: product.user.toString(),
    createdAt: product.createdAt.toString(),
    updatedAt: product.updatedAt.toString(),
  }));

  return {
    props: {
      products: leanProducts,
    }, // will be passed to the page component as props
  };
};

export default Home;
