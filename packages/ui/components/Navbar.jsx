import Link from "next/link";
import { userSession } from "./Stacks";

const Navbar = () => {
  return (
    <nav>
      <div className="logo">
        <Link href="/">
          <a>Sypool</a>
        </Link>
      </div>
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
      {!userSession.isUserSignedIn() && (
        <Link href="/join">
          <button>Join</button>
        </Link>
      )}
      {userSession.isUserSignedIn() && (
        <Link href="/dashboard">
          <button>Go to Dashboard</button>
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
