import * as React from "react";
import "./ErrorMessage.css";

const ErrorMessage = (props: { message: React.ReactNode }) => {
  return <div className="err-mes">{props.message}</div>;
};

export default ErrorMessage;
