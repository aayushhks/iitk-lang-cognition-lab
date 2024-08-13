// import './App.css';
import React, { useState, useEffect } from 'react';

import Login from './Login.js';
import SignUp from './SignUp.js';
import ContactUs from './contactUs.jsx';
import Course from './Course.jsx';
import HomePage from './Home.jsx';
import MyProjects from './MyProjects.jsx';
import Registration from './Registration.jsx';
import UserManual from './UserManual.jsx';
import SurveyTour1 from './SurveyTour1.jsx';
import SurveyTour2 from './SurveyTour2.jsx';
import AboutUs from './AboutUs.jsx';
import MyProfile from './MyProfile.jsx';
import UpdatePassword from './password.jsx';

import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom';

function App() {
    const [theme, setTheme] = useState('light'); // Default theme is light

    useEffect(() => {
      const savedTheme = localStorage.getItem('theme') || 'light';
      setTheme(savedTheme);
    }, []);

    // Function to toggle the theme
    const toggleTheme = () => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    };

    useEffect(() => {
        // Dynamically import the CSS file based on the current theme
        const importTheme = async () => {
            if (theme === 'light') {
                await import('./App.css');
            } else {
                await import('./dark-App.css');
            }
        };

        importTheme();
    }, [theme]);

  return (
    <div className="app">
      <BrowserRouter>
          <Routes>
            <Route path="" element={<Login />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/course" element={<Course />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/my-projects" element={<MyProjects />}/>
            <Route path="/user-manual" element={<UserManual />}/>
            <Route path="/survey-tour-1" element={<SurveyTour1 />}/>
            <Route path="/survey-tour-2" element={<SurveyTour2 />}/>
            <Route path="/profile" element={<MyProfile />}/>
            <Route path="/password" element={<UpdatePassword />}/>
            {/* <Route path="/passwordreset/:resetToken" element={<ResetPasswordScreen/>}/> */}
          </Routes>
      </BrowserRouter>
    </div>
  )

}

export default App;
