import {
  SideNav,
  SideNavItems,
  Header,
  HeaderName,
  HeaderContainer,
  HeaderMenuButton,
  Content,
  SideNavLink,
} from "@carbon/react";
import * as Icons from "@carbon/icons-react";
import { PropsWithChildren } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import LoginLayout from "./LoginLayout";
import { useUser } from "../providers/UserProvider";
import TopActionButtons from "../components/TopActionButtons";
import InnerContent from "../components/InnerContent";

export default function MasterLayout(
  props: PropsWithChildren<{ withoutInnerContent?: boolean }>
) {
  const router = useRouter();
  const { user } = useUser();

  if (!user) {
    return <LoginLayout />;
  }

  return (
    <div>
      <HeaderContainer
        render={({ isSideNavExpanded, onClickSideNavExpand }) => (
          <>
            <Header aria-labelledby="Kubepiter">
              <HeaderMenuButton
                onClick={onClickSideNavExpand}
                isActive={isSideNavExpanded}
                aria-labelledby=""
                aria-label=""
              />
              <HeaderName prefix="">Kubepiter</HeaderName>

              <TopActionButtons />

              <SideNav
                expanded={isSideNavExpanded}
                aria-label=""
                style={{ borderRight: "1px solid #eee" }}
              >
                <SideNavItems>
                  <Link href="/" passHref>
                    <SideNavLink
                      renderIcon={Icons.CloudMonitoring}
                      href="/"
                      large
                      className={
                        router.pathname === "/"
                          ? "cds--side-nav__link--current"
                          : ""
                      }
                    >
                      Dashboard
                    </SideNavLink>
                  </Link>

                  <Link href="/apps/list" passHref>
                    <SideNavLink
                      renderIcon={Icons.Run}
                      href="/apps/list"
                      large
                      className={
                        router.pathname.indexOf("/apps") === 0
                          ? "cds--side-nav__link--current"
                          : ""
                      }
                    >
                      Apps
                    </SideNavLink>
                  </Link>

                  <Link href="/build_logs" passHref>
                    <SideNavLink
                      renderIcon={Icons.InProgressWarning}
                      href="/build_logs"
                      large
                      className={
                        router.pathname === "/build_logs"
                          ? "cds--side-nav__link--current"
                          : ""
                      }
                    >
                      Builds
                    </SideNavLink>
                  </Link>

                  <Link href="/node_groups" passHref>
                    <SideNavLink
                      renderIcon={Icons.TreeView}
                      href="/node_groups"
                      large
                      className={
                        router.pathname === "/node_groups"
                          ? "cds--side-nav__link--current"
                          : ""
                      }
                    >
                      Node Groups
                    </SideNavLink>
                  </Link>

                  <Link href="/registry" passHref>
                    <SideNavLink
                      renderIcon={Icons.ContainerRegistry}
                      href="/registry"
                      large
                      className={
                        router.pathname === "/registry"
                          ? "cds--side-nav__link--current"
                          : ""
                      }
                    >
                      Registry
                    </SideNavLink>
                  </Link>
                </SideNavItems>
              </SideNav>
            </Header>
            <Content>
              {props.withoutInnerContent ? (
                props.children
              ) : (
                <InnerContent>{props.children}</InnerContent>
              )}
            </Content>
          </>
        )}
      />
    </div>
  );
}
