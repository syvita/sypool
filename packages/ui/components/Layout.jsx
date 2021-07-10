import Navbar from "./Navbar";
import Head from 'next/head'

const Layout = ({ children }) => {
  return (
    <div>
      <Head>
        <script async src="https://arc.io/widget.min.js#3rsnfHXA"></script>
      </Head>
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
