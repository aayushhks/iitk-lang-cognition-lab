// import logo from './assets/iitk-logo.svg';
import './App.css';
import Navbar from './navbar.js';
import React, { useState, useEffect } from 'react';
import InstructionValence from './instructionValence.jsx';
import contactUs from './contactUs.jsx';
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
  const [wordFrequency, setWordFrequency] = useState(-1);
  const [currentPage, setCurrentPage] = useState('home');

  const blockSize = 270;
  const userId = "ayush000";

  // Step 3: Function to toggle the visibility
  const togglePopup = () => {
    setIsVisiblePopup(!isVisiblePopup);
  };

  // useEffect(() => {
  //   // setsliceOfN(1);
  //   fetchWords();
  // }, [alwaysUpdate]);

  const updateWords = async () => {
    const data = await fetchWords();
    if (data) {
      setBlockIndex(Math.floor(data[1] / blockSize));
    } else {
      setBlockIndex("NaaN");
    }
  }

  const saveWordFrequency = async (value) => {
    setWordFrequency(value);

    let data = null;
    try {
      data = await fetch(`http://localhost:4999/save-freq?user_id=${userId}&word=${data[1]}&freq=${value}`);
    } catch (error) {
      console.error('Error fetching words:', error);
    }

    return data;
  }

  useEffect(() => {
    updateWords();
  }, []);

  const fetchWords = async () => {
    let data = null;
    try {
      const response = await fetch(`http://localhost:4999/words?slice_of_n=${sliceOfN}&offset_idx=${null}`);
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

  const homePage = (
    <>
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

      <button className="least-most-button">Least</button>
      <button className="least-most-button">Most</button>

      <br />
      <button onClick={() => saveWordFrequency(-1)} className="square-button">I don't know</button>
      <button onClick={() => saveWordFrequency(1)} className="square-button">1</button>
      <button onClick={() => saveWordFrequency(2)} className="square-button">2</button>
      <button onClick={() => saveWordFrequency(3)} className="square-button">3</button>
      <button onClick={() => saveWordFrequency(4)} className="square-button">4</button>
      <button onClick={() => saveWordFrequency(5)} className="square-button">5</button>
      <button onClick={() => saveWordFrequency(6)} className="square-button">6</button>
      <button onClick={() => saveWordFrequency(7)} className="square-button">7</button>

      <br />
      {/* <button className="btn btn-outline-primary btn-bootstrap" onClick={() => setAlwaysUpdate(1-alwaysUpdate)}>Next</button> */}
      <button className="btn btn-outline-primary btn-bootstrap" onClick={updateWords}>Next</button>

      <p>Only {questionsRemaining%blockSize} Questions Remaining To Complete Block {blockIndex + 1}</p>

    </div>
    </>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return {homePage};
      case 'about':
        return <contactUs />;
      case 'contact':
        return <contactUs />;
      default:
        return {homePage};
    }
  };

    return (
        <div>
        <nav>
            <button onClick={() => setCurrentPage('home')}>Home</button>
            <button onClick={() => setCurrentPage('about')}>About</button>
            <button onClick={() => setCurrentPage('contact')}>Contact</button>
        </nav>
        <main>
            {renderPage()}
        </main>
        </div>
    );
}

export default App;
