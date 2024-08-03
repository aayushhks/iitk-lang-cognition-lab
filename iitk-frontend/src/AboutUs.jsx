import './AboutUs.css';
import Footer from './Footer.jsx';
import Navbar from './navbar.js';
import React from 'react';

function AboutUs() {
  return (
    <>
      <Navbar />
    <div className="about-page">
      <h1 className="page-heading">About Us</h1>

    <div className="main-area row">
      <div className="left-col col-lg-6 col-md-6">
        <img className="left-col-img" src="https://www.langcoglabcgsiitk.in/survey/assets/img/about.jpg" alt="babel-img" />
        <h2 className="caption">The Tower of Babel - by Pieter Bruegel</h2>
        <p className="credit-text">
        (Image Credit: commons.wikimedia.org)
        </p>
      </div>
      <div className="right-col col-lg-6 col-md-6">
        <p className='para'>
            We are the Language and Cognition Lab. We are housed in the Department of Cognitive Science at IIT Kanpur.
        </p>

        <p className="para">
            We are interested in understanding how people acquire, produce and understand languages.
            More specifically, we are interested in understanding processes of word reading, and bilingualism/multilingualism.
            We have started working in Indian languages especially Hindi and will be expanding our work to other Indian languages as well.
            The website for our lab, where you can look for other details is:
        </p>

        <a target='_blank' className="redirect-link" href="https://sites.google.com/view/langcoglabiitk/home">View Site</a>
      </div>
    </div>
    <Footer />
    </div>
    </>
  )
}

export default AboutUs;
