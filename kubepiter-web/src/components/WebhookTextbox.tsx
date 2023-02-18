import { TextInput, CopyButton, Button, Loading, Modal } from "@carbon/react";
import { useState } from "react";
import { GqlApp } from "../generated/graphql";
import useApiRegenerateWebhook from "../hooks/useApiRegenerateWebhook";

export default function WebhookTextbook({ app }: { app: GqlApp }) {
  const [regenerate, { loading }] = useApiRegenerateWebhook({
    refetchQueries: ["app"],
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const onRegenerateClicked = () => {
    setShowConfirmation(true);
  };

  const onCancelRegenerateClicked = () => {
    setShowConfirmation(false);
  };

  const onConfirmedRegenerateClicked = () => {
    setShowConfirmation(false);
    regenerate({
      variables: {
        id: app.id || "",
      },
    })
      .then()
      .catch();
  };

  return (
    <div style={{ display: "flex" }}>
      {loading && <Loading />}

      <Modal
        open={showConfirmation}
        modalHeading="Regenerate Webhook Link"
        modalLabel="Webhook"
        primaryButtonText="Generate"
        secondaryButtonText="Cancel"
        onRequestSubmit={onConfirmedRegenerateClicked}
        onRequestClose={onCancelRegenerateClicked}
      >
        <p>
          Regenerate the webhook will generate new link. The old link will no
          longer work. Are you sure you want to generate new link?
        </p>
      </Modal>

      <div style={{ flexGrow: 1 }}>
        <TextInput
          id="webhook"
          value={app.gitWebhook || ""}
          hideLabel
          labelText="Webhook"
        />
      </div>
      <div>
        <CopyButton
          onClick={() => {
            navigator.clipboard.writeText(app.gitWebhook || "");
          }}
        />
      </div>
      <div>
        <Button size="md" onClick={onRegenerateClicked}>
          Regenerate
        </Button>
      </div>
    </div>
  );
}
