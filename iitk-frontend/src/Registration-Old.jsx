import './Registration.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Registration() {
    const navigate = useNavigate();
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const continueReg = async () => {
        if (!isChecked) {
            alert("Please agree to the terms before continuing the registration")
        } else {
            // Call registration function from flask
            const email = localStorage.getItem('email');
            const courseName = localStorage.getItem('courseName');
            const endpoint = 'http://localhost:4997/reg-course';
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
    }

    return (
    <div className="reg-page">
        <div className="header">
            <h2>Registration</h2>
            <p>Please accept following terms and conditions to take part in survey</p>
        </div>

    <nav class="navbar navbar-expand-lg navbar-light bg-light w-50 mx-auto">
    {/* <a class="navbar-brand" href="#">Navbar</a> */}
    {/* <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button> */}
    <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="nav nav-tabs mx-auto">
        <li class="nav-item active">
            <a class="nav-link" href="#">Terms</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="#">Payment</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="#">Survey Info</a>
        </li>
        {/* <li class="nav-item">
            <a class="nav-link disabled" href="#">Disabled</a>
        </li> */}
        </ul>
    </div>
    </nav>

    <div className="textbox">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias fugit facilis dignissimos voluptatem cupiditate eveniet dolores doloremque culpa! Soluta facilis magni nobis sapiente nemo iusto et, sed odit aliquam est!
    </div>

    <div class="form-check iagree">
        <input 
            class="form-check-input"
            type="checkbox"
            value=""
            id="flexCheckDefault"
            checked={isChecked}
            onChange={handleCheckboxChange}
        />
        <label class="form-check-label" htmlFor="flexCheckDefault">
            I Agree
        </label>
        <button onClick={continueReg} type="button" class="btn btn-primary continue-btn">Continue</button>
    </div>
    </div>
  )
}

export default Registration;
