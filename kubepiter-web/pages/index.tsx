import {
  Column,
  FormLabel,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  ProgressBar,
  Tag,
  SkeletonText,
  SkeletonPlaceholder,
} from "@carbon/react";
import type { NextPage } from "next";
import Card from "../src/components/Card";
import { GqlKubeNode, Maybe } from "../src/generated/graphql";
import useApiNodeList from "../src/hooks/useApiNodeList";
import MasterLayout from "../src/layout/MasterLayout";
import GaugeChart from "react-gauge-chart";

function Stats({ nodes }: { nodes: Maybe<GqlKubeNode>[] }) {
  const memoryTotalCapacity =
    nodes.reduce((a, b) => a + Number(b?.memoryUsage?.capacity), 0) /
    1073741824;
  const memoryTotalRequest =
    nodes.reduce((a, b) => a + Number(b?.memoryUsage?.usage), 0) / 1073741824;

  const cpuTotalCapacity = nodes.reduce(
    (a, b) => a + Number(b?.cpuUsage?.capacity),
    0
  );
  const cpuTotalRequest = nodes.reduce(
    (a, b) => a + Number(b?.cpuUsage?.usage),
    0
  );

  return (
    <div>
      <Grid narrow>
        <Column md={{ span: 4 }} lg={{ span: 4 }}>
          <Card>
            <div
              style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <FormLabel>Memory Capacity</FormLabel>
              <h3>{memoryTotalCapacity.toFixed(2)} GB</h3>
            </div>

            <div
              style={{
                width: 200,
                marginTop: "1rem",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <GaugeChart
                id="gauge-chart2"
                nrOfLevels={20}
                textColor="#000"
                arcPadding={0.02}
                needleColor="#0005"
                colors={["#2ecc71", "#e74c3c"]}
                marginInPercent={0.0}
                percent={memoryTotalRequest / memoryTotalCapacity}
              />

              <div
                className="mt-2"
                style={{ textAlign: "center", fontSize: 12 }}
              >
                {memoryTotalRequest.toFixed(2)}GiB of{" "}
                <strong>{memoryTotalCapacity.toFixed(2)}GiB</strong>
              </div>
            </div>
          </Card>
        </Column>

        <Column md={{ span: 4 }} lg={{ span: 4 }}>
          <Card>
            <div
              style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <FormLabel>CPU Capacity</FormLabel>
              <h3>{cpuTotalCapacity.toFixed(2)}</h3>
            </div>

            <div
              style={{
                width: 200,
                marginTop: "1rem",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <GaugeChart
                id="gauge-chart2"
                nrOfLevels={20}
                textColor="#000"
                arcPadding={0.02}
                needleColor="#0005"
                colors={["#2ecc71", "#e74c3c"]}
                marginInPercent={0.0}
                percent={cpuTotalRequest / cpuTotalCapacity}
              />
            </div>
            <div className="mt-2" style={{ textAlign: "center", fontSize: 12 }}>
              {cpuTotalRequest.toFixed(2)} of{" "}
              <strong>{cpuTotalCapacity.toFixed(2)}</strong>
            </div>
          </Card>
        </Column>
      </Grid>

      <TableContainer className="mt-3 ml-4 mr-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader style={{ width: 30 }}>#</TableHeader>
              <TableHeader>Node</TableHeader>
              <TableHeader style={{ width: 200 }}>CPU</TableHeader>
              <TableHeader style={{ width: 200 }}>Memory</TableHeader>
            </TableRow>
          </TableHead>

          <TableBody>
            {nodes.map((node, idx) => {
              return (
                <TableRow key={node?.name || ""}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{node?.name}</TableCell>
                  <TableCell style={{ background: "#fff" }}>
                    <ProgressBar
                      label=""
                      value={
                        (100 * Number(node?.cpuUsage?.usage)) /
                        Number(node?.cpuUsage?.capacity)
                      }
                    />
                    {Number(node?.cpuUsage?.usage).toFixed(2)} CPU /{" "}
                    <strong>{node?.cpuUsage?.capacity} CPU</strong>
                  </TableCell>
                  <TableCell style={{ background: "#fff" }}>
                    <ProgressBar
                      label=""
                      value={
                        (100 * Number(node?.memoryUsage?.usage)) /
                        Number(node?.memoryUsage?.capacity)
                      }
                    />
                    {(
                      Number(node?.memoryUsage?.usage) /
                      (1024 * 1024 * 1024)
                    ).toFixed(2)}{" "}
                    GiB /{" "}
                    <strong>
                      {(
                        Number(node?.memoryUsage?.capacity) /
                        (1024 * 1024 * 1024)
                      ).toFixed(2)}{" "}
                      GiB
                    </strong>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

function HomeLoading() {
  return (
    <div>
      <SkeletonPlaceholder />
      <br />
      <SkeletonText />
      <SkeletonText />
      <SkeletonText />
    </div>
  );
}

const Home: NextPage = () => {
  const { data, loading } = useApiNodeList();

  return (
    <MasterLayout>
      {loading && <HomeLoading />}
      {data && data.nodes && <Stats nodes={data.nodes} />}
    </MasterLayout>
  );
};

export default Home;
