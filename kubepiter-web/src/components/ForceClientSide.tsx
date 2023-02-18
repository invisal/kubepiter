import { PropsWithChildren, useEffect, useState } from "react";
import useScript from "../hooks/useScript";

export default function ForceClientSide(props: PropsWithChildren<unknown>) {
  const state = useScript("/api/config");

  if (state === "ready") {
    return <div>{props.children}</div>;
  }

  return <div />;
}
