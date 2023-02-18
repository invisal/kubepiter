import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";

const SessionTokenContext = createContext<{
  token: string | null;
  setToken: (token: string | null) => void;
}>({
  token: "",
  setToken: () => {},
});

export function useSessionToken() {
  return useContext(SessionTokenContext);
}

export function SessionTokenProvider(props: PropsWithChildren<unknown>) {
  const [token, setToken] = useState(
    typeof window !== "undefined"
      ? window.localStorage.getItem("session_token")
      : ""
  );

  const setTokenWithLocationSession = useCallback(
    (t: string | null) => {
      setToken(t);
      if (t) {
        window.localStorage.setItem("session_token", t);
      } else {
        window.localStorage.removeItem("session_token");
      }
    },
    [setToken]
  );

  return (
    <SessionTokenContext.Provider
      value={{ setToken: setTokenWithLocationSession, token }}
    >
      {props.children}
    </SessionTokenContext.Provider>
  );
}
