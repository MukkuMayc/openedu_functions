import * as React from "react";
import "./ButtonWithLoading.css";

const ButtonWithLoading: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ disabled, className, ...others }) => {
  return (
    <button
      disabled={disabled}
      className={`button-with-loading d-flex align-items-center ${className}`}
      {...others}
    >
      {disabled ? (
        <>
          <span className="spinner-border" role="status">
            <span className="sr-only"></span>
          </span>
          <span>Loading...</span>
        </>
      ) : (
        others.children
      )}
    </button>
  );
};

export default ButtonWithLoading;
