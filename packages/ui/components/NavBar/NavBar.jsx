import styles from "../../styles/NavBar.module.css";
import Navigation from "./Navigation";
import MobileNavigation from "./MobileNavigation";
import Link from "next/link";
import { useContext } from "react";
import { ThemeContext } from "../Layout";

const NavBar = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={theme === "light" ? styles.light : styles.dark}>
      <div className={styles.Logo}>
        <Link href="/" passHref={true}>
          <img
            src="/sypoolName.svg"
            width="60px"
            height="20px"
            alt="Sypool Name SVG"
          />
        </Link>
      </div>
      <Navigation />
      <MobileNavigation />
    </div>
  );
};

export default NavBar;
