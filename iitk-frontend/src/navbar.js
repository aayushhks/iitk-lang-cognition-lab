import React, { useState, useEffect } from 'react';
import iitlogo from './assets/logo.png';
// import './navbar.css';
import { useNavigate } from 'react-router-dom';

function Navbar(props) {
    const {
        isSignupPage,
        isLoginPage,
        homeIsDisabled,
        profileIsDisabled,
        myProjectsIsDisabled,
    } = props;
    const navigate = useNavigate();

    const [theme, setTheme] = useState('light'); // Default theme is light
    const [signUpOutText, setSignUpOutText] = useState(true);

    useEffect(() => {
        // console.log(signUpOutText, isSignupPage); // debug

        if (signUpOutText === 'Log in') {
            setSignUpOutText('Sign up');
            if (localStorage.length !== 0) {
                navigate('/home');
            }
        }
        if (isSignupPage) {
            setSignUpOutText("Log in");
            if (localStorage.length !== 0) {
                navigate('/home');
            }
        } else {
            if (localStorage.length === 0) {
                setSignUpOutText("Sign up");
            } else {
                setSignUpOutText("Sign out");
                if (isLoginPage) {
                    navigate('/home');
                }
            }
        }
    }, [signUpOutText, isSignupPage, isLoginPage, navigate]);

    useEffect(() => {
      const savedTheme = localStorage.getItem('theme') || 'light';
      setTheme(savedTheme);
    }, []);

    const toggleTheme = (e) => {
        const toggle = e.target;
        // console.log(toggle);

        setTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });

        // const toggle = document.querySelector('.toggle-theme-btn-navbar');
        // const hours = new Date().getHours();
        // toggle.checked = hours > 7 && hours < 20;    
    }

    useEffect(() => {
        // Dynamically import the CSS file based on the current theme
        const importTheme = async () => {
            // console.log(theme);

            if (theme === 'light') {
                await import('./navbar.css');
            } else {
                await import('./dark-navbar.css');
            }
        };

        importTheme();
    }, [theme]);

    const loginout = () => {
        if (signUpOutText === 'Log in') {
            setSignUpOutText('Sign up');
            navigate('/login');
        } else {
            if (isSignupPage) {
                setSignUpOutText("Log in");
            } else {
                if (localStorage.length === 0) {
                    setSignUpOutText("Sign up");
                    navigate('/signup');
                } else {
                    setSignUpOutText("Sign out");
                    localStorage.clear();
                    navigate('/login');
                }
            }
        }
    };

    return (
        <nav className={`navbar navbar-expand-lg ${theme == "dark" ? "navbar-dark bg-dark" : "navbar-light bg-light"} navbarr`}>
            <div className="container-fluid">
                <div className="d-flex align-items-center">
                    <img src={iitlogo} alt="IIT Logo" className="navbar-logo" />
                    <a className="navbar-brand" href="/">Language Cognition Lab</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownComponents" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Explore
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownComponents">
                                <li><a className={`dropdown-item ${homeIsDisabled ? 'disabled' : ''}`} href="/home">Home</a></li>
                                <li><a className={`dropdown-item ${profileIsDisabled ? 'disabled' : ''}`} href="/profile">Profile</a></li>
                                <li><a className={`dropdown-item ${myProjectsIsDisabled ? 'disabled' : ''}`} href="/my-projects">My Projects</a></li>
                                <li><a className="dropdown-item" href="/contact-us">Contact us</a></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownExamples" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Examples
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownExamples">
                                <li><a className="dropdown-item" href="/user-manual">User Manual</a></li>
                                <li><a className="dropdown-item" href="/serve-tour-1">Serve Tour 1</a></li>
                                <li><a className="dropdown-item" href="/serve-tour-2">Serve Tour 2</a></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#" onClick={loginout}>{signUpOutText}</a>
                        </li>
                        {/* <li>
                            <input onClick={(e) => toggleTheme(e)} className="toggle-theme-btn-navbar"></input>
                        </li> */}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

