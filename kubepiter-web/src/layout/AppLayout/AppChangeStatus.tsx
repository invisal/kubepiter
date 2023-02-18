import { Button, InlineLoading } from "@carbon/react";
import { useEffect, useState } from "react";
import NextLink from "src/components/NextLink";
import { GqlApp, GqlBuildJob, Maybe } from "src/generated/graphql";
import useApiBuildLogList from "src/hooks/useApiBuildLogList";
import useApiBuildQueueChange from "src/hooks/useApiBuildQueueChange";
import useApiDeployApp from "src/hooks/useApiDeployApp";

function AppBuilding({ build }: { build: Maybe<GqlBuildJob> }) {
  return (
    <div className="mb-4 bg-support-warning p-4">
      <div className="flex">
        <div>
          <InlineLoading />
        </div>
        <div
          style={{
            alignContent: "center",
            justifyContent: "center",
            justifyItems: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <div className="text-sm">
            We are building your app. Check the building log{" "}
            <NextLink href={`/build_logs/view/${build?.id}`}>here</NextLink> for
            more information.
          </div>
        </div>
      </div>
    </div>
  );
}

function AppQueueBuilding({ qty }: { qty: number }) {
  if (qty < 0) return <div />;

  return (
    <div className="mb-4 bg-field-01 p-4">
      <div className="flex">
        <div>
          <InlineLoading />
        </div>
        <div
          style={{
            alignContent: "center",
            justifyContent: "center",
            justifyItems: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <div className="text-sm">
            Your build is in the queue. <strong>{qty} more build</strong> before
            your build
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppChangeStatus({ app }: { app: GqlApp }) {
  const [hasChange, setHasChange] = useState(app.hasChanged);
  const [deployApp] = useApiDeployApp();
  const { data: buildLogsData, refetch } = useApiBuildLogList({
    status: ["RUNNING", "PENDING"],
  });
  const { data: buildQueueChangedData } = useApiBuildQueueChange();

  useEffect(() => {
    refetch();
  }, [buildQueueChangedData, refetch]);

  useEffect(() => {
    if (app) {
      setHasChange(app.hasChanged);
    }
  }, [app]);

  const buildLogList = [...(buildLogsData?.buildLogs || [])].reverse();

  const yourQueueNumber = buildLogList.findIndex(
    (log) => log?.appId === app.id
  );

  const onRebuildClicked = () => {
    setHasChange(false);
    deployApp({
      variables: {
        id: app.id || "",
        build: true,
        deploy: true,
      },
    })
      .then()
      .catch();
  };

  const onDeployClicked = () => {
    setHasChange(false);
    deployApp({
      variables: {
        id: app.id || "",
        build: false,
        deploy: true,
      },
    })
      .then()
      .catch();
  };

  return (
    <>
      {yourQueueNumber === 0 ? (
        <AppBuilding build={buildLogList[0]} />
      ) : (
        <AppQueueBuilding qty={yourQueueNumber} />
      )}
      {hasChange && yourQueueNumber < 0 && (
        <div className="mb-4 bg-support-warning p-4">
          <h4>App Changed</h4>
          <div className="mt-3 mb-3 text-sm">
            You have changed some app configuration. You may need to re-deploy
            to apply the change
          </div>
          <Button size="sm" onClick={onDeployClicked}>
            Deploy
          </Button>
          &nbsp;
          <Button size="sm" onClick={onRebuildClicked}>
            Build and Deploy
          </Button>
        </div>
      )}
    </>
  );
}
