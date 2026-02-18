import styles from "./header.module.scss";

import { NavLink } from "react-router-dom";

const Header = ({ theme = "dark", onToggleTheme }) => {
  const menuList = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contacts", path: "/contacts" },
    { name: "Works", path: "/works" },
  ];

  return (
    <nav className={styles.navbarContainer}>
      <div className={styles.brandRow}>
        <h1>TIEFFE</h1>
        <button className={styles.themeToggle} onClick={onToggleTheme}>
          {theme === "light" ? "Night" : "Day"}
        </button>
      </div>
      <div className={styles.navRight}>
        <ul className={styles.menuList}>
          {menuList.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                {item.name}
              </NavLink>{" "}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
