import styles from "../../styles/NavBar/NavBar.module.css";
import Navigation from "./Navigation";
import MobileNavigation from "./MobileNavigation";
import Link from "next/link";

const NavBar = () => {
  return (
    <div className={styles.NavBar}>
      <div className={styles.Logo}>
        <Link href="/">
          <img src="/sypoolName.svg" width="60px" height="20px" />
        </Link>
      </div>
      <Navigation />
      <MobileNavigation />
    </div>
  );
};

export default NavBar;
