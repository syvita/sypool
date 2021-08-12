import { useConnect } from "../lib/auth";
import { useContext } from "react";
import { ThemeContext } from "../components/Layout";
import styles from "../styles/Join.module.css";

const Join = () => {
  const { handleOpenAuth } = useConnect();
  const { theme } = useContext(ThemeContext);
  return (
    <div className={theme === "light" ? styles.light : styles.dark}>
      <main className={styles.join}>
        <div className={styles.blobGreen}></div>
        <div className={styles.connect}>
          <h1>Connect to Sypool</h1>
          <button onClick={handleOpenAuth}>Use Stacks Connect</button>
        </div>
      </main>
    </div>
  );
};

export default Join;
