import styles from "../styles/Footer.module.css";
import Link from "next/link";
import DarkModeSwitch from "./DarkModeSwitch";
import { useContext } from "react";
import { ThemeContext } from "./Layout";

export default function Footer() {
  const { theme } = useContext(ThemeContext);
  return (
    <footer className={theme === "light" ? styles.light : styles.dark}>
      <div className={styles.footer}>
        <div className={styles.logo}>
          <Link href="/" passHref={true}>
            <img
              src="/sypoolName.svg"
              width="115px"
              height="40px"
              alt="Sypool Name SVG"
            />
          </Link>
        </div>
        <DarkModeSwitch />
        <div className={styles.syvita}>
          <p>
            Created by the <a href="https://syvita.org/">Syvita Guild</a>
          </p>
        </div>
        <div className={styles.links}>
          <Link href="/cycles">
            <a>CYCLES</a>
          </Link>
          <Link href="/docs">
            <a>DOCS</a>
          </Link>
          <Link href="/security">
            <a>SECURITY</a>
          </Link>
          <Link href="/fees">
            <a>FEES</a>
          </Link>
        </div>
      </div>
    </footer>
  );
}
