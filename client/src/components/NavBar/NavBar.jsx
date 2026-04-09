import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './NavBar.module.css';
import yrgoLogo from '../../assets/yrgo-logo.svg';
import hamburgerIcon from '../../assets/hamburger-icon.svg';
import Button from '../Buttons/Button';

export default function NavBar() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
    };

    return (
        <div className={`${styles.navWrapper} ${isMenuOpen ? styles.navWrapperOpen : ''}`}>
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
            </nav>

            {isMenuOpen && (
                <div id="nav-menu" className={styles.menu}>
                    <div className={styles.regExpButtonWrapper}>
                        <Button
                            buttonName="Register"
                            variant="redWhiteBorder"
                            ariaLabel="Register"
                            onClick={() => navigate("/")}
                        />
                        <Button
                            buttonName="Explore"
                            buttonColor="gray"
                            ariaLabel="Explore"
                            onClick={() => navigate("/explore")}
                        />
                    </div>
                    <Button
                        buttonName="About and Contact"
                        buttonColor="transparent"
                        variant="textUnderline"
                        ariaLabel="About and Contact"
                        onClick={() => navigate("/about")}
                    />
                    
                    <div className={styles.studentLoginButton}>
                        <Button
                            buttonName="Student Login"
                            buttonColor="transparent"
                            iconSrc="profileIcon"
                            iconLeft={true}
                            variant="textUnderline"
                            ariaLabel="Student Login"
                            onClick={() => navigate("/login")}
                        />
                    </div>
                    
                    
                    
                </div>
            )}
        </div>
    );
}