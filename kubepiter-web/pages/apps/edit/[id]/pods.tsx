import {
  SkeletonText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@carbon/react";
import { useRouter } from "next/router";
import NextLink from "src/components/NextLink";
import StatusLightBall from "src/components/StatusLightBall";
import { GqlApp, GqlPod } from "src/generated/graphql";
import useApiPodList from "src/hooks/useApiPodList";
import AppLayout from "src/layout/AppLayout";
import MasterLayout from "src/layout/MasterLayout";

function AppPodLoadingRows() {
  return (
    <>
      <TableRow>
        <TableCell>
          <SkeletonText />
        </TableCell>
        <TableCell>
          <SkeletonText />
        </TableCell>
        <TableCell>
          <SkeletonText />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <SkeletonText />
        </TableCell>
        <TableCell>
          <SkeletonText />
        </TableCell>
        <TableCell>
          <SkeletonText />
        </TableCell>
      </TableRow>
    </>
  );
}

function AppPodRows({ pods }: { pods: GqlPod[] }) {
  return (
    <>
      {pods.map((pod) => (
        <TableRow key={pod.name}>
          <TableCell>
            <StatusLightBall status={pod.status || ""} />
          </TableCell>
          <TableCell>
            <NextLink href={`/pod/${pod.name}`}> {pod.name}</NextLink>
          </TableCell>
          <TableCell>{pod.status}</TableCell>
        </TableRow>
      ))}
    </>
  );
}

function AppPodListBody({ data }: { data: GqlApp }) {
  const { data: podList } = useApiPodList({ appId: data.id || "" });

  return (
    <TableContainer
      title="Pods"
      description="List all pod belongs to this application"
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader style={{ width: 30 }}></TableHeader>
            <TableHeader style={{ width: 350 }}>Pod Name</TableHeader>
            <TableHeader style={{ width: 30 }}>Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {podList?.pods ? (
            <AppPodRows pods={podList.pods as GqlPod[]} />
          ) : (
            <AppPodLoadingRows />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function AppPodsPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <MasterLayout withoutInnerContent>
      <AppLayout id={id as string} bodyComponent={AppPodListBody} />
    </MasterLayout>
  );
}
