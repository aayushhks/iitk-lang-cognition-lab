import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import './Login.css';

import Navbar from './navbar.js';
import { ip } from './config'
// import Footer from './Footer.jsx';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validated, setValidated] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);

    const [statusMessage, setStatusMessage] = useState(false);
    const [invalidLogin, setInvalidLogin] = useState(false);
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');

    const [isPasswordInvalid, setIsPasswordInvalid] = useState(false); // ADDED
    const [isEmailInvalid, setIsEmailInvalid] = useState(false); // ADDED

    const update_users_online = async () => {
        const email_add = localStorage.getItem("email");
        try {
            const response = await fetch(`${ip[0]}/update-online-users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "email_add": email_add }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            // console.log(result);
            // setOnlineUsers(result);
        } catch (error) {
            console.log('An error occurred:', error);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        } else {
            // Handle the login logic here
            try {
                const response = await fetch(`${ip[0]}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const result = await response.json();

                if (result.success === true) {
                    // Valid Login
                    setInvalidLogin(false);
                    setIsEmailInvalid(false);
                    setIsPasswordInvalid(false);

                    const token = result.auth_token;

                    setShowAlert(true);
                    localStorage.setItem('userinfo', JSON.stringify(result.data));
                    localStorage.setItem('email', email);
                    localStorage.setItem('auth_token', token);

                    if (result.data.isadmin === true) {
                        console.log('done');
                        if (token) {
                            window.location.href = `${ip[1]}/auth/${token}`;
                        } else {
                            console.log("Err: No auth token");
                        }
                    } else {
                        update_users_online();
                        navigate('/home');
                    }
                } else {
                    // Invalid Login
                    setInvalidLogin(true);
                    setStatusMessage("Either password or email is incorrect");
                    setMessage(result.message || 'Login failed');
                    setShowAlert(false);

                    setIsPasswordInvalid(true); // ADDED
                    setIsEmailInvalid(true); // ADDED
                }
            } catch (error) {
                setMessage('An error occurred');
            }
        }
    }

    const handleForgotPassword = (event) => {
        event.preventDefault();

        // Handle the password reset logic here
        console.log('Reset request sent for email:', email);
        setForgotPassword(true);
    }

    return (
        <>
            <Navbar />
            <Container className="login-container">
                <Row className="justify-content-md-center">
                    <Col md={6} lg={4}>
                        <Card className="login-card">
                            <Card.Body>
                                <Card.Title className="text-center">Login</Card.Title>
                                {showAlert && <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                                    Login successful!
                                </Alert>}
                                {forgotPassword && <Alert variant="info" onClose={() => setForgotPassword(false)} dismissible>
                                    Password reset instructions have been sent to your email.
                                </Alert>}
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={isEmailInvalid ? 'is-invalid' : ''} // Apply 'is-invalid' class if email is invalid
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {/* Please provide a valid email. */}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={isPasswordInvalid ? 'is-invalid' : ''} // Apply 'is-invalid' class if password is invalid
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {/* Please provide a password. */}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    {invalidLogin && (
                                        <div className="status-msg">
                                            {statusMessage}
                                        </div>
                                    )}
                                    <Button variant="primary" type="submit" className="w-100 mt-3 login-btn">
                                        Login
                                    </Button>

                                    <div className="bottom-area">
                                        <div className="text-left mt-2">
                                            <Button variant="link" onClick={() => setForgotPassword(true)}>
                                                Forgot Password?
                                            </Button>
                                        </div>
                                        Don't have an account?&nbsp;
                                        <a href="/signup" className='signup-link'>
                                            Register
                                        </a>
                                    </div>
                                </Form>

                                {forgotPassword && (
                                    <Form className="mt-4" onSubmit={handleForgotPassword}>
                                        <Form.Group controlId="formResetEmail">
                                            <Form.Label>Enter your email address to reset your password</Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="Enter email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid email.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Button variant="primary" type="submit" className="w-100 mt-3">
                                            Reset Password
                                        </Button>
                                    </Form>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Login;
