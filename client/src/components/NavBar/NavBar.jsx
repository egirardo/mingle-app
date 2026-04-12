import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './NavBar.module.css';
import yrgoLogo from '../../assets/yrgo-logo.svg';
import hamburgerIcon from '../../assets/hamburger-icon.svg';
import Button from '../Buttons/Button';

export default function NavBar() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navRef = useRef(null);

    const toggleMenu = () => setIsMenuOpen(prev => !prev);
    const closeMenu = () => setIsMenuOpen(false);

    // Close when clicking outside the navbar
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                closeMenu();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    const handleNavigate = (path) => {
        closeMenu();
        navigate(path);
    };

    return (
        <div ref={navRef} className={`${styles.navWrapper} ${isMenuOpen ? styles.navWrapperOpen : ''}`}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>
                    <Link to="/" onClick={closeMenu}>
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
            </nav>

            {isMenuOpen && (
                <div id="nav-menu" className={styles.menu}>
                    <div className={styles.regExpButtonWrapper}>
                        <Button buttonName="Register" variant="primaryRed" ariaLabel="Register" onClick={() => handleNavigate("/")} />
                        <Button buttonName="Explore" variant="primaryGray" ariaLabel="Explore" onClick={() => handleNavigate("/explore")} />
                    </div>
                    <Button buttonName="About and Contact" variant="transparentUnderlinePrimary" ariaLabel="About and Contact" onClick={() => handleNavigate("/about")} />
                    <div className={styles.studentLoginButton}>
                        <Button buttonName="Student Login" buttonColor="transparent" iconSrc="profileIcon" iconLeft={true} variant="transparentUnderlinePrimary" ariaLabel="Student Login" onClick={() => handleNavigate("/login")} />
                    </div>
                </div>
            )}
        </div>
    );
}