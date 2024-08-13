// import logo from './assets/iitk-logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

import Navbar from './navbar.js';
import Footer from './Footer.jsx';

import Login from './Login.jsx';
import SignUp from './SignUp.jsx';
import InstructionValence from './instructionValence.jsx';
import ContactUs from './contactUs.jsx';
import HomePage from './Home.jsx';
import Registration from './Registration.jsx';
import AboutUs from './AboutUs.jsx';
import MyProjects from './MyProjects.jsx';
import UserManual from './UserManual.jsx';
import SurveyTour1 from './SurveyTour1.jsx';
import SurveyTour2 from './SurveyTour2.jsx';

// import axios from 'axios';

function App() {
  const [words, setWords] = useState([]);
  const [sliceOfN, setsliceOfN] = useState(1);
  const [alwaysUpdate, setAlwaysUpdate] = useState(0);
  const [questionsRemaining, setQuestionsRemaining] = useState(0);
  const [data, setData] = useState([]);
  const [blockIndex, setBlockIndex] = useState([]);
  const [reuseWords, setReuseWords] = useState(false);
  const [isVisiblePopup, setIsVisiblePopup] = useState(false);
  const [wordFrequency, setWordFrequency] = useState(-10);
  const [currentPage, setCurrentPage] = useState('home');

  const blockSize = 270;

  // Step 3: Function to toggle the visibility
  const togglePopup = () => {
    setIsVisiblePopup(!isVisiblePopup);
  };

  // useEffect(() => {
  //   // setsliceOfN(1);
  //   fetchWords();
  // }, [alwaysUpdate]);

  const updateWords = async () => {
    saveWordFrequency(wordFrequency);

    const data = await fetchWords();
    if (data) {
      setBlockIndex(Math.floor(data[1] / blockSize));
    } else {
      setBlockIndex("NaN");
    }
  }

  const changeWordFrequency = (value) => {
    setWordFrequency(value);
  }

  const saveWordFrequency = async (value) => {
    const email = localStorage.getItem('email');
    try {
      const response = await fetch('http://localhost:4997/save-freq', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify([email, words[0], wordFrequency]),
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

    // let data = null;
    // try {
    //   data = await fetch(`http://localhost:4997/save-freq?user_id=${userId}&word=${data[1]}&freq=${value}`);
    // } catch (error) {
    //   console.error('Error fetching words:', error);
    // }

    // return data;
  }

  useEffect(() => {
    updateWords();
  }, []);

  const fetchWords = async () => {
    let data = null;
    try {
      const response = await fetch(`http://localhost:4997/words?slice_of_n=${sliceOfN}&offset_idx=${null}`);
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
        setData(data);
        setQuestionsRemaining(data[0]-data[1]);
        setWords(data[2]);
      } else {
        console.error('Response was not JSON:', response);
        const text = await response.text();
        console.error('Response text:', text);
      }
    } catch (error) {
      console.error('Error fetching words:', error);
    }

    return data;
  };

  const changePage = (pageName) => {
    setCurrentPage(pageName);
  }

  const coursePage = (
    <div className="App">
      <Navbar />
      {isVisiblePopup && (<InstructionValence togglePopup={togglePopup} />)}

      <div className="fb-area">
        {/* {isVisiblePopup && (
          <InstructionValence />
        )} */}
        <h1 className='word'>Word - Block {blockIndex + 1}</h1>
        <button className="btn btn-outline-primary btn-bootstrap" onClick={togglePopup}>Instructions</button>
        {/* <div className="word-header">
        </div> */}
        {/* <button onClick={() => setAlwaysUpdate(1-alwaysUpdate)}>Next</button> */}
        {/* <button onClick={() => setReuseWords(!reuseWords)}>
          {reuseWords ? 'Disable' : 'Enable'} Reuse Words
        </button> */}

        {/* <h3 className="word">Word</h3> */}
        {
          words.map((word, index) => (
            <h3 className="word-heading">{word}</h3>
          ))
        }

        <button className="least-most-button">&larr; Least</button>
        <button className="least-most-button">Most &rarr;</button>

        <br />
        <button onClick={() => changeWordFrequency(-1)} className="square-button">I don't know</button>
        <button onClick={() => changeWordFrequency(1)} className="square-button">1</button>
        <button onClick={() => changeWordFrequency(2)} className="square-button">2</button>
        <button onClick={() => changeWordFrequency(3)} className="square-button">3</button>
        <button onClick={() => changeWordFrequency(4)} className="square-button">4</button>
        <button onClick={() => changeWordFrequency(5)} className="square-button">5</button>
        <button onClick={() => changeWordFrequency(6)} className="square-button">6</button>
        <button onClick={() => changeWordFrequency(7)} className="square-button">7</button>

        <br />
        {/* <button className="btn btn-outline-primary btn-bootstrap" onClick={() => setAlwaysUpdate(1-alwaysUpdate)}>Next</button> */}
        <button className="btn btn-outline-success btn-bootstrap next-btn" onClick={updateWords}>Next</button>

        <p className="status-text">Only {questionsRemaining%blockSize} Questions Remaining To Complete Block {blockIndex + 1}</p>

      </div>
      <Footer changePage={changePage} />
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'courses':
        return coursePage;
      case 'about':
        return <AboutUs />;
      case 'login':
        return <Login />;
      case 'signup':
        return <SignUp />;
      case 'projects':
        return <MyProjects />;
      case 'userman':
        return <UserManual />;
      case 'stour1':
        return <SurveyTour1 />;
      case 'stour2':
        return <SurveyTour2 />;
      case 'contact':
        return <ContactUs />;
      case 'registration':
        return <Registration />;
      default:
        return coursePage;
    }
  };

  // Use effect to update state once after the component mounts
  useEffect(() => {
    // This will set the page to 'about' once when the component mounts
    setCurrentPage('home'); // Open a page
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    renderPage()
  )

  // return (
  //   <div className="App">
  //     <Navbar />
  //     {isVisiblePopup && (<InstructionValence togglePopup={togglePopup} />)}

  //     <div className="fb-area">
  //       {/* {isVisiblePopup && (
  //         <InstructionValence />
  //       )} */}
  //       <h1 className='word'>Word - Block {blockIndex + 1}</h1>
  //       <button className="btn btn-outline-primary btn-bootstrap" onClick={togglePopup}>Instructions</button>
  //       {/* <div className="word-header">
  //       </div> */}
  //       {/* <button onClick={() => setAlwaysUpdate(1-alwaysUpdate)}>Next</button> */}
  //       {/* <button onClick={() => setReuseWords(!reuseWords)}>
  //         {reuseWords ? 'Disable' : 'Enable'} Reuse Words
  //       </button> */}

  //       {/* <h3 className="word">Word</h3> */}
  //       {
  //         words.map((word, index) => (
  //           <h3 className="word-heading">{word}</h3>
  //         ))
  //       }

  //       <button className="least-most-button">Least</button>
  //       <button className="least-most-button">Most</button>

  //       <br />
  //       <button onClick={() => saveWordFrequency(-1)} className="square-button">I don't know</button>
  //       <button onClick={() => saveWordFrequency(1)} className="square-button">1</button>
  //       <button onClick={() => saveWordFrequency(2)} className="square-button">2</button>
  //       <button onClick={() => saveWordFrequency(3)} className="square-button">3</button>
  //       <button onClick={() => saveWordFrequency(4)} className="square-button">4</button>
  //       <button onClick={() => saveWordFrequency(5)} className="square-button">5</button>
  //       <button onClick={() => saveWordFrequency(6)} className="square-button">6</button>
  //       <button onClick={() => saveWordFrequency(7)} className="square-button">7</button>

  //       <br />
  //       {/* <button className="btn btn-outline-primary btn-bootstrap" onClick={() => setAlwaysUpdate(1-alwaysUpdate)}>Next</button> */}
  //       <button className="btn btn-outline-primary btn-bootstrap" onClick={updateWords}>Next</button>

  //       <p>Only {questionsRemaining%blockSize} Questions Remaining To Complete Block {blockIndex + 1}</p>

  //     </div>

  //   </div>
  // );
}

export default App;
