import React from "react";
import { FunctionComponent } from "react";
import { Alert } from "react-bootstrap";
import { Variant } from "react-bootstrap/esm/types";

interface MessageProps {
  variant?: Variant;
}
const Message: FunctionComponent<MessageProps> = ({
  variant = "info",
  children,
}) => {
  return <Alert variant={variant}>{children}</Alert>;
};

export default Message;
