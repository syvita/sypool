import styles from "../../styles/Summary.module.css";
import { useContext } from "react";
import { ThemeContext } from "../Layout";

const Summary = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={theme === "light" ? styles.light : styles.dark}>
      <main></main>
    </div>
  );
};

export default Summary;
