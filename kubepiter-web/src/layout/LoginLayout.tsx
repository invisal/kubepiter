import {
  ComposedModal,
  ModalHeader,
  ModalBody,
  TextInput,
  InlineNotification,
  Button,
  InlineLoading,
} from "@carbon/react";
import { useState } from "react";
import useLogin from "../hooks/useLogin";
import { useSessionToken } from "../providers/SessionTokenProvider";

export default function LoginLayout() {
  const [login, { loading }] = useLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setToken } = useSessionToken();

  const onRequestSubmit = () => {
    login({
      variables: {
        username,
        password,
      },
      onCompleted: (data) => {
        setToken(data.login?.token || null);
      },
    }).catch((error) => {
      setError(error.message);
    });
  };

  return (
    <ComposedModal open preventCloseOnClickOutside>
      <ModalHeader
        label="Account Login"
        title="Login Required"
        closeClassName="hidden"
      />
      <ModalBody>
        {error && !loading && (
          <InlineNotification
            kind="error"
            title=""
            subtitle={error}
            style={{ marginBottom: "1rem" }}
          />
        )}

        {loading && (
          <InlineLoading
            description={"Login..."}
            status="active"
            style={{ marginBottom: "1rem" }}
          />
        )}

        <TextInput
          id="username"
          data-modal-primary-focus
          labelText="Username"
          placeholder="admin"
          value={username}
          onChange={(e) => setUsername(e.currentTarget.value)}
          style={{ marginBottom: "1rem" }}
        />

        <TextInput
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onRequestSubmit();
            }
          }}
          data-modal-primary-focus
          labelText="Password"
          placeholder="******"
          style={{ marginBottom: "1rem" }}
        />

        <Button onClick={onRequestSubmit} disabled={loading}>
          Login
        </Button>
      </ModalBody>
    </ComposedModal>
  );
}
