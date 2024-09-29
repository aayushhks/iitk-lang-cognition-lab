import React, { Suspense, useEffect, useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { CSpinner, useColorModes } from '@coreui/react';
import './scss/style.scss';
// import { ip } from '../../iitk2/lang-cognition-lab/iitk-frontend/src/config.js';
// import Authentication from './views/pages/Authentication';

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));
// const Logout = React.lazy(() => import('./views/pages/Logout'));
// const Authentication = React.lazy(() => import('./views/pages/Authentication'));

const App = () => {
  // const navigate = useNavigate();

  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const storedTheme = useSelector((state) => state.theme);
  const [ adminLoggedIn, setAdminLoggedIn ] = useState(true); // Default Logged Out
  const [ isAuthRouteDone, setIsAuthRouteDone ] = useState(false);


  const getAdminTokenIsValid = async (token) => {
    try {
      const endpoint = `${ip[0]}/is-token-valid`;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      if (result.success === true) {
        localStorage.setItem('email', result.email);
        setAdminLoggedIn(true);
        // localStorage.setItem('email', result.email);
        return true;
      } else {
        console.log("Error: ", result.err);
        return false;
      }
    } catch (error) {
      console.log('An error occurred:', error);
    }
  }

  useEffect(() => {
    console.log(isAuthRouteDone)

    // Admin Login Check on Reload
    if (isAuthRouteDone) {
      if (localStorage.getItem("auth_token")) {
        getAdminTokenIsValid(localStorage.getItem("auth_token"));
      } else {
        window.location.href = 'http://10.162.20.250:3000/login'; // Change this URL as needed
      }
    }
  }, [isAuthRouteDone])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]

    // getAdminLoggedIn();

    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >

        <Routes>
          {/* <Route exact path="/auth/:token" name="Authentication" element={
            <Authentication
              setIsAuthRouteDone={setIsAuthRouteDone}
            />
          } />
          <Route exact path="/logout" name="Logout" element={<Logout />} /> */}          {
            (adminLoggedIn)
            &&
            (
              <>
                <Route exact path="/login" name="Login Page" element={<Login />} />
                <Route exact path="/register" name="Register Page" element={<Register />} />
                <Route exact path="/404" name="Page 404" element={<Page404 />} />
                <Route exact path="/500" name="Page 500" element={<Page500 />} />
                <Route path="*" name="Home" element={<DefaultLayout />} />
              </>
            )
          }
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App;
