import styles from "../styles/Popup.module.css";
import { useContext } from "react";
import { ThemeContext } from "./Layout";

const Popup = (props) => {
  const { theme } = useContext(ThemeContext);
  return props.trigger ? (
    <div className={theme === "light" ? styles.light : styles.dark}>
      <div className={styles.popup}>
        <div className={styles.popupInner}>
          <div className={styles.title}>Add funds</div>
          <button
            className={styles.closeButton}
            onClick={() => props.setTrigger(false)}
          >
            Close
          </button>
          {props.children}
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};

export default Popup;
