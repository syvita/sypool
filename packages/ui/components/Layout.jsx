import NavBar from "./NavBar/NavBar";

const Layout = ({ children }) => {
  return (
    <div>
      <NavBar />
      {children}
    </div>
  );
};

export default Layout;
