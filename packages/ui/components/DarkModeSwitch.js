import { useContext } from "react";
import styles from "../styles/Switch.module.css";
import { ThemeContext } from "./Layout";

const DarkModeSwitch = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <label className={styles.Switch}>
      <input
        type="checkbox"
        onChange={() => setTheme(theme === "light" ? "dark" : "light")}
        checked={theme === "light"}
      />
      <span className={styles.Slider} />
    </label>
  );
};

export default DarkModeSwitch;
