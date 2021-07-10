import NavBar from "./NavBar/NavBar";
import Head from "next/head";

const Layout = ({ children }) => {
  return (
    <div>
      <Head>
      <script async src="https://arc.io/widget.min.js#3rsnfHXA"></script>
      </Head>
      <NavBar />
      {children}
    </div>
  );
};

export default Layout;
