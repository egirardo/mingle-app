import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import styles from './NavBar.module.css';
import yrgoLogo from '../../../assets/yrgo-logo.svg';
import hamburgerIcon from '../../../assets/hamburger-icon.svg';
import Button from '../../Atoms/Buttons/Button';

export default function NavBar() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [studentId, setStudentId] = useState(null);
    const navRef = useRef(null);

    const checkAuth = () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = jwtDecode(token);
                if (payload?.id) {
                    setIsLoggedIn(true);
                    setStudentId(payload.id);
                    return;
                }
            } catch (err) {
                console.error('Failed to decode token:', err);
            }
        }
        setIsLoggedIn(false);
        setStudentId(null);
    };

    useEffect(() => {
        checkAuth();

        // Handles login/logout in other tabs
        window.addEventListener('storage', checkAuth);
        // Handles login/logout in the same tab
        window.addEventListener('authchange', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('authchange', checkAuth);
        };
    }, []);

    const toggleMenu = () => setIsMenuOpen(prev => !prev);
    const closeMenu = () => setIsMenuOpen(false);

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

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('authchange'));
        closeMenu();
        navigate('/');
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
                        {isLoggedIn && studentId ? (
                          <>
                            <Button buttonName="Profile" buttonColor="transparent" iconSrc="profileIcon" iconLeft={true} variant="transparentUnderlinePrimary" ariaLabel="Go to profile" onClick={() => handleNavigate(`/students/${studentId}`)} />
                            <Button buttonName="Logout" buttonColor="transparent" variant="transparentUnderlinePrimary" ariaLabel="Logout" onClick={handleLogout} />
                          </>
                        ) : (
                          <Button buttonName="Student Login" buttonColor="transparent" iconSrc="profileIcon" iconLeft={true} variant="transparentUnderlinePrimary" ariaLabel="Student Login" onClick={() => handleNavigate("/login")} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}