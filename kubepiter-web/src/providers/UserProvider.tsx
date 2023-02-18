import { Loading } from "@carbon/react";
import { createContext, PropsWithChildren, useContext } from "react";
import { GqlUser } from "../generated/graphql";
import useApiCurrentUser from "../hooks/useApiCurrentUser";

const UserContext = createContext<{ user?: GqlUser | null }>({});

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider(props: PropsWithChildren<unknown>) {
  const { data } = useApiCurrentUser();

  if (!data) {
    return <Loading />;
  }

  return (
    <UserContext.Provider value={{ user: data?.me }}>
      {props.children}
    </UserContext.Provider>
  );
}
