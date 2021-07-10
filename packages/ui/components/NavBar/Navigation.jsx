import NavLinks from "./NavLinks";
import styles from "../../styles/NavBar/NavBar.module.css";
import Image from "next/image";

const Navigation = () => {
  return (
    <nav className={styles.Navigation}>
      <NavLinks />
    </nav>
  );
};

export default Navigation;
