import { useState } from 'react';
import styles from './NavBar.module.css';
import yrgoLogo from '../../assets/yrgo-logo.svg';
import hamburgerIcon from '../../assets/hamburger-icon.svg';


export default function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const menuItems = [
        { label: 'Registration', href: '#registration' },
        { label: 'Explore Participants', href: '#explore' },
        { label: 'Student Login', href: '#login' },
        { label: 'Likes', href: '#likes' }
    ];

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <img src={yrgoLogo} alt="Yrgo Logo" />
            </div>
            <div 
                className={styles.hamburger}
                onClick={toggleMenu}
                role="button"
                tabIndex="0"
                aria-label="Toggle menu"
            >
                <img src={hamburgerIcon} alt="Hamburger Icon" />
            </div>
            
            {isMenuOpen && (
                <ul className={styles.menu}>
                    {menuItems.map((item) => (
                        <li key={item.label}>
                            <a href={item.href}>{item.label}</a>
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
}