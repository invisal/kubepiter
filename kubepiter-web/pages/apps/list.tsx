import {
  Table,
  TableRow,
  TableHead,
  TableHeader,
  TableBody,
  TableCell,
  Link as CarbonLink,
  TableContainer,
  Button,
} from "@carbon/react";
import * as Icons from "@carbon/icons-react";
import { Maybe } from "graphql/jsutils/Maybe";
import type { NextPage } from "next";
import Link from "next/link";
import { GqlApp } from "../../src/generated/graphql";
import useApiAppList from "../../src/hooks/useApiAppList";
import MasterLayout from "../../src/layout/MasterLayout";

function renderAppList(folderName: string | null, apps: Maybe<GqlApp>[]) {
  const sortedApp = [...apps];
  sortedApp.sort((a, b) => (a?.name || "").localeCompare(b?.name || ""));

  return (
    <>
      <TableRow key={`folder_${folderName}`} style={{ height: "auto" }}>
        <TableCell
          colSpan={2}
          style={{
            background: "#161616",
            color: "#fff",
            paddingTop: "0.5rem",
            paddingBottom: "0.5rem",
            lineHeight: "1rem",
          }}
        >
          <strong className="text-sm">{folderName}</strong>
        </TableCell>
      </TableRow>
      {sortedApp.map((app) => (
        <TableRow key={app?.id}>
          <TableCell>
            <Icons.ApplicationVirtual />
          </TableCell>
          <TableCell>
            <Link href={`/apps/edit/${app?.id}`} passHref>
              <CarbonLink>{app?.name}</CarbonLink>
            </Link>
            <div>
              {app?.ingress?.map((ingress, idx) => (
                <div
                  key={idx}
                  className="text-sm"
                  style={{ display: "inline-block" }}
                >
                  {ingress?.host}
                  {ingress?.path !== "/" ? ingress?.path : ""},&nbsp;
                </div>
              ))}
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

function renderAppGroup(apps: Maybe<GqlApp>[]) {
  const folderList = Array.from(
    new Set(apps.map((app) => app?.folderName))
  ).sort((a, b) => (a || "").localeCompare(b || ""));

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader style={{ width: "1rem" }}></TableHeader>
            <TableHeader>Name</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {folderList.map((folder) => {
            const appsInFolder = apps.filter(
              (app) => app?.folderName === folder
            );
            return renderAppList(folder || null, appsInFolder);
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const Home: NextPage = () => {
  const { data } = useApiAppList();

  return (
    <MasterLayout>
      <h1 style={{ marginBottom: "2rem" }}>Applications</h1>

      <div style={{ marginBottom: "1rem", marginTop: "1rem" }}>
        <Button href="/apps/create">Add</Button>
      </div>

      {data?.apps ? <>{renderAppGroup(data.apps || [])}</> : <div></div>}
    </MasterLayout>
  );
};

export default Home;
