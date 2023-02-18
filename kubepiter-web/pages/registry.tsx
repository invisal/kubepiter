import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  SkeletonText,
  FormLabel,
  TableContainer,
  TableToolbarContent,
  TableToolbar,
  Link,
  TableToolbarSearch,
  Button,
} from "@carbon/react";
import { Maybe } from "graphql/jsutils/Maybe";
import type { NextPage } from "next";
import { GqlRegistry } from "../src/generated/graphql";
import useApiRegistryList from "../src/hooks/useApiRegistryList";
import * as Icons from "@carbon/icons-react";
import MasterLayout from "../src/layout/MasterLayout";
import { useState } from "react";

function RegistryList({ regs }: { regs: Maybe<GqlRegistry>[] }) {
  const [search, setSearch] = useState("");

  return (
    <TableContainer
      title="Registries"
      description="Managed your container registry"
    >
      <TableToolbar>
        <TableToolbarContent>
          <TableToolbarSearch
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          <Button>Add Registry</Button>
        </TableToolbarContent>
      </TableToolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader style={{ width: 90 }}>Used</TableHeader>
            <TableHeader style={{ width: 90 }}></TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {regs
            .filter(
              (reg) =>
                (reg?.name || "").toLowerCase().indexOf(search.toLowerCase()) >=
                0
            )
            .map((reg) => (
              <TableRow key={reg?.name}>
                <TableCell>
                  <div>
                    <strong>{reg?.name}</strong>
                  </div>
                  <FormLabel>{reg?.auth}</FormLabel>
                </TableCell>
                <TableCell>{reg?.totalAppUsed}</TableCell>
                <TableCell>
                  <Link renderIcon={Icons.Edit}>Manage</Link>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function renderLoading() {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader style={{ width: 90 }}></TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>
            <SkeletonText />
          </TableCell>
          <TableCell>
            <SkeletonText />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

const Registry: NextPage = () => {
  const { data } = useApiRegistryList();

  return (
    <MasterLayout>
      {data ? <RegistryList regs={data.registries || []} /> : renderLoading()}
    </MasterLayout>
  );
};

export default Registry;
