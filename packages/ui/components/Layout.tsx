import NavBar from "./NavBar/NavBar";
import Footer from "./Footer";
import styles from "../styles/Layout.module.css";
import { useState, createContext } from "react";

export const ThemeContext = createContext(
  {} as { theme: string; setTheme: any }
);

const Layout = ({ children }) => {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={theme === "light" ? styles.light : styles.dark}>
        <NavBar />
        {children}
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
};

export default Layout;
