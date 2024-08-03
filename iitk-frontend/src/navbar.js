// import React, { useState, useEffect, Component } from 'react';
// import iitlogo from './assets/logo.png';
// import './navbar.css';
// import { Link, Navigate, useNavigate } from 'react-router-dom';

// // import Login from './Login.js';
// import SignUp from './SignUp.js';
// // import InstructionValence from './instructionValence.jsx';
// // import ContactUs from './contactUs.jsx';
// // import HomePage from './Home.jsx';
// // import Registration from './Registration.jsx';
// // import AboutUs from './AboutUs.jsx';
// // import MyProjects from './MyProjects.jsx';
// // import UserManual from './UserManual.jsx';
// // import SurveyTour1 from './SurveyTour1.jsx';
// // import SurveyTour2 from './SurveyTour2.jsx';

// // import React from 'react'

// function Navbar(props) {
//     const {
//         isSignupPage,
//         isLoginPage,
//         homeIsDisabled,
//         profileIsDisabled,
//         myProjectsIsDisabled
//     } = props;
//     const navigate = useNavigate();

//     const [signUpOutText, setSignUpOutText] = useState(true);

//     useEffect(() => {

//         console.log(signUpOutText, isSignupPage); // debug

//         if (signUpOutText == 'Log in') {
//             // on sign up
//             setSignUpOutText('Sign up');
//             console.log("digger");
//             if (localStorage.length !== 0) {
//                 // logged in + i am in signup
//                 navigate('/home');
//                 console.log("licker");
//             }
//         }
//         if (isSignupPage) {
//             // i am in signup page
//             setSignUpOutText("Log in");
//             console.log("nigger");
//             if (localStorage.length !== 0) {
//                 // user signed in
//                 navigate('/home');
//             }
//         } else {
//             // non signup pages
//             if (localStorage.length === 0) {
//                 // signed out
//                 setSignUpOutText("Sign up");
//                 console.log("spout");
//             } else {
//                 // signed in
//                 setSignUpOutText("Sign out");
//                 console.log('ls-length', localStorage.length);
//                 if (localStorage.length !== 0) {
//                     if (isLoginPage) {
//                         navigate('/home');
//                     }
//                 }
//                 console.log("sout");
//             }
//         }
//     }, [])

//     const loginout = () => {
//         console.log(signUpOutText, isSignupPage);
//         if (signUpOutText == 'Log in') {
//             setSignUpOutText('Sign up');
//             navigate('/login');
//             console.log("spool");
//         } else {
//             if (isSignupPage) {
//                 setSignUpOutText("Log in");
//                 console.log("pool");
//             } else {
//                 if (localStorage.length === 0) {
//                     setSignUpOutText("Sign up");
//                     navigate('/signup');
//                     console.log("pop");
//                 } else {
//                     setSignUpOutText("Sign out");
//                     localStorage.clear();
//                     navigate('/login');
//                     console.log("top");
//                 }
//             }
//         }
//     }

//     return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-light navbarr">
//         <div className="container-fluid">
//             <div className="d-flex align-items-center">
//                 <img src={iitlogo} alt="IIT Logo" style={{ height: '50px', width: 'auto', marginRight: '15px' }} />
//                 <a className="navbar-brand" href="/">Language Cognition Lab</a>
//             {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
//                 <span className="navbar-toggler-icon"></span>
//             </button> */}
//             </div>
//             <div className="collapse navbar-collapse" id="navbarSupportedContent">
//                 <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
//                     <li className="nav-item dropdown">
//                         <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownComponents" role="button" data-bs-toggle="dropdown" aria-expanded="false">
//                             Explore
//                         </a>
//                         <ul className="dropdown-menu">
//                         {/* aria-labelledby="navbarDropdownComponents"> */}
//                             {/* <li><Link to="/SignUp">Action</Link></li> */}
//                             <li><a className="dropdown-item disabled={homeIsDisabled}" href="/home">Home</a></li>
//                             <li><a className="dropdown-item disabled={profileIsDisabled}" href="/profile">Profile</a></li>
//                             <li><a className="dropdown-item disabled={myProjectsIsDisabled}" href="/my-projects">My Projects</a></li>
//                             <li><a className="dropdown-item" href="/contact-us">Contact us</a></li>
//                             {/* <li><hr className="dropdown-divider" /></li>
//                             <li><a className="dropdown-item" href="/something-else">Something else here</a></li> */}
//                         </ul>
//                     </li>
//                     <li className="nav-item dropdown">
//                         <a className="nav-link dropdown-toggle" href="/" id="navbarDropdownExamples" role="button" data-bs-toggle="dropdown" aria-expanded="false">
//                             Examples
//                         </a>
//                         <ul className="dropdown-menu" aria-labelledby="navbarDropdownExamples">
//                             <li><a className="dropdown-item" href="/user-manual">User Manual</a></li>
//                             <li><a className="dropdown-item" href="/serve-tour-1">Serve Tour 1</a></li>
//                             <li><a className="dropdown-item" href="/serve-tour-2">Serve Tour 2</a></li>
//                             {/* <li><hr className="dropdown-divider" /></li> */}
//                         </ul>
//                     </li>
//                     <li className="nav-item">
//                         {/* <a className="nav-link" href="#">Signup</a> */}

//                         <a className="nav-link" href="#" onClick={loginout}>{signUpOutText}</a>
//                     </li>
//                 </ul>
//             </div>
//         </div>
//     </nav>
//     );
// }

// export default Navbar;

import React, { useState, useEffect } from 'react';
import iitlogo from './assets/logo.png';
import './navbar.css';
import { useNavigate } from 'react-router-dom';

function Navbar(props) {
    const {
        isSignupPage,
        isLoginPage,
        homeIsDisabled,
        profileIsDisabled,
        myProjectsIsDisabled
    } = props;
    const navigate = useNavigate();

    const [signUpOutText, setSignUpOutText] = useState(true);

    useEffect(() => {
        console.log(signUpOutText, isSignupPage); // debug

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
        <nav className="navbar navbar-expand-lg navbar-light bg-light navbarr">
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
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

