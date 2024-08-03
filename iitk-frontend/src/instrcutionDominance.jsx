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
                        <p className='p-ivstyle'><b>प्रभुत्व / प्रभाव / प्रबलता (Dominance):</b></p> 
                        <p className='p-ivstyle'>इस अध्ययन (प्रयोग) में आपको दिए गए शब्द का मूल्यांकन उसके "प्रभाव /प्रभुत्व/"  भाव के हिसाब से 1 से 7 की मापनी (Scale) पर करना है।  </p>
                        <p className='p-ivstyle'>अगर नीचे दिया गया शब्द "बहुत प्रभावी  / बहुत प्रभुत्व / बहुत प्रबल " भाव वाला है तो आप 7 अंक का चयन कर सकते है। और यदि शब्द "बहुत कमजोर/बहुत दुर्बल " भाव वाला है तो आप 1 अंक का चयन कर सकते है।</p>
                        <p className='p-ivstyle'>इसी प्रकार बाकि शब्द जो इन दोनों भावों के बीच मे आते है , उन शब्दों के लिए 2 ,3 ,4 ,5  या 6  अंक उनके कमजोर/दुर्बल भाव  से प्रभावी/ प्रबल  भाव (क्रमानुसार) होने के हिसाब से दे सकते है। </p>
                        <p className='p-ivstyle'><b>उदाहरण के लिए ,7-बिंदु पैमाने का उपयोग करते हुए </b></p>
                        <p className='p-ivstyle'><b>[1 = बहुत कमजोर, 2 = काफी कमजोर, 3 = कुछ कमजोर, 4 = तटस्थ, 5 = कुछ प्रबल /प्रभावी, 6 = काफी प्रबल / प्रभावी, 7 = बहुत प्रबल / प्रभावी]</b></p>
                        <p className='p-ivstyle'>अगर आप शब्द को नहीं जानते है तो  <b>I don't Know का चयन करें।</b> </p>
            </div>
        </div>
    )
}

export default Instruction