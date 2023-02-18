import { Link as CarbonLink } from "@carbon/react";
import Link from "next/link";
import { PropsWithChildren } from "react";

export default function NextLink(props: PropsWithChildren<{ href: string }>) {
  return (
    <Link href={props.href} passHref>
      <CarbonLink>{props.children}</CarbonLink>
    </Link>
  );
}
