import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './NavBar.module.css';
import yrgoLogo from '../../assets/yrgo-logo.svg';
import hamburgerIcon from '../../assets/hamburger-icon.svg';
import Button from '../Buttons/Button';

export default function NavBar() {
    const [selectedButtons, setSelectedButtons] = useState({});
    const navigate = useNavigate();

    const handleButtonClick = (buttonId, destination) => {
        setSelectedButtons({ ...selectedButtons, [buttonId]: true });
        navigate(destination);
    };
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
                            variant={selectedButtons.register ? 'secondaryRed' : 'primaryRed'}
                            ariaLabel="Register"
                            onClick={() => handleButtonClick('register', "/")}
                        />
                        <Button
                            buttonName="Explore"
                            variant={selectedButtons.explore ? 'secondaryGray' : 'primaryGray'}
                            ariaLabel="Explore"
                            onClick={() => handleButtonClick('explore', "/explore")}
                        />
                    </div>
                    <Button
                        buttonName="About and Contact"
                        variant={selectedButtons.about ? 'transparentUnderlineSecondary' : 'transparentUnderlinePrimary'}
                        ariaLabel="About and Contact"
                        onClick={() => handleButtonClick('about', "/about")}
                    />
                    
                    <div className={styles.studentLoginButton}>
                        <Button
                            buttonName="Student Login"
                            buttonColor="transparent"
                            iconSrc="profileIcon"
                            iconLeft={true}
                            variant={selectedButtons.login ? 'transparentUnderlineSecondary' : 'transparentUnderlinePrimary'}
                            ariaLabel="Student Login"
                            onClick={() => handleButtonClick('login', "/login")}
                        />
                    </div>
                    
                    
                    
                </div>
            )}
        </div>
    );
}