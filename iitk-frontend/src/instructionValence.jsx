import React from 'react';
import './ivstyle.css';

const Instruction = (props) => {
    const {togglePopup} = props;
    const handleClick = (event) => {
        if (event.target === event.currentTarget) {
            togglePopup();
        }
    }

    return (
        <div onClick={handleClick} className="popup-container">
            <button onClick={togglePopup} className="cancel-button"></button>
            <div className="popup">
                        <p className='p-ivstyle'><b>भावुकता (Valence)- सुखद स्थति :</b></p> 
                        <p className='p-ivstyle'>इइस प्रयोग में आपको दिए गए शब्द का मूल्यांकन उसके "सकारात्मक /सुखद" या "नकारात्मक/ अप्रिय" भाव के हिसाब से 1 से 7 की मापनी (Scale) पर करना है।   </p>
                        <p className='p-ivstyle'>अगर नीचे दिया गया शब्द "बहुत सकारात्मक /बहुत  सुखद " है तो आप 7 अंक का चयन कर सकते है। और यदि शब्द "बहुत नकारात्मक/बहुत अप्रिय" है तो आप 1 अंक का चयन कर सकते है। </p>
                        <p className='p-ivstyle'>इसी प्रकार बाकि शब्द जो इन दोनों भावों के बीच मे आते है , उन शब्दों के लिए 2 ,3 ,4 ,5  या 6  अंक उनके नकारात्मक से सकारात्मक (क्रमानुसार) होने के हिसाब से दे सकते है।  </p>
                        <p className='p-ivstyle'>उदाहरण के लिए ,7-बिंदु पैमाने का उपयोग करते हुए </p>
                        <p className='p-ivstyle'><b>[1 = बहुत नकारात्मक, 2 = काफी नकारात्मक, 3 = कुछ नकारात्मक,4 = तटस्थ, 5 = कुछ सकारात्मक, 6 = काफी सकारात्मक, 7 = बहुत सकारात्मक]</b></p>
                        <p className='p-ivstyle'>अंक का चयन कर सकते है।  </p>
                        <p className='p-ivstyle'>अगर आप शब्द को नहीं जानते है तो  <b>I don't Know का चयन करें।</b> </p>
            </div>
        </div>
    )
}

export default Instruction
