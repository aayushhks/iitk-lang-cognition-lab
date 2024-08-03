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
                        <p className='p-ivstyle'><b>शब्द सीखने/ समझने की आयु   (Age of Acquisition)</b></p> 
                        <p className='p-ivstyle'>नीचे दिए गए डायलाग बॉक्स में कृपया स्क्रीन पर दिखाए हुए शब्द को सीखने/समझने की आयु भरें। </p>
                        <p className='p-ivstyle'>इससे हमारा मतलब यह है की इस दिए गए शब्द को आपने किस आयु में पहली बार सीखा/समझा था। यह ज़रूरी नहीं हैं की इस आयु में आपने स्वयं इस शब्द का प्रयोग (लिखा, पढ़ा या बोला) किया हो, लेकिन अगर किसी से यह शब्द सुना/या कहीं पढ़ा तो आप इस शब्द के अर्थ को समझ पाएं हों. अगर आप इस शब्द को भली-भांति नहीं जानते हैं , तो कृपया डायलाग बॉक्स में  0 (शून्य ) लिखें।  </p>
            </div>
        </div>
    )
}

export default Instruction