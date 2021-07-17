import NavLinks from "./NavLinks";
import styles from "../../styles/NavBar.module.css";

const Navigation = () => {
  return (
    <nav className={styles.Navigation}>
      <NavLinks />
    </nav>
  );
};

export default Navigation;
