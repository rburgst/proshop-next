import Link from "next/link";
import React, { FunctionComponent } from "react";

interface CartScreenRouteParams {
  id: string;
}
interface CartScreenProps {}

const CartScreen: FunctionComponent<CartScreenProps> = () => {
  return (
    <>
      <Link href="/">
        <a className="btn btn-light my-3">Go Back</a>
      </Link>
      <h3>Cart</h3>
    </>
  );
};

export default CartScreen;
