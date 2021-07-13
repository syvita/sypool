import { signIn } from "../components/Stacks";
import styles from "../styles/Join.module.css";

const Join = () => {
  return (
    <main>
      <div className={styles.blobGreen}></div>
      <div className={styles.connect}>
        <h1>Connect to Sypool</h1>
        <button onClick={signIn}>Use Stacks Connect</button>
      </div>
    </main>
  );
};

export default Join;
