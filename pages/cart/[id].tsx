import Link from "next/link";
import { useRouter } from "next/router";
import React, { FunctionComponent } from "react";
import { useEffect } from "react";
import { useAppDispatch } from "../../frontend/store";
import { addToCart } from "../../frontend/reducers/cartReducers";

interface CartScreenProps {}

const CartScreen: FunctionComponent<CartScreenProps> = () => {
  const router = useRouter();
  const { id, qty } = router.query;

  const dispatch = useAppDispatch();
  useEffect(() => {
    const actualQty = qty ? Number(qty) : 1;
    if (id) {
      dispatch(addToCart({ productId: id as string, qty: actualQty }));
    }
    router.push("/cart");
  }, [id, qty, dispatch]);

  return (
    <>
      <Link href="/">
        <a className="btn btn-light my-3">Go Back</a>
      </Link>
      <h3>Cart</h3>
      <ul>
        <li>id: {id}</li>
        <li>qty: {qty}</li>
      </ul>
    </>
  );
};

export default CartScreen;
