import {
  Column,
  TextInput,
  Grid,
  Button,
  Loading,
  OverflowMenu,
  OverflowMenuItem,
} from "@carbon/react";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import {
  GqlApp,
  GqlAppEnvironmentVariable,
  Maybe,
} from "../../../../src/generated/graphql";
import AppLayout from "../../../../src/layout/AppLayout";
import MasterLayout from "../../../../src/layout/MasterLayout";
import * as Icons from "@carbon/icons-react";
import useApiUpdateApp from "../../../../src/hooks/useApiUpdateApp";
import BulkEnvironmentEditor, {
  EnvironmentVariableItem,
} from "src/components/BulkEnvironmentEditor";
import { useEffect } from "react";

interface EnvironmentVariableItemWithKey extends EnvironmentVariableItem {
  key: number;
}

function attachEnvironmentWithKey(
  envs?: Maybe<GqlAppEnvironmentVariable>[] | null
): EnvironmentVariableItemWithKey[] {
  return (envs || []).map((env, idx) => ({
    key: idx,
    name: env?.name || "",
    value: env?.value || "",
  }));
}

function hasLastEmptyEnvironment(value: EnvironmentVariableItemWithKey[]) {
  if (value.length === 0) return false;
  const last = value[value.length - 1];
  return !last.name && !last.value;
}

function AppEnvBody({ data }: { data: GqlApp }) {
  const [update, { loading }] = useApiUpdateApp({
    refetchQueries: ["app"],
  });

  const [openBulkEditor, setOpenBulkEditor] = useState(false);
  const [envList, setEnvList] = useState(attachEnvironmentWithKey(data.env));

  const onValueChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: "name" | "value",
    idx: number
  ) => {
    // Clone the object and make change
    let tmp = envList.map((ing) => ({ ...ing }));
    tmp[idx][field] = e.currentTarget.value;
    setEnvList(tmp);
  };

  useEffect(() => {
    if (!hasLastEmptyEnvironment(envList)) {
      // Make sure there is at least one empty environment
      // at the end of the list
      setEnvList([
        ...envList,
        {
          name: "",
          value: "",
          key: Math.max(...[...envList.map((x) => x.key), 0]) + 1,
        },
      ]);
    } else {
      // Make sure there is no empty environment variable
      // in the middle of the list
      const listWithoutLastItem = envList.slice(0, -1);
      const listAfterFilter = listWithoutLastItem.filter(
        (item) => item.name || item.value
      );

      if (listWithoutLastItem.length !== listAfterFilter.length) {
        setEnvList([...listAfterFilter, envList[envList.length - 1]]);
      }
    }
  }, [envList]);

  const onSaveClicked = () => {
    // Clean up empty env
    let tmp = envList
      .filter((ing) => ing.name || ing.value)
      .map((ing) => ({
        name: ing.name,
        value: ing.value || "/",
      }));

    update({
      variables: {
        id: data.id || "",
        value: {
          env: tmp,
        },
      },
    })
      .then()
      .catch();
  };

  const onSortByNameClicked = () => {
    const newEnvList = envList
      .filter((env) => env.name && env.value)
      .sort((a, b) => a.name.localeCompare(b.name));

    setEnvList([
      ...newEnvList,
      {
        value: "",
        name: "",
        key: Math.max(...newEnvList.map((env) => env.key)) + 1,
      },
    ]);
  };

  return (
    <div>
      {loading && <Loading />}

      <div style={{ marginBottom: "1rem" }}>
        <OverflowMenu renderIcon={Icons.TaskTools} iconDescription="More">
          <OverflowMenuItem
            itemText="Sort by name"
            onClick={onSortByNameClicked}
          />
          <OverflowMenuItem
            itemText="Bulk edit"
            onClick={() => setOpenBulkEditor(true)}
          />
        </OverflowMenu>
      </div>

      {envList.map((ing, idx) => {
        return (
          <div key={ing.key} style={{ marginBottom: "1rem" }}>
            <Grid style={{ padding: 0, marginBottom: "0.5rem" }} narrow>
              <Column md={{ span: 2 }} lg={{ span: 6 }}>
                <TextInput
                  id="env_name"
                  labelText=""
                  placeholder="Environment Name"
                  value={ing?.name || ""}
                  onChange={(e) => onValueChange(e, "name", idx)}
                  autoComplete="false"
                  autoCorrect="false"
                  spellCheck={false}
                />
              </Column>
              <Column md={{ span: 6, offset: 2 }} lg={{ span: 10, offset: 6 }}>
                <TextInput
                  id="env_value"
                  labelText=""
                  placeholder="Environment Value"
                  value={ing?.value || ""}
                  onChange={(e) => onValueChange(e, "value", idx)}
                  autoComplete="false"
                  autoCorrect="false"
                  spellCheck={false}
                />
              </Column>
            </Grid>
          </div>
        );
      })}

      <BulkEnvironmentEditor
        onClose={() => setOpenBulkEditor(false)}
        open={openBulkEditor}
        env={envList}
        onUpdate={(updatedEnv) => {
          setEnvList(
            Object.entries(updatedEnv).map((entry, idx) => ({
              key: idx,
              name: entry[0],
              value: entry[1],
            }))
          );
        }}
      />

      <div>
        <Button renderIcon={Icons.Save} onClick={onSaveClicked}>
          Save
        </Button>
      </div>
    </div>
  );
}

export default function AppIngressPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <MasterLayout withoutInnerContent>
      <AppLayout id={id as string} bodyComponent={AppEnvBody} />
    </MasterLayout>
  );
}
