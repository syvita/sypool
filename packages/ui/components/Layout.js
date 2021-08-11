import NavBar from "./NavBar/NavBar";
import Footer from "./Footer";
import styles from "../styles/Layout.module.css";
import { useState, createContext, useEffect } from "react";

export const ThemeContext = createContext({});

const Layout = ({ children }) => {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    console.log(localStorage.getItem("theme"));
    if (localStorage.getItem("theme") === null) {
      setTheme("light");
    } else {
      setTheme(window.localStorage.getItem("theme"));
    }
  }, []);

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
