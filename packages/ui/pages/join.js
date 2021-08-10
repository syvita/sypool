import { useConnect } from "../lib/auth";
import styles from "../styles/Join.module.css";

const Join = () => {
  const { handleOpenAuth } = useConnect();
  return (
    <main>
      <div className={styles.blobGreen}></div>
      <div className={styles.connect}>
        <h1>Connect to Sypool</h1>
        <button onClick={handleOpenAuth}>Use Stacks Connect</button>
      </div>
    </main>
  );
};

export default Join;
