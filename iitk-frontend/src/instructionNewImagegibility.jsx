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
                        <p className='p-ivstyle'><b>कल्पनाशीलता (Imageability): </b></p> 
                        <p className='p-ivstyle'>इस प्रयोग में आपको दिए गए शब्द का मूल्यांकन,  दिये गये शब्द का अर्थ जिस कार्य या वस्तु  को बताता है , उसकी कल्पना करना कितना आसान या कठिन है, के हिसाब से 1 से 7 की मापनी (Scale) पर करना है। </p>
                        <p className='p-ivstyle'>अगर शब्द जिस कार्य या वस्तु  के लिए प्रयोग किया जाता है , उसकी कल्पना करना आसान है तो आप 7 अंक का चयन कर सकते है।  और यदि शब्द के अर्थ या धारणा  की कल्पना करना बहुत कठिन है तो आप 1 अंक का चयन कर सकते है </p>
                        <p className='p-ivstyle'>इसी प्रकार बाकि शब्द जो इन दोनों भावों के बीच मे आते है , उन शब्दों के लिए 2 ,3 ,4 ,5  या 6  अंक उनके बहुत अकल्पनीय   से  बहुत कल्पनीय   (क्रमानुसार) होने के हिसाब से दे सकते है। </p>
                        <p className='p-ivstyle'><b>उदाहरण के लिए ,7-बिंदु पैमाने का उपयोग करते हुए</b></p>
                        <p className='p-ivstyle'><b>[1 = बहुत अकल्पनीय , 2 = काफी अकल्पनीय, 3 = कुछ अकल्पनीय,4 = तटस्थ, 5 = कुछ कल्पनीय  6 = काफी कल्पनीय, 7 = बहुत कल्पनीय]</b></p>
                        <p className='p-ivstyle'>अंक का चयन कर सकते है। </p>
                        <p className='p-ivstyle'>अगर आप शब्द को नहीं जानते है तो  <b>I don't Know का चयन करें।</b> </p>
            </div>
        </div>
    )
}

export default Instruction