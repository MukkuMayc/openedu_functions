import React from "react";
import "./Loading.css";

export interface ILoadingProps {}

const Loading: React.FC<ILoadingProps> = ({}) => {
  return (
    <div className="Loading container d-flex flex-column align-items-center">
      <h2>Loading...</h2>
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export { Loading };
