import styles from "./header.module.scss";

import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const Header = ({ theme = "dark", onToggleTheme }) => {
  const { isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const onAdminPage = location.pathname.startsWith("/admin");
  const [worksDropdown, setWorksDropdown] = useState(false);

  const menuList = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contacts", path: "/contacts" },
    { name: "Photos", path: "/photos" },
  ];

  const worksSubpages = [
    { name: "Recent", path: "/works" },
    { name: "Internal", path: "/works/internal" },
    { name: "External", path: "/works/external" },
    { name: "Future", path: "/works/future" },
    { name: "Old", path: "/works/old" },
  ];

  return (
    <nav className={styles.navbarContainer}>
      <div className={styles.brandRow}>
        <h1>TIEFFE artworks</h1>
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
          <li
            className={styles.worksDropdown}
            onMouseEnter={() => setWorksDropdown(true)}
            onMouseLeave={() => setWorksDropdown(false)}
          >
            <span className={styles.worksBtn}>Works</span>
            {worksDropdown && (
              <div className={styles.dropdownMenu}>
                {worksSubpages.map((sub) => (
                  <NavLink
                    key={sub.path}
                    to={sub.path}
                    className={({ isActive }) => (isActive ? styles.active : "")}
                  >
                    {sub.name}
                  </NavLink>
                ))}
              </div>
            )}
          </li>
          {isAdmin && (
            <li>
              <button className={styles.adminBtn} onClick={() => navigate("/admin")}>
                ⚡ Admin
              </button>
            </li>
          )}
          {!user && (
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) => (isActive ? styles.active : styles.devLink)}
              >
                Dev
              </NavLink>
            </li>
          )}
          {onAdminPage && user && (
            <li>
              <button className={styles.backBtn} onClick={() => navigate("/")}>
                ← Site
              </button>
            </li>
          )}
          {onAdminPage && user && (
            <li>
              <button className={styles.logoutBtn} onClick={logout}>
                Sign out
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
