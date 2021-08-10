import "../styles/globals.css";
import { userDataState, userSessionState, useConnect } from "../lib/auth";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Connect, getUserData } from "@syvita/connect-react";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }) {
  const { authOptions } = useConnect();
  const [userSession] = useAtom(userSessionState);
  const [, setUserData] = useAtom(userDataState);

  useEffect(() => {
    if (userSession?.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    } else if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn();
    }
  }, [userSession, setUserData]);

  return (
    <Connect authOptions={authOptions}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Connect>
  );
}

export default MyApp;
