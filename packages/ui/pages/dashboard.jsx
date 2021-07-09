import { getUserData } from "../components/Stacks";
import { userSession, signOut } from "../components/Stacks";
import router from "next/router";
import { useEffect } from "react";

const Dashboard = () => {
  useEffect(() => {
    if (!userSession.isUserSignedIn()) {
      router.push("/join");
    }
  }, []);

  if (!userSession.isUserSignedIn()) {
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

export default Dashboard;
