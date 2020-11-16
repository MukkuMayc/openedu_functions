import Hello from "./components/Hello";
import { h, render } from "preact";

render(
  <Hello compiler="hello" framework="world" />,
  document.getElementById("root")!
);
