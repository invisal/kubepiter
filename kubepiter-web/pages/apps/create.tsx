import { Button, Loading, TextInput } from "@carbon/react";
import { useRouter } from "next/router";
import { useState } from "react";
import useApiCreateApp from "src/hooks/useApiCreateApp";
import MasterLayout from "src/layout/MasterLayout";

function CreateAppBody() {
  const router = useRouter();
  const [createApp, { loading }] = useApiCreateApp();
  const [name, setName] = useState("");

  const onCreateClicked = () => {
    createApp({
      variables: { name },
    })
      .then(({ data }) => {
        router.push(`/apps/edit/${data?.createApp}`);
      })
      .catch();
  };

  return (
    <div>
      {loading && <Loading />}
      <h4 className="mb-4">Create New App</h4>
      <TextInput
        id="name"
        placeholder="Your application name"
        labelText="Application Name"
        className="mb-2"
        value={name}
        onChange={(e) => {
          setName(e.currentTarget.value);
        }}
        autoComplete="off"
      />
      <Button onClick={onCreateClicked}>Create</Button>
    </div>
  );
}

export default function CreateAppPage() {
  return (
    <MasterLayout>
      <CreateAppBody />
    </MasterLayout>
  );
}
