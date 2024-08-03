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
                        <p className='p-ivstyle'><b>परिचय / जानकारी (Familiarity):-</b></p> 
                        <p className='p-ivstyle'>स्क्रीन पर दिए गए शब्द से आप कितने परिचित हैं या आपको इसकी कितनी जानकारी है, इस हिसाब से इस शब्द का मूल्यांकन 1-7 की मापनी (scale) पर करें। मतलब यह है की अगर आप किसी शब्द से बहुत ही अच्छी तरह परिचित हैं तो उस शब्द को आप इस मापनी पर 7 अंक दे सकते हैं, और अगर आप किसी शब्द से बहुत ही कम परिचित हैं तो आप उस शब्द को 1 अंक दे सकते हैं। इसके अलावा बाकी शब्दों को अपने परिचय के अनुसार उचित अंक प्रदान कर सकते हैं।  अगर आप दिए गए शब्द से बिलकुल भी परिचित नहीं हैं या उसी कभी सुना/पढ़ा नहीं है, तो आप उस शब्द के लिए I dont know  का चुनाव कर सकते हैं।  </p>
                        <p className='p-ivstyle'>किसी भी शब्द से परिचित होने का मतलब यह है की आपने इस शब्द को कहीं पढ़ा, लिखा, सुना या बोला हो। कई बार हमें कुछ शब्दों का अर्थ नहीं मालूम होता मगर हम उन्हें अक्सर कहीं न कहीं सुनते या पढ़ते रहते हैं।  इस तरह के शब्दों को भी इसी हिसाब से अंक दीजिये की आपने कितनी बार इन शब्दों को कहीं पर सुना या पढ़ा है।</p>
                        <p className='p-ivstyle'><b>उदाहरण के लिए ,7-बिंदु पैमाने का उपयोग करते हुए अंक का चुनाव कर सकते हैं।</b></p>
                        <p className='p-ivstyle'><b>[1 = अपरिचित  , 2 = काफी कम परिचित, 3 = कम परिचित, 4 = तटस्थ, 5 = कुछ परिचित  6 = काफी परिचित, 7 = बहुत परिचित]।</b></p>
                        <p className='p-ivstyle'>अगर आप दिए गए शब्द से बिलकुल भी परिचित नहीं हैं या उसी कभी सुना/पढ़ा नहीं है, तो आप उस शब्द के लिए <b>I dont know</b>  का चुनाव कर सकते हैं। </p>
            </div>
        </div>
    )
}

export default Instruction