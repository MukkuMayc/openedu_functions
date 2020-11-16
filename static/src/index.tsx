import App from "./components/App";
import { h, render } from "preact";

render(
  <App compiler="hello" framework="world" />,
  document.getElementById("root")!
);
