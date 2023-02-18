import {
  Button,
  Checkbox,
  Column,
  FormLabel,
  Grid,
  Loading,
  Modal,
  TextInput,
} from "@carbon/react";
import * as Icons from "@carbon/icons-react";
import { GqlAppGit, Maybe } from "../generated/graphql";
import { ChangeEvent, useState } from "react";
import useApiUpdateApp from "../hooks/useApiUpdateApp";

function LinkGitRepoEditorModal({
  id,
  defaultUrl,
  defaultBranch,
  defaultHasAuth,
  onRequestClose,
  onSuccess,
}: {
  id: string;
  defaultUrl?: string;
  defaultBranch?: string;
  defaultHasAuth?: boolean;
  onRequestClose?: () => void;
  onSuccess?: (url: string, branch: string, hasAuth: boolean) => void;
}) {
  const [update, { loading }] = useApiUpdateApp();
  const [url, setUrl] = useState(defaultUrl);
  const [branch, setBranch] = useState(defaultBranch);
  const [hasAuth, setHasAuth] = useState(defaultHasAuth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onRequestSubmit = () => {
    update({
      variables: {
        id,
        value: {
          git: hasAuth
            ? {
                url,
                branch,
                username: username ? username : undefined,
                password: password ? password : undefined,
              }
            : {
                url,
                branch,
                username: "",
                password: "",
              },
        },
      },
    })
      .then(() => {
        if (onSuccess) onSuccess(url || "", branch || "", hasAuth || false);
      })
      .catch();
  };

  return (
    <Modal
      open
      modalHeading="Link your git repository"
      modalLabel="Source Code"
      primaryButtonText="Link"
      secondaryButtonText="Cancel"
      primaryButtonDisabled={!url || !branch}
      onRequestClose={onRequestClose}
      onRequestSubmit={onRequestSubmit}
    >
      {loading && <Loading />}

      <p style={{ marginBottom: "1rem" }}>
        Provide us with your Git repository. Make sure there is Dockerfile
        inside your source code
      </p>

      <Grid narrow fullWidth style={{ padding: 0 }}>
        <Column md={{ span: 6 }} lg={{ span: 12 }}>
          <TextInput
            id="url"
            labelText="Git"
            value={url}
            onChange={(e) => setUrl(e.currentTarget.value)}
            placeholder="git://github.com/hello-world"
            style={{ marginBottom: "1rem" }}
            autoComplete="off"
            spellCheck={false}
          />
        </Column>
        <Column md={{ span: 2, offset: 6 }} lg={{ span: 4, offset: 12 }}>
          <TextInput
            id="branch"
            value={branch}
            onChange={(e) => setBranch(e.currentTarget.value)}
            labelText="Branch"
            placeholder="main"
            style={{ marginBottom: "1rem" }}
            autoComplete="off"
            spellCheck={false}
          />
        </Column>
      </Grid>

      <Checkbox
        id="auth"
        labelText="Using Authentication"
        checked={hasAuth}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setHasAuth(e.currentTarget.checked)
        }
      />

      {hasAuth && (
        <div>
          <p
            style={{
              fontSize: "0.8rem",
              marginTop: "0.5rem",
              marginBottom: "0.75rem",
            }}
          >
            Leave user and password blank if you want to use your previous
            credential
          </p>
          <Grid narrow fullWidth style={{ padding: 0 }}>
            <Column md={{ span: 4 }} lg={{ span: 8 }}>
              <TextInput
                id="username"
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                labelText="User"
                placeholder="username"
                style={{ marginBottom: "1rem" }}
                autoComplete="off"
                spellCheck={false}
              />
            </Column>
            <Column md={{ span: 4, offset: 4 }} lg={{ span: 8, offset: 8 }}>
              <TextInput
                id="password"
                labelText="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                placeholder="****"
                style={{ marginBottom: "1rem" }}
                autoComplete="off"
                spellCheck={false}
              />
            </Column>
          </Grid>
        </div>
      )}
    </Modal>
  );
}

export default function LinkGitRepoEditor({
  id,
  git,
}: {
  id: string;
  git: Maybe<GqlAppGit> | undefined;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState(git);

  const onEditClicked = () => {
    setIsModalOpen(true);
  };

  const onSuccess = (url: string, branch: string, hasAuth: boolean) => {
    setValue({ branch, url, hasAuth });
    setIsModalOpen(false);
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <div style={{ marginBottom: "0.5rem" }}>
        <strong>Source Code</strong>
      </div>

      <p style={{ marginBottom: "0.5rem" }}>
        <FormLabel>
          Provide us with your Git repository. We will build the image from your
          source code and push to above image repository
        </FormLabel>
      </p>

      <Button
        kind="tertiary"
        renderIcon={Icons.Edit}
        style={{ maxWidth: "100%" }}
        onClick={onEditClicked}
      >
        <Icons.LogoGithub size={24} style={{ marginRight: "1rem" }} />
        <strong>
          {value?.url
            ? `${value?.url} (${value?.branch})`
            : "Please link your source code"}
        </strong>
      </Button>

      {isModalOpen && (
        <LinkGitRepoEditorModal
          id={id}
          defaultBranch={value?.branch || ""}
          defaultUrl={value?.url || ""}
          defaultHasAuth={value?.hasAuth || false}
          onSuccess={onSuccess}
          onRequestClose={() => {
            setIsModalOpen(!isModalOpen);
          }}
        />
      )}
    </div>
  );
}
