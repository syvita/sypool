import styles from "../../styles/Settings.module.css";
import { useConnect } from "../../lib/auth";

const Settings = () => {
  const { handleSignOut } = useConnect();

  return (
    <div className={styles.settings}>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default Settings;
