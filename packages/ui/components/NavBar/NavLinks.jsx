import Link from "next/link";
import { useEffect } from "react";
import styles from "../../styles/NavBar/NavBar.module.css";
import { userSession } from "../Stacks";

const NavLinks = (props) => {
  return (
    <div>
      <Link href="/cycles">
        <a onClick={() => props.isMobile && props.closeMobileMenu()}>CYCLES</a>
      </Link>
      <Link href="/docs">
        <a onClick={() => props.isMobile && props.closeMobileMenu()}>DOCS</a>
      </Link>
      <Link href="/security">
        <a onClick={() => props.isMobile && props.closeMobileMenu()}>
          SECURITY
        </a>
      </Link>
      <Link href="/fees">
        <a onClick={() => props.isMobile && props.closeMobileMenu()}>FEES</a>
      </Link>
      {!userSession.isUserSignedIn() && (
        <Link href="/join">
          <button onClick={() => props.isMobile && props.closeMobileMenu()}>
            Join
          </button>
        </Link>
      )}
      {userSession.isUserSignedIn() && (
        <Link href="/dashboard">
          <button onClick={() => props.isMobile && props.closeMobileMenu()}>
            Go to Dashboard
          </button>
        </Link>
      )}
    </div>
  );
};

export default NavLinks;
