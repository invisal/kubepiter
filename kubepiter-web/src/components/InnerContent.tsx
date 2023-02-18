import { PropsWithChildren } from "react";

export default function InnerContent(props: PropsWithChildren<unknown>) {
  return <div className="home-container">{props.children}</div>;
}
