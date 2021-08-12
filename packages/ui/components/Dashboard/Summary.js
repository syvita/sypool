import styles from "../../styles/Summary.module.css";
import { useContext } from "react";
import { ThemeContext } from "../Layout";

const Summary = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={theme === "light" ? styles.light : styles.dark}>
      <main className={styles.summary}>
        <div className={styles.contribution}>
          You have contributed ₿8.6 over 8 cycles; your last contribution was in
          cycle 7 with ₿1.2. You’ve made ₿2 profit at current prices and your
          next return will be sent at block 36,128 - 34 blocks (~5.7h) from now.
        </div>
        <div className={styles.blocks}>
          <div>STX BLK:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # 36,094</div>
          <div>BTC BLK:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # 710,373</div>
          <div>STX/BTC:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # 7,397</div>
        </div>
        <div className={styles.rates}>
          <div>
            <h1 className={styles.transferHeading}>9.7K &/s</h1>
            <h2>POX TRANSFER RATE</h2>
          </div>
          <div>
            <h1 className={styles.hashHeading}>227 EH/s</h1>
            <h2>BITCOIN HASHRATE</h2>
          </div>
        </div>
        <div className={styles.stats}>
          <div>TX FEE :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # 36,094</div>
          <div>MINERS:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # 710,373</div>
          <div>ADDRESSES:&nbsp;&nbsp;&nbsp;&nbsp; # 7,397</div>
        </div>
        <div className={styles.graphs}>Graphs</div>
      </main>
    </div>
  );
};

export default Summary;
