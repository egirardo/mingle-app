import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './NavBar.module.css';
import yrgoLogo from '../../../assets/yrgo-logo.svg';
import hamburgerIcon from '../../../assets/hamburger-icon.svg';
import Button from '../../Atoms/Buttons/Button';
import { useSaved } from '../../../context/SavedContext';
import { apiFetch } from '../../../api';

export default function NavBar() {
    const navigate = useNavigate();
    const { isLoggedIn, studentId } = useSaved();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    const toggleMenu = () => setIsMenuOpen(prev => !prev);
    const closeMenu = () => setIsMenuOpen(false);

    const handleNavigate = (path) => {
        closeMenu();
        navigate(path);
    };

    const handleLogout = async () => {
        try {
            await apiFetch('/api/students/logout', { method: 'POST' });
        } catch {
            // Proceed with client-side logout even if request fails
        }
        window.dispatchEvent(new CustomEvent('authchange', { detail: { id: null } }));
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
