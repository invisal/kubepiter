import { PropsWithChildren } from "react";

export default function Card(props: PropsWithChildren<unknown>) {
  return <div className="card">{props.children}</div>;
}
