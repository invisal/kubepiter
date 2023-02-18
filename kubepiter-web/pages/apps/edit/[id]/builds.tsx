import { useRouter } from "next/router";
import BuildLogList from "../../../../src/components/BuildLogList";
import { GqlApp } from "../../../../src/generated/graphql";
import AppLayout from "../../../../src/layout/AppLayout";
import MasterLayout from "../../../../src/layout/MasterLayout";

function AppBuildLogBody({ data }: { data: GqlApp }) {
  return (
    <BuildLogList
      appId={data.id || ""}
      showAction={true}
      currentVersion={data.currentVersion || 0}
    />
  );
}

export default function AppBuildLogPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <MasterLayout withoutInnerContent>
      <AppLayout id={id as string} bodyComponent={AppBuildLogBody} />
    </MasterLayout>
  );
}
