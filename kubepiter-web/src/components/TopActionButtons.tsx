import {
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderPanel,
  Switcher,
  SwitcherItem,
} from "@carbon/react";
import * as Icons from "@carbon/icons-react";
import { MouseEvent, useEffect, useState } from "react";
import { useSessionToken } from "../providers/SessionTokenProvider";

export default function TopActionButtons() {
  const [expanded, setExpanded] = useState(false);
  const { setToken } = useSessionToken();

  useEffect(() => {
    if (expanded) {
      const onDocumentClicked = () => {
        setExpanded(false);
      };

      document.addEventListener("click", onDocumentClicked);
      return () => {
        document.removeEventListener("click", onDocumentClicked);
      };
    }
  }, [expanded]);

  const onExpandedClicked = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setExpanded(!expanded);
    e.stopPropagation();
  };

  const onLogoutClicked = () => {
    setToken(null);
  };

  return (
    <>
      <HeaderGlobalBar>
        <HeaderGlobalAction
          aria-label="Options"
          isActive={expanded}
          onClick={onExpandedClicked}
        >
          <Icons.Switcher size={20} />
        </HeaderGlobalAction>
      </HeaderGlobalBar>

      <HeaderPanel
        expanded={expanded}
        aria-label="Options"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Switcher aria-label="Switcher Container">
          <SwitcherItem aria-label="Link 1" href="/users/change_password">
            Change Password
          </SwitcherItem>
          <SwitcherItem aria-label="Link 1" href="#" onClick={onLogoutClicked}>
            Logout
          </SwitcherItem>
        </Switcher>
      </HeaderPanel>
    </>
  );
}
