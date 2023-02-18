import { SkeletonText } from "@carbon/react";
import { useRouter } from "next/router";
import ReactAnsi from "react-ansi";
import MasterLayout from "src/layout/MasterLayout";
import useApiPod from "src/hooks/useApiPod";
import useApiPodLog from "src/hooks/useApiPodLog";
import Card from "src/components/Card";
import StatusLightBall from "src/components/StatusLightBall";

export default function PodLogPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: pod } = useApiPod({ name: id as string });
  const { data: podLog } = useApiPodLog({ name: id as string });

  return (
    <MasterLayout>
      <div>
        <Card>
          <h1 style={{ marginBottom: "0.5rem" }}>Pod Log</h1>
          <div
            style={{
              lineHeight: "1.5rem",
              fontSize: "0.9rem",
            }}
          >
            {pod?.pod?.name ? <div>{pod?.pod.name}</div> : <SkeletonText />}
            {pod?.pod?.status ? (
              <div>
                <StatusLightBall status={pod?.pod.status || ""} />
                &nbsp;&nbsp;
                {pod?.pod.status}
              </div>
            ) : (
              <SkeletonText />
            )}
          </div>
        </Card>

        <div style={{ height: "600px" }}>
          <ReactAnsi
            log={podLog?.podLog || ""}
            logStyle={{ height: "600px" }}
            autoScroll
            bodyStyle={{ overflowY: "auto", fontSize: "14px" }}
          />
        </div>
      </div>
    </MasterLayout>
  );
}
