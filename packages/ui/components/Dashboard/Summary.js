import styles from "../../styles/Summary.module.css";
import { useContext } from "react";
import { ThemeContext } from "../Layout";

const Summary = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={theme === "light" ? styles.light : styles.dark}>
      <div className={styles.summary}>
        <div className={styles.info}>
          <div className={styles.contribution}>
            <p>
              You have contspributed ₿8.6 over 8 cycles; your last contribution
              was in cycle 7 with ₿1.2. You’ve made ₿2 profit at current prices
              and your next return will be sent at block 36,128 - 34 blocks
              (~5.7h) from now.
            </p>
          </div>
          <div className={styles.blocks}></div>
          <div className={styles.rates}></div>
          <div className={styles.stats}></div>
        </div>
        <div className={styles.graphs}>
          <h1>put graphs here</h1>
          <h1>put graphs here</h1>
          <h1>put graphs here</h1>
          <h1>put graphs here</h1>
          <h1>put graphs here</h1>
        </div>
      </div>
    </div>
  );
};

export default Summary;
