import { ComponentType, PropsWithChildren } from "react";
import styles from "./styles.module.scss";
import InnerContent from "../../components/InnerContent";
import {
  ActionableNotification,
  Button,
  Loading,
  OverflowMenu,
  OverflowMenuItem,
  Tab,
  TabList,
  Tabs,
} from "@carbon/react";
import { GqlApp } from "../../generated/graphql";
import useApiApp from "../../hooks/useApiApp";
import { useRouter } from "next/router";
import * as Icons from "@carbon/icons-react";
import useApiDeployApp from "../../hooks/useApiDeployApp";
import AppChangeStatus from "./AppChangeStatus";

export default function AppLayout(
  props: PropsWithChildren<{
    id: string;
    bodyComponent: ComponentType<{ data: GqlApp }>;
  }>
) {
  const router = useRouter();
  const [deployApp, { loading: deployAppLoading }] = useApiDeployApp();
  const { data } = useApiApp(props.id);

  if (!data) return <Loading />;
  if (!data.app) return <Loading />;

  let selectIndex = 0;
  const pathSplit = router.pathname.split("/");
  const pathLastToken = pathSplit[pathSplit.length - 1];

  if (pathLastToken === "ingress") selectIndex = 1;
  if (pathLastToken === "env") selectIndex = 2;
  if (pathLastToken === "builds") selectIndex = 3;
  if (pathLastToken === "pods") selectIndex = 4;

  const onRebuildClicked = () => {
    deployApp({
      variables: {
        id: props.id,
        build: true,
        deploy: true,
      },
    })
      .then()
      .catch();
  };

  const onDeployClicked = () => {
    deployApp({
      variables: {
        id: props.id,
        build: false,
        deploy: true,
      },
    })
      .then()
      .catch();
  };

  return (
    <div>
      {deployAppLoading && <Loading />}

      <div className={styles.banner}>
        <InnerContent>
          <h1>{data.app.name}</h1>
          <span>{data.app.id}</span>
        </InnerContent>
      </div>
      <div className={styles.tabs}>
        <InnerContent>
          <div>
            <div className="flex">
              <div>
                <Tabs selectedIndex={selectIndex}>
                  <TabList aria-label="App" activation="manual" contained>
                    <Tab onClick={() => router.push(`/apps/edit/${props.id}`)}>
                      Application
                    </Tab>
                    <Tab
                      onClick={() =>
                        router.push(`/apps/edit/${props.id}/ingress`)
                      }
                    >
                      Ingress
                    </Tab>
                    <Tab
                      onClick={() => router.push(`/apps/edit/${props.id}/env`)}
                    >
                      Environment
                    </Tab>
                    <Tab
                      onClick={() =>
                        router.push(`/apps/edit/${props.id}/builds`)
                      }
                    >
                      Build Log
                    </Tab>
                    <Tab
                      onClick={() => router.push(`/apps/edit/${props.id}/pods`)}
                    >
                      Pods
                    </Tab>
                  </TabList>
                </Tabs>
              </div>

              <OverflowMenu
                size="lg"
                renderIcon={Icons.OverflowMenuHorizontal}
                iconDescription="More"
                light
              >
                <OverflowMenuItem
                  onClick={onRebuildClicked}
                  itemText="Build & Deploy"
                />
                <OverflowMenuItem onClick={onDeployClicked} itemText="Deploy" />
                <OverflowMenuItem itemText="Kubernetes YAML" />
                <OverflowMenuItem hasDivider isDelete itemText="Delete app" />
              </OverflowMenu>
            </div>
          </div>
        </InnerContent>
      </div>
      <InnerContent>
        <AppChangeStatus app={data.app} />
        <props.bodyComponent data={data.app} />
      </InnerContent>
    </div>
  );
}
