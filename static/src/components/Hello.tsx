import {h} from "preact";
export interface HelloProps {
  compiler: string;
  framework: string;
}

export interface HelloProps {
  compiler: string;
  framework: string;
}

const Hello = (props: { compiler: string; framework: string; }) => {
  return <div>{`Hello from ${props.compiler} ${props.framework}`}</div>;
};

export default Hello;
