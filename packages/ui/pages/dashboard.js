import { useConnect, userSessionState } from "../lib/auth";
import router from "next/router";
import { useEffect } from "react";
import { useAtom } from "jotai";

const Dashboard = () => {
  const [userSession] = useAtom(userSessionState);
  const { handleSignOut } = useConnect();

  useEffect(() => {
    if (!userSession.isUserSignedIn()) {
      router.push("/join");
    }
  }, []);

  let STXAddress = "";

  if (userSession.isUserSignedIn()) {
    STXAddress = userSession.loadUserData().profile.stxAddress.mainnet;
  }

  console.log(STXAddress);

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default Dashboard;
