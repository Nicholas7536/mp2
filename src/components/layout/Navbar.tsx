import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <NavLink to="/gallery" className={styles.brand}>
          <div className={styles.dragonBallIcon}>★</div>
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>Dragon Ball Explorer</span>
            <span className={styles.brandSubtitle}>CS409 Front-End</span>
          </div>
        </NavLink>

        <nav className={styles.navLinks} aria-label="Main Navigation">
          <NavLink
            to="/gallery"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
            }
          >
            Gallery View
          </NavLink>
          <NavLink
            to="/list"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
            }
          >
            Search & List
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
