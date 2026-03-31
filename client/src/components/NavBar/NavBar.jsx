import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';
import yrgoLogo from '../../assets/yrgo-logo.svg';
import hamburgerIcon from '../../assets/hamburger-icon.svg';

export default function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
    };

    const menuItems = [
        { label: 'Registration', to: '/signup/student' },
        { label: 'Explore Participants', to: '/explore' },
        { label: 'Student Login', to: '/login' },
        { label: 'Likes', to: '/likes' }
    ];

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link to="/">
                    <img src={yrgoLogo} alt="Yrgo Logo" />
                </Link>
            </div>
            <button
                type="button"
                className={styles.hamburger}
                onClick={toggleMenu}
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
                aria-controls="nav-menu"
            >
                <img src={hamburgerIcon} alt="Hamburger Icon" />
            </button>
            
            {isMenuOpen && (
                <ul id="nav-menu" className={styles.menu}>
                    {menuItems.map((item) => (
                        <li key={item.label}>
                            <Link to={item.to}>{item.label}</Link>
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
}