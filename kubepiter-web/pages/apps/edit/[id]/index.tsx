import { TextInput, Button, Grid, Column, Loading } from "@carbon/react";
import { useRouter } from "next/router";
import { GqlApp } from "../../../../src/generated/graphql";
import MasterLayout from "../../../../src/layout/MasterLayout";
import AppLayout from "../../../../src/layout/AppLayout";
import LinkGitRepoEditor from "../../../../src/components/LinkGitRepoEditor";
import RegistryListCombo from "../../../../src/components/RegistryListCombo";
import { useState } from "react";
import useApiUpdateApp from "../../../../src/hooks/useApiUpdateApp";
import NodeGroupListCombo from "../../../../src/components/NodeGroupListCombo";
import WebhookTextbook from "../../../../src/components/WebhookTextbox";

function AppBody({ data }: { data: GqlApp }) {
  const [update, { loading }] = useApiUpdateApp({ refetchQueries: ["app"] });
  const [imagePullSecret, setImagePullScret] = useState(
    data.imagePullSecret || ""
  );

  const [name, setName] = useState(data.name || "");
  const [dockerfilePath, setDockerfilePath] = useState(
    data.dockerfilePath || ""
  );
  const [image, setImage] = useState(data.image || "");
  const [folderName, setFolderName] = useState(data.folderName || "");
  const [nodeGroup, setNodeGroup] = useState(data.nodeGroup || "");
  const [port, setPort] = useState(data.port || "");

  // Scaling and limit resource usages
  const [replicas, setReplicas] = useState((data.replicas || 1).toString());
  const [memoryLimits, setMemoryLimits] = useState(
    data.resources?.limits?.memory || ""
  );
  const [memoryRequests, setMemoryRequests] = useState(
    data.resources?.requests?.memory || ""
  );
  const [cpuLimits, setCpuLimits] = useState(data.resources?.limits?.cpu || "");
  const [cpuRequests, setCpuRequests] = useState(
    data.resources?.requests?.cpu || ""
  );

  const onSaveClicked = () => {
    update({
      variables: {
        id: data.id || "",
        value: {
          image,
          imagePullSecret,
          folderName,
          nodeGroup,
          name,
          dockerfilePath,
          port: Number(port),
          replicas: Number(replicas),
          resources: {
            limits: {
              cpu: Number(cpuLimits || 0),
              memory: Number(memoryLimits || 0),
            },
            requests: {
              cpu: Number(cpuRequests || 0),
              memory: Number(memoryRequests || 0),
            },
          },
        },
      },
    });
  };

  return (
    <div>
      {loading && <Loading />}

      <Grid narrow style={{ padding: 0 }}>
        <Column lg={{ span: 10 }} md={{ span: 5 }}>
          <TextInput
            id="name"
            labelText="Name"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            autoCorrect="off"
            spellCheck={false}
          />
        </Column>
        <Column lg={{ offset: 10, span: 6 }} md={{ offset: 5, span: 3 }}>
          <TextInput
            id="folder"
            labelText="Folder Name (Optional)"
            helperText="It is used for grouping the app"
            onChange={(e) => setFolderName(e.currentTarget.value)}
            value={folderName || ""}
            autoCorrect="off"
            spellCheck={false}
          />
        </Column>
      </Grid>

      <br />
      <br />

      <h4>Deployment</h4>
      <br />

      <Grid narrow style={{ padding: 0, marginBottom: "1rem" }}>
        <Column lg={{ span: 6 }} md={{ span: 8 }}>
          <RegistryListCombo
            value={imagePullSecret}
            onChange={(e) => {
              if (e) {
                setImagePullScret(e.name || "");
                if (e.urlPrefix) {
                  setImage(`${e.urlPrefix || ""}/${data?.id}`);
                }
              }
            }}
          />
        </Column>
        <Column lg={{ offset: 6, span: 4 }} md={{ offset: 8, span: 8 }}>
          <TextInput
            id="port"
            placeholder="Port"
            labelText="Port"
            value={port}
            onChange={(e) => setPort(e.currentTarget.value)}
          ></TextInput>
        </Column>
        <Column lg={{ offset: 10, span: 6 }} md={{ offset: 8, span: 8 }}>
          <NodeGroupListCombo
            value={nodeGroup}
            onChange={(e) => setNodeGroup(e || "")}
          />
        </Column>
      </Grid>

      <TextInput
        id="image_repository"
        labelText="Image Repository"
        spellCheck={false}
        value={image}
        onChange={(e) => setImage(e.currentTarget.value)}
      />

      <LinkGitRepoEditor id={data.id || ""} git={data.git} />
      <br />
      <TextInput
        id="image_repository"
        labelText="Dockerfile Path"
        spellCheck={false}
        value={dockerfilePath}
        onChange={(e) => setDockerfilePath(e.currentTarget.value)}
      />

      <h4 className="mt-4 mb-4">Scaling</h4>

      <Grid narrow style={{ padding: 0 }}>
        <Column lg={{ offset: 0, span: 2 }}>
          <TextInput
            id="replicas"
            labelText="Replicas"
            value={replicas}
            onChange={(e) => setReplicas(e.currentTarget.value)}
          />
        </Column>
        <Column lg={{ span: 2 }}>
          <TextInput
            id="memory_request"
            labelText="Memory Request (Mi)"
            value={memoryRequests}
            onChange={(e) => setMemoryRequests(e.currentTarget.value)}
          />
        </Column>
        <Column lg={{ span: 2 }}>
          <TextInput
            id="memory_limit"
            labelText="Memory Limit (Mi)"
            value={memoryLimits}
            onChange={(e) => setMemoryLimits(e.currentTarget.value)}
          />
        </Column>
        <Column lg={{ span: 2 }}>
          <TextInput
            id="cpu_request"
            labelText="CPU Request (vCPU)"
            value={cpuRequests}
            onChange={(e) => setCpuRequests(e.currentTarget.value)}
          />
        </Column>
        <Column lg={{ span: 2 }}>
          <TextInput
            id="cpu_limit"
            labelText="CPU Limit (vCPU)"
            value={cpuLimits}
            onChange={(e) => setCpuLimits(e.currentTarget.value)}
          />
        </Column>
      </Grid>

      <h4 style={{ marginTop: "2rem", marginBottom: "2rem" }}>Webhook</h4>

      <WebhookTextbook app={data} />

      <div style={{ marginTop: "2rem" }}>
        <Button onClick={onSaveClicked}>Save</Button>
      </div>
    </div>
  );
}

export default function AppEditPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <MasterLayout withoutInnerContent>
      <AppLayout id={id as string} bodyComponent={AppBody} />
    </MasterLayout>
  );
}
