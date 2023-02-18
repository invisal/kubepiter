import type { NextPage } from "next";
import BuildLogList from "../../src/components/BuildLogList";
import MasterLayout from "../../src/layout/MasterLayout";

const BuildLogsPage: NextPage = () => {
  return (
    <MasterLayout>
      <BuildLogList />
    </MasterLayout>
  );
};

export default BuildLogsPage;
