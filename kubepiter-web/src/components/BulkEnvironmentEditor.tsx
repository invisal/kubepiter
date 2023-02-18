import { Modal, TextArea } from "@carbon/react";
import { useEffect } from "react";
import { useState } from "react";
import { parseEnv, stringifyEnvValue } from "src/utils/parseEnv";

export interface EnvironmentVariableItem {
  name: string;
  value: string;
}

export default function BulkEnvironmentEditor({
  onUpdate,
  open,
  onClose,
  env,
}: {
  onUpdate: (envs: Record<string, string>) => void;
  onClose: () => void;
  open: boolean;
  env: EnvironmentVariableItem[];
}) {
  const [envText, setEnvText] = useState("");

  useEffect(() => {
    if (open) {
      setEnvText(
        env
          .filter((ev) => ev.name || ev.value)
          .map((ev) => {
            return `${ev.name}=${stringifyEnvValue(ev.value)}`;
          })
          .join("\n")
      );
    }
  }, [open, env]);

  const onRequestSubmit = () => {
    // Parsing the environment variables
    const { env } = parseEnv(envText);
    onUpdate(env);
    onClose();
  };

  return (
    <Modal
      open={open}
      onRequestClose={onClose}
      modalHeading="Environment Variables"
      modalLabel="Bulk Editor"
      primaryButtonText="Update"
      secondaryButtonText="Cancel"
      onRequestSubmit={onRequestSubmit}
    >
      <TextArea
        labelText=""
        id="env"
        rows={20}
        placeholder="Environment Variable"
        value={envText}
        onChange={(e) => setEnvText(e.currentTarget.value)}
      />
    </Modal>
  );
}
