import { useCallback } from "react";
import { AppConfig, UserSession } from "@syvita/connect-react";
import { showConnect } from "@syvita/connect";
import { atom, useAtom } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import Router from "next/router";

const appConfig = new AppConfig(["store_write", "publish_data"]);
export const userSessionState = atom(new UserSession({ appConfig }));
export const userDataState = atom();
export const authResponseState = atom();

export const useConnect = () => {
  const [userSession] = useAtom(userSessionState);
  const setUserData = useUpdateAtom(userDataState);
  const setAuthResponse = useUpdateAtom(authResponseState);

  const onFinish = async (payload) => {
    setAuthResponse(payload.authResponse);
    const userData = await payload.userSession.loadUserData();
    setUserData(userData);
    Router.push("/dashboard");
  };

  const authOptions = {
    onFinish,
    userSession, // usersession is already in state, provide it here
    redirectTo: "/",
    appDetails: {
      name: "Sypool",
      icon: "https://x.syvita.org/sypool.png",
    },
  };

  const handleOpenAuth = () => {
    showConnect(authOptions);
  };

  const handleSignOut = useCallback(() => {
    userSession?.signUserOut("/");
  }, [userSession]);

  return { handleOpenAuth, handleSignOut, authOptions };
};
