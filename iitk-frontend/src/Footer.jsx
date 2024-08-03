import './Footer.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Footer(props) {
    const { changePage } = props;
    const navigate = useNavigate();
    return (
        <div className="footer">
        <div className="upper-bar">
            <div className="upper-text">
            <h3 className="text-1">Thank you for supporting us!</h3>
            <h3 className="text-2">Let's get in touch on any of these platforms</h3>
            </div>
            <div className="icons-row">
            <a
                target="_blank"
                className="icon-link-a"
                href="https://www.linkedin.com/in/vivek-singh-sikarwar-07373817/"
            >
                <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a
                target="_blank"
                className="icon-link-a"
                href="https://www.linkedin.com/in/vivek-singh-sikarwar-07373817/"
            >
                <i className="fa fa-facebook"></i>
            </a>
            <a
                target="_blank"
                className="icon-link-a"
                href="https://www.linkedin.com/in/vivek-singh-sikarwar-07373817/"
            >
                <i className="fa fa-instagram"></i>
            </a>
            <a
                target="_blank"
                className="icon-link-a"
                href="https://www.linkedin.com/in/vivek-singh-sikarwar-07373817/"
            >
                <i className="fa fa-linkedin"></i>
            </a>
            </div>
        </div>
        <div className="lower-bar">
            <p className="lower-bar-text">
            &copy; Copyright <b>IIT Kanpur..</b> All Rights Reserved
            </p>
            <div className="lower-nav-items">
            <p className="page-link-text" onClick={() => navigate('/contact-us')}>
                Contact us
            </p>
            <p className="page-link-text" onClick={() => navigate('/about-us')}>
                About us
            </p>
            <p className="page-link-text" onClick={() => navigate('/about-us')}>
                Blog
            </p>
            <p className="page-link-text" onClick={() => navigate('')}>
                MIT License
            </p>
            </div>
        </div>
        </div>
    );
}

export default Footer;
