import Instruction0 from "./Instrcutionconcreteness.jsx";
import Instruction1 from "./instrcutionDominance.jsx";
import Instruction2 from "./instructionAgeofAcquisition.jsx";
import Instruction3 from "./instructionArousal.jsx";
import Instruction4 from "./instructionFamiliarity.jsx";
import Instruction5 from "./instructionImageability.jsx";
import Instruction6 from "./instructionNewArousal.jsx";
import Instruction7 from "./instructionNewDominance.jsx";
import Instruction8 from "./instructionNewImagegibility.jsx";
import Instruction9 from "./instructionNewValence.jsx";
import Instruction10 from "./instructionNewconcreteness.jsx";
import Instruction11 from "./instructionValence.jsx";

const getInstructionComponent = (togglePopup) => {
    switch (localStorage.courseName) {
        case 'New Dominance':
        	return <Instruction7 togglePopup={togglePopup} />
        case 'New Arousal':
        	return <Instruction6 togglePopup={togglePopup} />
        case 'Arousal':
        	return <Instruction3 togglePopup={togglePopup} />
        case 'New Valence':
        	return <Instruction9 togglePopup={togglePopup} />
        case 'Imageability':
        	return <Instruction5 togglePopup={togglePopup} />
        case 'Familiarity':
        	return <Instruction4 togglePopup={togglePopup} />
        case 'Age of Acquisition':
        	return <Instruction2 togglePopup={togglePopup} />
        case 'Concreteness':
        	return <Instruction0 togglePopup={togglePopup} />
        case 'New Concreteness':
        	return <Instruction10 togglePopup={togglePopup} />
        case 'Valence':
        	return <Instruction11 togglePopup={togglePopup} />
        case 'Dominance':
        	return <Instruction1 togglePopup={togglePopup} />
        case 'New Imageability':
        	return <Instruction8 togglePopup={togglePopup} />
        default:
        	return <></>
    }
}

export default getInstructionComponent;

