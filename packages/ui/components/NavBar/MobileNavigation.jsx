import NavLinks from "./NavLinks";
import styles from "../../styles/NavBar/NavBar.module.css";
import Image from "next/image";
import { useState } from "react";

const MobileNavigation = () => {
  const [open, setOpen] = useState(false);
  const hamburgerIcon = (
    <Image
      src="/hamburger.svg"
      width="30px"
      height="30px"
      onClick={() => setOpen(!open)}
    />
  );
  const closeIcon = (
    <Image
      src="/close.svg"
      width="30px"
      height="30px"
      onClick={() => setOpen(!open)}
    />
  );
  const closeMobileMenu = () => setOpen(false);

  return (
    <nav className={styles.MobileNavigation}>
      <div className={styles.Hamburger}>{open ? closeIcon : hamburgerIcon}</div>
      {open && <NavLinks isMobile={true} closeMobileMenu={closeMobileMenu} />}
    </nav>
  );
};

export default MobileNavigation;
