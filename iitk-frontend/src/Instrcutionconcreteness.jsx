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
                        <p className='p-ivstyle'><b>स्थूलता/ठोसपन (concreteness ):</b></p>
                        <p className='p-ivstyle'>कुछ  शब्द ऐसे कार्यों या वस्तुओं के लिए प्रयोग किये जाते है जिन्हे हम अपनी इन्द्रियों (पांच ज्ञानेन्द्रियों - आँख , कान , नाक , जीभ , त्वचा ) के माध्यम से सीधे अनुभव कर सकते है (सूंघना, चखना, छूना, सुनना, देखना इत्यादि)। ऐसे शब्दों को स्थूल/ठोस (Concrete ) शब्द कहते है।  जैसे - मेज (टेबल), कार (car ), घर इत्यादि।  </p>
                        <p className='p-ivstyle'>जबकि अन्य शब्द जिनके अर्थ (meaning ) या धारणा (concept ) को हम अपनी इन्द्रियों के माध्यम से सीधे अनुभव नहीं कर सकते , इनका अर्थ दूसरे शब्दों पर निर्भर करता है । इन्हे  भावात्मक /सार (abstract ) शब्द कहते है। जैसे - विचार , प्रसन्नता , कल्पना  इत्यादि।</p>
                        <p className='p-ivstyle'>फिर भी बहुत सारे शब्द ऐसे है जो इन दोनों  वर्गों (categories ) के बीच (मध्य) मे  आते है। क्योंकि हम उन शब्दों के अर्थ या धारणा (concept ) को कुछ हद तक अपनी इन्द्रियों से अनुभव कर सकते है। </p>
                        <p className='p-ivstyle'>नीचे दिए गया शब्द कितना स्थूल (concrete) है या भावात्मक (abstract ) है ,   1 से 7  तक की मापनी (scale) पर चयन करें।  अगर शब्द बहुत स्थूल (concrete) है तो आप 7 का चयन कर सकते है , और यदि शब्द पूर्ण रूप से भावात्मक(abstract ) है तो आप 1 का चयन कर सकते है।  बाकी शब्दों के लिए 2 ,3 ,4 ,5 या 6 अंक उनके कम स्थूल से अधिक स्थूल (क्रमानुसार) के हिसाब से दे सकते है। </p>
                        <p className='p-ivstyle'><b>उदाहरण के लिए ,7-बिंदु पैमाने का उपयोग करते हुए</b></p>
                        <p className='p-ivstyle'><b>[1 = बहुत भावात्मक, 2 = काफी भावात्मक, 3 = कुछ भावात्मक,4 = तटस्थ, 5 = कुछ स्थूल, 6 = काफी स्थूल, 7 = बहुत स्थूल] </b></p>
                        <p className='p-ivstyle'>अगर आप शब्द को नहीं जानते है तो  <b>I don't Know का चयन करें।</b> </p>
            </div>
        </div>
    )
}

export default Instruction