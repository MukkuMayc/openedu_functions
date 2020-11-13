import React from "react";
import ReactDOM from "react-dom";
import Hello from "./components/Hello";

console.log("works!")

ReactDOM.render(
  <React.StrictMode>
    {/* <BrowserRouter> */}
      <Hello compiler="hello" framework="world"/>
    {/* </BrowserRouter> */}
  </React.StrictMode>,
  document.getElementById("root")
);