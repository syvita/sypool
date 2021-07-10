import NavLinks from "./NavLinks";
import styles from "../../styles/NavBar/NavBar.module.css";
import { useState } from "react";


const MobileNavigation = () => {
  const [open, setOpen] = useState(false);
  const hamburgerIcon = (
    <img
      src="/hamburger.svg"
      width="30px"
      height="30px"
      onClick={() => setOpen(!open)}
      alt="Hamburger Icon"
    />
  );
  const closeIcon = (
    <img
      src="/close.svg"
      width="30px"
      height="30px"
      onClick={() => setOpen(!open)}
      alt="Close Icon"
    />
  );
  const closeMobileMenu = () => setOpen(false);

  return (
    <nav className={styles.MobileNavigation}>
      <div className={styles.Hamburger}>{open ? closeIcon : hamburgerIcon}</div>
      {open && <NavLinks isMobile={true} closeMobileMenu={closeMobileMenu}/>}
    </nav>
  );
};

export default MobileNavigation;
