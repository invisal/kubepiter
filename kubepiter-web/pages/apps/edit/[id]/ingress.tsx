import { Column, TextInput, Grid, Button, Loading } from "@carbon/react";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { GqlApp } from "../../../../src/generated/graphql";
import AppLayout from "../../../../src/layout/AppLayout";
import MasterLayout from "../../../../src/layout/MasterLayout";
import * as Icons from "@carbon/icons-react";
import useApiUpdateApp from "../../../../src/hooks/useApiUpdateApp";

function AppIngressBody({ data }: { data: GqlApp }) {
  const [update, { loading }] = useApiUpdateApp({
    refetchQueries: ["app"],
  });

  const [ingressList, setIngressList] = useState([
    ...(data.ingress || []).map((ing, idx) => ({
      key: idx,
      host: ing?.host || "",
      path: ing?.path || "",
    })),
    { host: "", path: "", key: (data.ingress || []).length },
  ]);

  const [ingressBodySize, setIngressBodySize] = useState(
    data.ingressBodySize?.toString()
  );

  const onValueChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: "host" | "path",
    idx: number
  ) => {
    // Clone the object and make change
    let tmp = ingressList.map((ing) => ({ ...ing }));
    tmp[idx][field] = e.currentTarget.value;

    // If there is no empty ingress at the end, append one
    const last = tmp[tmp.length - 1];
    if (last.host || last.path) {
      tmp.push({
        host: "",
        path: "",
        key: Math.max(...tmp.map((ing) => ing.key)) + 1,
      });
    }

    setIngressList(tmp);
  };

  const onSaveClicked = () => {
    // Clean up empty ingress
    let tmp = ingressList
      .filter((ing) => ing.host || ing.path)
      .map((ing) => ({
        host: ing.host,
        path: ing.path || "/",
      }));

    update({
      variables: {
        id: data.id || "",
        value: {
          ingress: tmp,
          ingressBodySize: ingressBodySize !== "" ? Number(ingressBodySize) : 0,
        },
      },
    })
      .then()
      .catch();
  };

  const onRemove = (removeIndex: number) => {
    const tmp = ingressList
      .map((ing) => ({ ...ing }))
      .filter((_, index) => removeIndex !== index);

    setIngressList(tmp);
  };

  return (
    <div>
      {loading && <Loading />}

      {ingressList.map((ing, idx) => {
        return (
          <div key={ing.key} style={{ marginBottom: "2rem" }}>
            <Grid style={{ padding: 0, marginBottom: "0.5rem" }} narrow>
              <Column md={{ span: 6 }} lg={{ span: 10 }}>
                <TextInput
                  id="host"
                  labelText="Host"
                  placeholder="google.com"
                  value={ing?.host || ""}
                  onChange={(e) => onValueChange(e, "host", idx)}
                />
              </Column>
              <Column md={{ span: 2, offset: 6 }} lg={{ span: 6, offset: 10 }}>
                <TextInput
                  id="path"
                  labelText="Path"
                  placeholder="/"
                  value={ing?.path || ""}
                  onChange={(e) => onValueChange(e, "path", idx)}
                />
              </Column>
            </Grid>

            {ingressList.length > idx + 1 && (
              <Button
                size="sm"
                kind="danger--tertiary"
                renderIcon={Icons.SubtractAlt}
                onClick={() => onRemove(idx)}
              >
                Remove
              </Button>
            )}
          </div>
        );
      })}

      <h4 className="mt-4 mb-4">Other Options</h4>

      <Grid style={{ padding: 0, marginBottom: "0.5rem" }} narrow>
        <Column md={{ span: 6 }} lg={{ span: 10 }}>
          <TextInput
            id="host"
            labelText="Ingress Body Size"
            helperText="Default is 2mb. 0 means using default value"
            value={ingressBodySize}
            onChange={(e) => setIngressBodySize(e.currentTarget.value)}
          />
        </Column>
      </Grid>

      <div className="mt-4">
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
      <AppLayout id={id as string} bodyComponent={AppIngressBody} />
    </MasterLayout>
  );
}
