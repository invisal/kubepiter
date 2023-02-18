import { Button, InlineNotification, Loading, TextInput } from "@carbon/react";
import { useEffect, useState } from "react";
import useApiChangePassword from "src/hooks/useApiChangePassword";
import MasterLayout from "src/layout/MasterLayout";

function UserChangePasswordBody() {
  const [changePassword, { data, loading, error }] = useApiChangePassword();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onChangePasswordClicked = () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("The confirmed password does not match");
      return;
    }

    setErrorMessage("");
    changePassword({
      variables: {
        newPassword,
        oldPassword,
      },
    })
      .then()
      .catch(console.error);
  };

  return (
    <div>
      <h3>Change Password</h3>

      <div>
        {loading && <Loading />}

        {error && !loading && (
          <InlineNotification
            kind="error"
            title=""
            subtitle={error.message}
            style={{ marginBottom: "1rem", marginTop: "1rem" }}
          />
        )}

        {errorMessage && (
          <InlineNotification
            kind="error"
            title=""
            subtitle={errorMessage}
            style={{ marginBottom: "1rem", marginTop: "1rem" }}
          />
        )}

        {data?.changePassword && !loading && (
          <InlineNotification
            kind="success"
            title=""
            subtitle="Success changed password"
            style={{ marginBottom: "1rem", marginTop: "1rem" }}
          />
        )}
      </div>

      <div className="mt-4" style={{ maxWidth: 300 }}>
        <TextInput
          autoFocus
          id="old_password"
          labelText="Old Password"
          type="password"
          className="mb-1"
          placeholder="Your old password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.currentTarget.value)}
        />

        <TextInput
          id="new_password"
          labelText="New Password"
          type="password"
          className="mb-1"
          placeholder="Your new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.currentTarget.value)}
        />

        <TextInput
          id="confim_new_password"
          labelText="Confirmed New Password"
          type="password"
          className="mb-3"
          placeholder="Your new password again"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.currentTarget.value)}
        />

        <Button onClick={onChangePasswordClicked}>Change Password</Button>
      </div>
    </div>
  );
}

export default function UserChangePasswordPage() {
  return (
    <MasterLayout>
      <UserChangePasswordBody />
    </MasterLayout>
  );
}
