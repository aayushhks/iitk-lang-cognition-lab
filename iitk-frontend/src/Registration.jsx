import Footer from './Footer.jsx';
import Navbar from './navbar.js';
import './Registration.css';
import React, { useState, useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import getInstructionComponent from "./instructionGetter.js";

function Registration() {
    const navigate = useNavigate();
    const [isChecked, setIsChecked] = useState(false);
    const [key, setKey] = useState('terms');
    const [isVisiblePopup, setIsVisiblePopup] = useState(false);

    useEffect(() => {
        if (localStorage.courseName === undefined) {
            navigate('/home')
        }
        if (localStorage.length === 0) {
            navigate('/login')
        } else {
            // getCardsInfo(4);
        }
    }, [])

    const togglePopup = () => {
        setIsVisiblePopup(!isVisiblePopup);
    };

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const continueReg = async () => {
        if (!isChecked) {
            alert("Please agree to the terms before continuing the registration");
        } else {
            const email = localStorage.getItem('email');
            const courseName = localStorage.getItem('courseName');
            const endpoint = 'http://localhost:4999/reg-course';
            if (courseName !== null) {
                try {
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify([email, courseName]),
                    });

                    const result = await response.json();
                    alert(result.msg);
                    navigate('/course');
                } catch (error) {
                    console.log('An error occurred');
                }
            }
        }
    };

    return (
        <>
        <Navbar />
        {isVisiblePopup &&
            (
                getInstructionComponent(togglePopup)
            )
        }
        <div className="reg-page">
            <div className="header">
                <h2>Registration</h2>
                <div className='instruction'>
                    <button onClick={togglePopup} type="button" class="btn btn-primary">Instructions</button>
                </div>
                <p>Please accept the following terms and conditions to take part in the survey</p>
            </div>
            <Tabs id="controlled-tab-example" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3 custom-tabs">
                <Tab eventKey="terms" title="Terms">
                    <div className="textbox">
                        Participants must complete all the blocks, otherwise their ratings will not be included in the analysis.
                    </div>
                </Tab>
                <Tab eventKey="payment" title="Payment">
                    <div className="textbox">
                        Payment information will be displayed here.
                    </div>
                </Tab>
                <Tab eventKey="survey-info" title="Survey Info">
                    <div className="textbox">
                        Survey information will be displayed here.
                    </div>
                </Tab>
            </Tabs>
            <div className="form-check iagree">
                <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                    I Agree
                </label>
            </div>
            <button onClick={continueReg} type="button" className="btn btn-primary continue-btn">Continue</button>
        </div>
        <Footer />
        </>
    );
}

export default Registration;
