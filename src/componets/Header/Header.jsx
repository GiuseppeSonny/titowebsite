import styles from "./header.module.scss";

import { NavLink } from "react-router-dom";

const Header = () => {
  const menuList = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contacts", path: "/contacts" },
    { name: "Works", path: "/works" },
  ];

  return (
    <nav className={styles.navbarContainer}>
      <h1>My Website</h1>
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
    </nav>
  );
};

export default Header;
