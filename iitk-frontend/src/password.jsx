import React from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import './password.css'
import Navbar from './navbar.js';
import Footer from './Footer.jsx';


const ChangePassword = () => {
    return (
        <>
        <Navbar/>

        <Container>
        <Row className="justify-content-center">
            <Col md={6}>
            <div className="p-4 mt-5 border rounded bg-white shadow-sm">
                <h3 className="text-center text-primary mb-4">Change Password</h3>
                <Form>
                <Form.Group as={Row} className="mb-3" controlId="formOldPassword">
                    <Form.Label column sm="2">
                    <FontAwesomeIcon icon={faKey} />
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control type="password" placeholder="Old Password" />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formNewPassword">
                    <Form.Label column sm="2">
                    <FontAwesomeIcon icon={faKey} />
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control type="password" placeholder="New Password" />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formConfirmPassword">
                    <Form.Label column sm="2">
                    <FontAwesomeIcon icon={faKey} />
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control type="password" placeholder="Confirm Password" />
                    </Col>
                </Form.Group>

                <div className="text-center">
                    <Button variant="primary" type="submit">
                    Update
                    </Button>
                </div>
                </Form>
            </div>
            </Col>
        </Row>
        </Container>
        <Footer/>
        </>
    );
};

export default ChangePassword;
