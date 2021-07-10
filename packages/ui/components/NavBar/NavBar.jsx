import styles from "../../styles/NavBar/NavBar.module.css";
import Navigation from "./Navigation";
import MobileNavigation from "./MobileNavigation";
import Link from "next/link";
import Image from "next/image";

const NavBar = () => {
  return (
    <div className={styles.NavBar}>
      <div className={styles.Logo}>
        <Link href="/">
          <Image src="/sypoolName.svg" width="60px" height="20px" />
        </Link>
      </div>
      <Navigation />
      <MobileNavigation />
    </div>
  );
};

export default NavBar;
