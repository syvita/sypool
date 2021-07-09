import Link from "next/link";
import JoinSypoolButton from "./JoinSypoolButton";

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
      <JoinSypoolButton name="JOIN"/>
    </nav>
  );
};

export default Navbar;
