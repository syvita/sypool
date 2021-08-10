import NavLinks from "./NavLinks";
import styles from "../../styles/NavBar.module.css";
import { useState } from "react";


const MobileNavigation = () => {
  const [open, setOpen] = useState(false);
  const hamburgerIcon = (
    <img
      src="/nav-arrow.svg"
      width="25px"
      height="25px"
      onClick={() => setOpen(!open)}
      alt="Nav Arrow Icon"
    />
  );
  const closeIcon = (
    <img
      src="/close.svg"
      width="25px"
      height="25px"
      onClick={() => setOpen(!open)}
      alt="Close Icon"
    />
  );
  const closeMobileMenu = () => setOpen(false);

  return (
    <div>
      <div className={styles.Hamburger}>{open ? closeIcon : hamburgerIcon}</div>
      <nav className={styles.MobileNavigation}>
        {open && <NavLinks isMobile={true} closeMobileMenu={closeMobileMenu} />}
      </nav>
    </div>
  );
};

export default MobileNavigation;
