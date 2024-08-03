import "./App.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "./navbar.js";
import Footer from "./Footer.jsx";

import getInstructionComponent from "./instructionGetter.js";

// import InstructionValence from './instructionValence.jsx';

function Course() {
  const [wordFrequency, setWordFrequency] = useState(-10);
  const [sliceOfN, setsliceOfN] = useState(1);
  const [words, setWords] = useState([]);
  const [questionsRemaining, setQuestionsRemaining] = useState(0);
  const [data, setData] = useState([]);
  const [alwaysUpdate, setAlwaysUpdate] = useState(0);
  const [reuseWords, setReuseWords] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");

  const navigate = useNavigate();

  // Use effect to disable the button on component mount
  useEffect(() => {
    const button = document.getElementById("next-btn");
    if (button) {
      button.disabled = true;
    }
    // // Enable the button after 2 seconds (for demonstration)
    // const timer = setTimeout(() => {
    //   if (buttonRef.current) {
    //     buttonRef.current.disabled = false;
    //   }
    // }, 2000);

    // // Clean up the timer when the component unmounts
    // return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutsideButtons = (event) => {
      // Assuming buttonIds is an array of IDs of your buttons
      const buttonIds = [
        "button0",
        "button1",
        "button2",
        "button3",
        "button4",
        "button5",
        "button6",
        "button7",
      ];

      const nextBtn = document.getElementById("next-btn");
      if (!buttonIds.includes(event.target.id)) {
        // Handle the case when something other than the specified buttons is clicked
        nextBtn.disabled = true;
      } else {
        nextBtn.disabled = false;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("click", handleClickOutsideButtons);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("click", handleClickOutsideButtons);
    };
  }, []);

  let data_ = [null, null, [null, null]];
  let wordFreq = 0;

  const updateWords = async () => {
    data_ = await fetchWords();
    console.log(data_);
    saveWordFrequency(wordFreq, data_[2][0]);
    if (data_) {
      setBlockIndex(Math.floor(data_[1] / blockSize));
    } else {
      setBlockIndex("NaN");
    }
  };

  const handleKeyPress = (event) => {
    const nextBtn = document.getElementById("next-btn");
    // Simulate button clicks
    if (event.key === "0") {
      changeWordFrequency(-1);
    } else if (event.key === "1") {
      changeWordFrequency(1);
    } else if (event.key === "2") {
      changeWordFrequency(2);
    } else if (event.key === "3") {
      changeWordFrequency(3);
    } else if (event.key === "4") {
      changeWordFrequency(4);
    } else if (event.key === "5") {
      changeWordFrequency(5);
    } else if (event.key === "6") {
      changeWordFrequency(6);
    } else if (event.key === "7") {
      changeWordFrequency(7);
    } else if (event.key === "Enter") {
      if (!nextBtn.disabled) {
        updateWords();
      }
    }
    if (["0", "1", "2", "3", "4", "5", "6", "7"].includes(event.key)) {
      document.getElementById("button" + event.key).focus();
      nextBtn.disabled = false;
    } else {
      document.getElementById("button0").blur();
      document.getElementById("button1").blur();
      document.getElementById("button2").blur();
      document.getElementById("button3").blur();
      document.getElementById("button4").blur();
      document.getElementById("button5").blur();
      document.getElementById("button6").blur();
      document.getElementById("button7").blur();
      nextBtn.disabled = true;
    }
  };

  const changeWordFrequency = (value) => {
    wordFreq = value;
    const nextBtn = document.getElementById("next-btn");
    nextBtn.disabled = false;
    // setWordFrequency(value);
    console.log("Freq Changed to", wordFreq, value);
  };

  const [blockIndex, setBlockIndex] = useState([]);
  const [isVisiblePopup, setIsVisiblePopup] = useState(false);
  const [blockSize, setBlockSize] = useState(false);

  let blockSizeVar = 0;
  const getBlockSize = async () => {
    try {
      const response = await fetch('http://localhost:4999/get-block-size', {
          method: 'GET',
          headers: {
          'Content-Type': 'application/json',
          },
      });

      const result = await response.json();
      blockSizeVar = result;
      setBlockSize(blockSizeVar);
      console.log("res", result);
  } catch (error) {
      console.log('An error occurred');
  }
  }

  const togglePopup = () => {
    setIsVisiblePopup(!isVisiblePopup);
  };

  const saveWordFrequency = async (value, word) => {
    const email = localStorage.getItem("email");
    try {
      const response = await fetch("http://localhost:4999/save-freq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify([email, words[0], wordFrequency]),
        body: JSON.stringify([email, word, value]),
      });

      const result = await response.json();

      console.log(result);
      if (result.success === true) {
        // Valid Login
        console.log("yay");
      } else {
        // Invalid Login
        console.log("no");
      }
    } catch (error) {
      console.log("An error occurred");
    }
  };

  useEffect(() => {
    if (localStorage.courseName === undefined) {
      navigate("/home");
    }
    if (localStorage.length === 0) {
      navigate("/login");
    } else {
      getBlockSize();
      updateWords();
    }
  }, []);
  // const nextBtn = document.getElementById("next-btn");
  // nextBtn.disabled = true;

  const fetchWords = async () => {
    let data_ = null;
    const email = localStorage.getItem("email");
    const endpoint = "http://localhost:4999/words";
    try {
      const response = await fetch(endpoint,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([
            sliceOfN,
            null,
            email,
            localStorage.courseName,
          ]),
        }
      );

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data_ = await response.json();
        console.log(data_);
        setData(data_);
        setQuestionsRemaining(data_[0] - data_[1]);
        setWords(data_[2]);
      } else {
        console.error("Response was not JSON:", response);
        const text = await response.text();
        console.error("Response text:", text);
      }
    } catch (error) {
      console.error("Error fetching words:", error);
    }

    return data_;
  };

  return (
    <div className="App">
      <Navbar />
      {isVisiblePopup && getInstructionComponent(togglePopup)}

      <div className="fb-area">
        {/* {isVisiblePopup && (
          <InstructionValence />
        )} */}
        <h1 className="word">Word - Block {blockIndex + 1}</h1>
        <button
          className="btn btn-outline-primary btn-bootstrap"
          onClick={togglePopup}
        >
          Instructions
        </button>
        {/* <div className="word-header">
        </div> */}
        {/* <button onClick={() => setAlwaysUpdate(1-alwaysUpdate)}>Next</button> */}
        {/* <button onClick={() => setReuseWords(!reuseWords)}>
          {reuseWords ? 'Disable' : 'Enable'} Reuse Words
        </button> */}

        {/* <h3 className="word">Word</h3> */}
        {words.map((word, index) => (
          <h3 className="word-heading">{word}</h3>
        ))}

        <button className="least-most-button">&larr; Least</button>
        <button className="least-most-button">Most &rarr;</button>

        <br />
        <button
          onClick={() => changeWordFrequency(-1)}
          className="square-button"
          id="button0"
        >
          I don't know
        </button>
        <button
          onClick={() => changeWordFrequency(1)}
          className="square-button"
          id="button1"
        >
          1
        </button>
        <button
          onClick={() => changeWordFrequency(2)}
          className="square-button"
          id="button2"
        >
          2
        </button>
        <button
          onClick={() => changeWordFrequency(3)}
          className="square-button"
          id="button3"
        >
          3
        </button>
        <button
          onClick={() => changeWordFrequency(4)}
          className="square-button"
          id="button4"
        >
          4
        </button>
        <button
          onClick={() => changeWordFrequency(5)}
          className="square-button"
          id="button5"
        >
          5
        </button>
        <button
          onClick={() => changeWordFrequency(6)}
          className="square-button"
          id="button6"
        >
          6
        </button>
        <button
          onClick={() => changeWordFrequency(7)}
          className="square-button"
          id="button7"
        >
          7
        </button>

        <br />

        {/* <button className="btn btn-outline-primary btn-bootstrap" onClick={() => setAlwaysUpdate(1-alwaysUpdate)}>Next</button> */}
        <button
          className="btn btn-outline-success btn-bootstrap next-btn"
          onClick={updateWords}
          id="next-btn"
        >
          Next
        </button>

        <p className="status-text">
          Only {questionsRemaining % blockSize} Questions Remaining To Complete Block {blockIndex + 1}
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default Course;
