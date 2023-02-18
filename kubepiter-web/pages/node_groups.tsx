import { Tab, TabList, TabPanels, TabPanel, Tabs } from "@carbon/react";
import type { NextPage } from "next";
import { useEffect } from "react";
import MasterLayout from "../src/layout/MasterLayout";

function Panel1() {
  useEffect(() => {
    console.log("panel 1 mounted");
  }, []);

  return <div>Panel 1</div>;
}

function Panel2() {
  useEffect(() => {
    console.log("panel 2 mounted");
    () => console.log("panel 2 unmount");
  }, []);

  return <div>Panel 2</div>;
}

const NodeGroupPage: NextPage = () => {
  return (
    <MasterLayout>
      <div>Coming Soon</div>
    </MasterLayout>
  );
};

export default NodeGroupPage;
