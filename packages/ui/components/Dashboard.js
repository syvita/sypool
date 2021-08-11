import { useConnect, userSessionState } from "../lib/auth";
import { useAtom } from "jotai";
import { useState } from "react";
import { useContext } from "react";
import { ThemeContext } from "./Layout";
import styles from "../styles/Dashboard.module.css";

import Summary from "./Dashboard/Summary";
import Settings from "./Dashboard/Settings";

const Dashboard = () => {
  const [userSession] = useAtom(userSessionState);
  const [renderedComponent, setRenderedComponent] = useState("Summary");
  const { theme } = useContext(ThemeContext);

  let STXAddress = "";

  if (userSession.isUserSignedIn()) {
    STXAddress = userSession.loadUserData().profile.stxAddress.mainnet;
  }

  console.log(STXAddress);

  return (
    <div className={theme === "light" ? styles.light : styles.dark}>
      <div className={styles.dashboard}>
        <div>
          <div className={styles.Title}>
            <h1>Afternoon, Asteria.</h1>
          </div>
          <nav className={styles.Navigation}>
            <div>
              <a>
                <button
                  style={
                    renderedComponent === "Summary"
                      ? {
                          backgroundColor: "rgba(0, 0, 0, 0.1)",
                          borderRadius: "10px",
                        }
                      : {}
                  }
                  onClick={() => {
                    setRenderedComponent("Summary");
                  }}
                >
                  Summary
                </button>
              </a>
              <a>
                <button
                  style={
                    renderedComponent === "Activity"
                      ? {
                          backgroundColor: "rgba(0, 0, 0, 0.1)",
                          borderRadius: "10px",
                        }
                      : {}
                  }
                  onClick={() => {
                    setRenderedComponent("Activity");
                  }}
                >
                  Activity
                </button>
              </a>
              <a>
                <button
                  style={
                    renderedComponent === "Data"
                      ? {
                          backgroundColor: "rgba(0, 0, 0, 0.1)",
                          borderRadius: "10px",
                        }
                      : {}
                  }
                  onClick={() => {
                    setRenderedComponent("Data");
                  }}
                >
                  Data
                </button>
              </a>
              <a>
                <button
                  style={
                    renderedComponent === "ContractInterface"
                      ? {
                          backgroundColor: "rgba(0, 0, 0, 0.1)",
                          borderRadius: "10px",
                        }
                      : {}
                  }
                  onClick={() => {
                    setRenderedComponent("ContractInterface");
                  }}
                >
                  Contract Interface
                </button>
              </a>
              <a>
                <button
                  style={
                    renderedComponent === "Settings"
                      ? {
                          backgroundColor: "rgba(0, 0, 0, 0.1)",
                          borderRadius: "10px",
                        }
                      : {}
                  }
                  onClick={() => {
                    setRenderedComponent("Settings");
                  }}
                >
                  Settings
                </button>
              </a>
            </div>
          </nav>
        </div>
        {renderedComponent === "Summary" && <Summary />}
        {renderedComponent === "Settings" && <Settings />}
      </div>
    </div>
  );
};

export default Dashboard;
