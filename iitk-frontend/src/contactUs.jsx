import React from 'react';
import Navbar from './navbar.js';
import Footer from './Footer.jsx';

import './ContactUs.css';

function ContactUs() {
  return (
    <div className="contact-page-contactus">
        <Navbar />
        <div className="contact-header-contactus">
            <h1 className="page-heading">Contact Us</h1>
            <p>Connect with us for any queries!</p>
        </div>

        <div className="contact-container-contactus">
          <div className="content-wrapper">
            <div className="left-col-contactus">
              <div className="contact-area-contactus">
                  <h2>Contact Information</h2>
                  <br />
                  <h4>Mr. Vivek Singh Sikarwar</h4>
                  <br />
                  <div>Department of Cognitive Science</div>
                  <div>IIT Kanpur</div>
                  <br/>
                  <div><b>Phone: </b>+91 9784594777</div>
                  <div><b>Email: </b>sikarwar@iitk.ac.in</div>
              </div>
            </div>

            <div className="right-col-contactus">
              <img className="contact-image" src="https://www.langcoglabcgsiitk.in/survey/assets/img/contact.png" alt="Contact Us" />
            </div>
          </div>
        </div>
        <Footer />
    </div>
  );
}

export default ContactUs;
