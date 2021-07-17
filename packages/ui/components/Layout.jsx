import NavBar from './NavBar/NavBar';
import Footer from './Footer';
import styles from "../styles/Theme.module.css";
import { useState, createContext } from "react";

export const ThemeContext = createContext({});

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
