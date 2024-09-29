import Navbar from './navbar.js';
import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
import './myprofile.css'
import { ip } from './config'

function MyProfile() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        gender: '',
        dateOfBirth: '',
        education: '',
        occupation: '',
        Till12thclass: '',
        graduation: '',
        afterGraduation: '',
        motherTongue: '',
        secondaryLanguage: '',
        otherLanguage: '',
        proficiencyMotherTongue: '',
        proficiencySecondaryLanguage: '',
        proficiencyOtherLanguage: '',
        ageAcquisitionMotherTongue: '',
        ageAcquisitionSecondaryLanguage: '',
        handedness: '',
        vision: '',
        familyIncome: '',
        languageUse: '',
        currentLocation: '',
        hailFrom: '',
        privacyPolicy: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: (type === 'checkbox') ? (
                checked
                ? [...formData[name], value]
                : [...formData[name]].filter(item => item !== value)
            ): value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        const email=localStorage.email
        // Handle form submission logic
        try {
            const response = await fetch(`${ip[0]}/update-profile`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "formData":formData , "email":email}),
            });

            const result = await response.json();
            if (result.success === true) {
                // Valid Login
                console.log("yay");
            } else {
                // Invalid Login
                console.log("no");
            }
        } catch (error) {
            console.log('An error occurred');
        }
    };

    const getProfile = async () => {
        // e.preventDefault();
        const email = localStorage.email;
        console.log(formData);
        // Handle form submission logic
        try {
            const response = await fetch(`${ip[0]}/get-profile`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();
            if (result.success === true) {
                // Valid Login
                console.log("yay");
            } else {
                // Invalid Login
                console.log("no");
            }

            console.log(result);

            setFormData({
                email: localStorage.email,
                name: result.profile.name,
                // password: '',
                gender: result.profile.gender,
                dateOfBirth: result.profile.dateOfBirth ,
                education: result.profile.education,
                occupation: result.profile.occupation,
                mediumOfEducation: result.profile.mediumOfEducation,
                graduation: result.profile.graduation,
                afterGraduation: result.profile.afterGraduation,
                motherTongue: result.profile.motherTongue,
                secondaryLanguage: result.profile.secondaryLanguage,
                otherLanguage: result.profile.otherLanguage,
                proficiencyMotherTongue: result.profile.proficiencyMotherTongue,
                proficiencySecondaryLanguage: result.profile.proficiencySecondaryLanguage,
                proficiencyOtherLanguage: result.profile.proficiencyOtherLanguage,
                ageAcquisitionMotherTongue: result.profile.ageAcquisitionMotherTongue,
                ageAcquisitionSecondaryLanguage: result.profile.ageAcquisitionSecondaryLanguage,
                handedness: result.profile.handedness,
                vision: result.profile.vision,
                familyIncome: result.profile.familyIncome,
                languageUse: result.profile.languageUse,
                currentLocation: result.profile.currentLocation,
                hailFrom: result.profile.hailFrom,
                privacyPolicy: result.profile.privacyPolicy,
            })

            return result;
        } catch (error) {
            console.log('An error occurred');
            return null;
        }
        return null;
    };

    useEffect(() => {
        getProfile();
    }, [])
    
    return (
        <>
        <Navbar isMyProfilePage={true}/>
        <Container className="signup-container">
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <Card className="signup-card">
                        <Card.Body>
                            <Card.Title className="text-center">My Profile</Card.Title>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="formName">
                                            <Form.Label><b>Name</b></Form.Label>
                                            <Form.Control type="text" placeholder="Name" name="name" value={formData.name} onChange={handleChange} required />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="formEmail">
                                            <Form.Label><b>Email</b></Form.Label>
                                            <Form.Control type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} required />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="formPassword">
                                            <Form.Label><b>Password</b></Form.Label>
                                            <Form.Control type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} required />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="formGender">
                                            <Form.Label><b>Gender</b></Form.Label>
                                            <Form.Control as="select" name="gender" value={formData.gender} onChange={handleChange} required>
                                                <option value="" disabled>Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="formDOB">
                                            <Form.Label><b>Date of Birth</b></Form.Label>
                                            <Form.Control type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="formEducation">
                                            <Form.Label><b>Educational Background</b></Form.Label>
                                            <Form.Control as ="select" placeholder="Your Education" name="education" value={formData.education} onChange={handleChange} required >
                                                <option value="" disabled>Your Education</option>
                                                <option value="Senior Secondary">Senior Secondary</option>
                                                <option value="Bachelor's Degree">Bachelor's Degree</option>
                                                <option value="Master's degree">Master's degree</option>
                                                <option value="PHD & other">PHD & other</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="formOccupation" className='adj-row'>
                                            <Form.Control as ="select" name="occupation" value={formData.occupation} onChange={handleChange} required >
                                                <option value="" disabled>Occupation</option>
                                                <option value="Governement Job">Governement Job</option>
                                                <option value="Private Job">Private Job</option>
                                                <option value="Self Employeed">Self Employeed</option>
                                                <option value="Students">Students</option>
                                                <option value="Other">Other</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="formMedium_Education">
                                            <Form.Label><b>Medium of Education</b></Form.Label>
                                            <Form.Control as="select" name="Till12thclass" value={formData.Till12thclass} onChange={handleChange} required>
                                                <option value="" disabled>Till 12th</option>
                                                <option value="English Medium">English Medium</option>
                                                <option value="Hindi Medium">Hindi Medium</option>
                                                <option value="Other">Other</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="form_MediumEducation2" className='adj-row'>
                                            <Form.Control as="select" name="graduation" value={formData.graduation} onChange={handleChange} required>
                                                <option value="" disabled>Graduation</option>
                                                <option value="English Medium">English Medium</option>
                                                <option value="Hindi Medium">Hindi Medium</option>
                                                <option value="Other">Other</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="_formMediumEducation3">
                                            <Form.Control as="select" name="afterGraduation" value={formData.afterGraduation} onChange={handleChange} required>
                                                <option value="" disabled>After Graduation</option>
                                                <option value="English Medium">English Medium</option>
                                                <option value="Hindi Medium">Hindi Medium</option>
                                                <option value="Other">Other</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="formMotherTongue" >
                                            <Form.Label><b>Language Known</b></Form.Label>
                                            <Form.Control as="select" name="motherTongue" value={formData.motherTongue} onChange={handleChange} required>
                                                <option value="" disabled>Mother Tongue</option>
                                                <option value="Assamese">Assamese </option>
                                                <option value="Bengali ">Bengali </option>
                                                <option value="Bodo">Bodo </option>
                                                <option value="Dogri ">Dogri </option>
                                                <option value="English">English</option>
                                                <option value="Gujarati ">Gujarati </option>
                                                <option value="Hindi">Hindi</option>
                                                <option value="Kannada">Kannada</option>
                                                <option value="Kashmiri ">Kashmiri </option>
                                                <option value="Konkani">Konkani </option>
                                                <option value="Malayalam">Malayalam</option>
                                                <option value="Manipuri ">Manipuri or Meithei </option>
                                                <option value="Marathi">Marathi </option>
                                                <option value="Nepali ">Nepali </option>
                                                <option value="Oriya">Oriya </option>
                                                <option value="Punjabi">Punjabi </option>
                                                <option value="Sanskrit">Sanskrit</option>
                                                <option value="Santali ">Santali </option>
                                                <option value="Sindhi">Sindhi </option>
                                                <option value="Tamil">Tamil </option>
                                                <option value="Telugu ">Telugu </option>
                                                <option value="Urdu ">Urdu </option>
                                                <option value="Other">Other</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="form_proficiencyMotherTongue" className='adj-row'>
                                            <Form.Control as="select" name="proficiencyMotherTongue" value={formData.proficiencyMotherTongue} onChange={handleChange} required >
                                                <option value="" disabled>Proficiency in Mother Tongue</option>
                                                <option value="Not Proficient at all">Not Proficient at all </option>
                                                <option value="Biginners level Proficiency ">Beginners level Proficiency </option>
                                                <option value="Medium level Proficiency">Medium level Proficiency </option>
                                                <option value="Advanced level Proficiency ">Advanced level Proficiency </option>
                                                <option value="Expert level Proficiency">Expert level Proficiency</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="form_secondaryLanguage" >
                                            <Form.Control as="select" name="secondaryLanguage" value={formData.secondaryLanguage} onChange={handleChange} required>
                                                <option value="" disabled>Secondary Language</option>
                                                <option value="Assamese">Assamese </option>
                                                <option value="Bengali ">Bengali </option>
                                                <option value="Bodo">Bodo </option>
                                                <option value="Dogri ">Dogri </option>
                                                <option value="English">English</option>
                                                <option value="Gujarati ">Gujarati </option>
                                                <option value="Hindi">Hindi</option>
                                                <option value="Kannada">Kannada</option>
                                                <option value="Kashmiri ">Kashmiri </option>
                                                <option value="Konkani">Konkani </option>
                                                <option value="Malayalam">Malayalam</option>
                                                <option value="Manipuri ">Manipuri or Meithei </option>
                                                <option value="Marathi">Marathi </option>
                                                <option value="Nepali ">Nepali </option>
                                                <option value="Oriya">Oriya </option>
                                                <option value="Punjabi">Punjabi </option>
                                                <option value="Sanskrit">Sanskrit</option>
                                                <option value="Santali ">Santali </option>
                                                <option value="Sindhi">Sindhi </option>
                                                <option value="Tamil">Tamil </option>
                                                <option value="Telugu ">Telugu </option>
                                                <option value="Urdu ">Urdu </option>
                                                <option value="Other">Other</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="form_proficiencySecondaryLanguage">
                                            <Form.Control as="select" name="proficiencySecondaryLanguage" value={formData.proficiencySecondaryLanguage} onChange={handleChange} required >
                                                <option value="" disabled>Proficiency in Secondary Language</option>
                                                <option value="Not Proficient at all">Not Proficient at all </option>
                                                <option value="Biginners level Proficiency ">Beginners level Proficiency </option>
                                                <option value="Medium level Proficiency">Medium level Proficiency </option>
                                                <option value="Advanced level Proficiency ">Advanced level Proficiency </option>
                                                <option value="Expert level Proficiency">Expert level Proficiency</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="form_otherLanguage" >
                                            <Form.Control as="select" name="otherLanguage" value={formData.otherLanguage} onChange={handleChange} required>
                                                <option value="" disabled>Other Language</option>
                                                <option value="Assamese">Assamese </option>
                                                <option value="Bengali ">Bengali </option>
                                                <option value="Bodo">Bodo </option>
                                                <option value="Dogri ">Dogri </option>
                                                <option value="English">English</option>
                                                <option value="Gujarati ">Gujarati </option>
                                                <option value="Hindi">Hindi</option>
                                                <option value="Kannada">Kannada</option>
                                                <option value="Kashmiri ">Kashmiri </option>
                                                <option value="Konkani">Konkani </option>
                                                <option value="Malayalam">Malayalam</option>
                                                <option value="Manipuri ">Manipuri or Meithei </option>
                                                <option value="Marathi">Marathi </option>
                                                <option value="Nepali ">Nepali </option>
                                                <option value="Oriya">Oriya </option>
                                                <option value="Punjabi">Punjabi </option>
                                                <option value="Sanskrit">Sanskrit</option>
                                                <option value="Santali ">Santali </option>
                                                <option value="Sindhi">Sindhi </option>
                                                <option value="Tamil">Tamil </option>
                                                <option value="Telugu ">Telugu </option>
                                                <option value="Urdu ">Urdu </option>
                                                <option value="Other">Other</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="form_proficiencyOtherLanguage" >
                                            <Form.Control as="select" name="proficiencyOtherLanguage" value={formData.proficiencyOtherLanguage} onChange={handleChange} required >
                                                <option value="" disabled>Proficiency in Other Language</option>
                                                <option value="Not Proficient at all">Not Proficient at all </option>
                                                <option value="Biginners level Proficiency ">Beginners level Proficiency </option>
                                                <option value="Medium level Proficiency">Medium level Proficiency </option>
                                                <option value="Advanced level Proficiency ">Advanced level Proficiency </option>
                                                <option value="Expert level Proficiency">Expert level Proficiency</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                
                                <Row>
                                <Col md={6}>
                                        <Form.Group controlId="form_AgeAcquisitionMotherTongue">
                                            <Form.Label><b>Age of Acquisition - Mother Tongue</b></Form.Label>
                                            <Form.Control type="number" placeholder="Mother Tongue" name="ageAcquisitionMotherTongue" value={formData.ageAcquisitionMotherTongue} onChange={handleChange} required />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="formAgeAcquisitionMotherTongue" className='adj-row'>
                                            <Form.Control type="number" placeholder="Secondary Language" name="ageAcquisitionSecondaryLang" value={formData.ageAcquisitionSecondaryLang} onChange={handleChange} required />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="formAgeAcquisitionSecondaryLanguage">
                                            <Form.Control as="select" placeholder="Handedness" name="ageAcquisitionSecondaryLanguage" value={formData.ageAcquisitionSecondaryLanguage} onChange={handleChange} required>
                                                <option value="" disabled>Handedness</option>
                                                <option value="Right Handed">Right Handed</option>
                                                <option value="Left Handed">Left Handed</option>
                                                <option value="Mix Handed">Mix Handed</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="formHandedness">
                                            <Form.Control as="select" name="handedness" value={formData.handedness} onChange={handleChange} required>
                                                <option value="" disabled>Vision</option>
                                                <option value="Normal">Normal</option>
                                                <option value="Corrected to normal">Corrected to normal</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="formVision">
                                            <Form.Control as="select" name="vision" value={formData.vision} onChange={handleChange} required>
                                                <option value="" disabled> Family Income</option>
                                                <option value="0 to 5 lac">0-5 Lac</option>
                                                <option value="6 to 10 lac">6-10 Lac</option>
                                                <option value="11 to 15 lac">11-15 Lac</option>
                                                <option value="16 to 20 lac">16-20 Lac</option>
                                                <option value="20 lac above = ">Above 20 Lac</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                    <Form.Group controlId="formLang" ></Form.Group>
                                    <Form.Label><b>Language Use Properly</b></Form.Label>
                                    </Col>

                                    <Col md={3}>
                                        <Form.Group controlId="formathome">
                                            <Form.Control type="text" placeholder="At Home" name="Home" value={formData.Home} onChange={handleChange} required />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="formwithfriends"/>
                                            <Form.Control type="text" placeholder="With Friends" name="withfriends" value={formData.withfriends} onChange={handleChange} required/>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="formsocial"/>
                                            <Form.Control type="text" placeholder="On Social Media" name="social" value={formData.social} onChange={handleChange} required/>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="formwork"/>
                                            <Form.Control type="text" placeholder="At Work" name="atwork" value={formData.atwork} onChange={handleChange} required/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="formCurrentLocation">
                                            <Form.Label><b>Current Location</b></Form.Label>
                                            <Form.Control type="text" placeholder="Current Location" name="currentLocation" value={formData.currentLocation} onChange={handleChange} required />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="formHailFrom">
                                            <Form.Label><b>Hail From</b></Form.Label>
                                            <Form.Control type="text" placeholder="Hail From" name="hailFrom" value={formData.hailFrom} onChange={handleChange} required />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                {/* <Form.Group controlId="formPrivacyPolicy">
                                    <Form.Check type="checkbox" label="I agree with the Privacy Policy" name="privacyPolicy" checked={formData.privacyPolicy} onChange={(e) => handleChange(e, 'checkbox')} required />
                                </Form.Group> */}
                                <Button variant="primary" type="submit" className="w-100 mt-3">
                                    Update
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
        {/* <Footer /> */}
        </>
    );
}

export default MyProfile
