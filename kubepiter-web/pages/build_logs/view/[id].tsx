import { InlineLoading, Loading } from "@carbon/react";
import { useRouter } from "next/router";
import { GqlBuildJob } from "../../../src/generated/graphql";
import useApiBuildLog from "../../../src/hooks/useApiBuildLog";
import MasterLayout from "../../../src/layout/MasterLayout";
import ReactAnsi from "react-ansi";
import Card from "../../../src/components/Card";
import { useEffect } from "react";

function BuildLogBody({ data }: { data: GqlBuildJob }) {
  return (
    <div>
      <Card>
        <h1 style={{ marginBottom: "0.5rem" }}>Build Log</h1>
        <div
          style={{
            lineHeight: "1.5rem",
            fontSize: "0.9rem",
          }}
        >
          <strong>Application</strong>
          <br />
          {data.appId} (version: {data.version})
          <br />
          {data.id}
          <br />
          {data.status === "RUNNING" && (
            <InlineLoading status="active" description="Running" />
          )}
          {data.status === "PENDING" && (
            <InlineLoading status="inactive" description="Pending" />
          )}
          {data.status === "FAILED" && (
            <InlineLoading status="error" description="Failed" />
          )}
          {data.status === "SUCCESS" && (
            <InlineLoading status="finished" description="Success" />
          )}
        </div>
      </Card>

      <ReactAnsi
        log={data?.logs || ""}
        logStyle={{ height: "600px" }}
        autoScroll
        bodyStyle={{ height: "100%", overflowY: "auto", fontSize: "14px" }}
      />
    </div>
  );
}

export default function BuildLogPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data, startPolling, stopPolling } = useApiBuildLog(id as string);
  const status = data?.buildLog?.status;

  useEffect(() => {
    if (status !== "SUCCESS" && status !== "FAILED") {
      startPolling(2000);
      return () => stopPolling();
    }
  }, [status, startPolling, stopPolling]);

  return (
    <MasterLayout>
      {data ? (
        data.buildLog ? (
          <BuildLogBody data={data.buildLog} />
        ) : (
          <div>Application does not exist</div>
        )
      ) : (
        <Loading />
      )}
    </MasterLayout>
  );
}
