import Link from "next/link";
import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../frontend/store";

interface CartScreenRouteParams {
  id: string;
}
interface CartScreenProps {}

const CartScreen: FunctionComponent<CartScreenProps> = () => {
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  return (
    <>
      <Link href="/">
        <a className="btn btn-light my-3">Go Back</a>
      </Link>
      <h3>Cart Overview {cartItems.length} items</h3>
      <ul>
        {cartItems.map((item) => (
          <li>
            {item.name}: {item.qty}
          </li>
        ))}
      </ul>
    </>
  );
};

export default CartScreen;
