import Link from "next/link";
import { userSessionState } from "../../lib/auth";
import { useAtom } from "jotai";

const NavLinks = (props) => {
  const [userSession] = useAtom(userSessionState);

  return (
    <div>
      <Link href="/cycles">
        <a onClick={() => props.isMobile && props.closeMobileMenu()}>
          {props.isMobile && (
            <img
              src="/LinkImages/cycles.svg"
              height="18px"
              width="18px"
              alt="Cycles"
            />
          )}
          CYCLES
        </a>
      </Link>
      <Link href="/docs">
        <a onClick={() => props.isMobile && props.closeMobileMenu()}>
          {props.isMobile && (
            <img
              src="/LinkImages/docs.svg"
              height="18px"
              width="18px"
              alt="Docs"
            />
          )}
          DOCS
        </a>
      </Link>
      <Link href="/security">
        <a onClick={() => props.isMobile && props.closeMobileMenu()}>
          {props.isMobile && (
            <img
              src="/LinkImages/security.svg"
              height="18px"
              width="18px"
              alt="Security"
            />
          )}
          SECURITY
        </a>
      </Link>
      <Link href="/fees">
        <a onClick={() => props.isMobile && props.closeMobileMenu()}>
          {props.isMobile && (
            <img
              src="/LinkImages/fees.svg"
              height="18px"
              width="18px"
              alt="Fees"
            />
          )}
          FEES
        </a>
      </Link>
      {!userSession.isUserSignedIn() && (
        <Link href="/join" passHref={true}>
          <button onClick={() => props.isMobile && props.closeMobileMenu()}>
            Join
          </button>
        </Link>
      )}
      {userSession.isUserSignedIn() && (
        <Link href="/dashboard" passHref={true}>
          <button
            style={{ padding: "14px 24px" }}
            onClick={() => props.isMobile && props.closeMobileMenu()}
          >
            Add Funds
          </button>
        </Link>
      )}
    </div>
  );
};

export default NavLinks;
