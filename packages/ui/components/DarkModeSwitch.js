import { useContext } from "react";
import styles from "../styles/Switch.module.css";
import { ThemeContext } from "./Layout";

const DarkModeSwitch = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  function changeTheme() {
    setTheme(theme === "light" ? "dark" : "light");
    window.localStorage.setItem("theme", theme === "light" ? "dark" : "light");
  }
  return (
    <label className={styles.Switch}>
      <input
        type="checkbox"
        onChange={changeTheme}
        checked={theme === "light"}
      />
      <span className={styles.Slider} />
    </label>
  );
};

export default DarkModeSwitch;
