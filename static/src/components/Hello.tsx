import * as React from "react";

export interface HelloProps {
  compiler: string;
  framework: string;
}

export interface HelloProps {
  compiler: string;
  framework: string;
}

const Hello: React.FunctionComponent<HelloProps> = (props) => {
  return <div>{`Hello from ${props.compiler} ${props.framework}`}</div>;
};

export default Hello;
// </helloprops,>
