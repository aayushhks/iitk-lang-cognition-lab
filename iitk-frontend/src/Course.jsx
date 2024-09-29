import "./App.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "./navbar.js";
import Footer from "./Footer.jsx";

import { ip } from './config.js'

import getInstructionComponent from "./instructionGetter.js";

function Course() {
  const [wordFrequency, setWordFrequency] = useState(-10);
  const [sliceOfN, setsliceOfN] = useState(1);
  const [words, setWords] = useState([]);
  // const [questionsRemaining, setQuestionsRemaining] = useState(0);
  const [ageValue, setAgeValue] = useState(0);
  const [data, setData] = useState([]);
  const [alwaysUpdate, setAlwaysUpdate] = useState(0);
  const [reuseWords, setReuseWords] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [blockIndex, setBlockIndex] = useState(-1);
  const [isVisiblePopup, setIsVisiblePopup] = useState(false);
  const [blockSize, setBlockSize] = useState(100);
  const [enterClicked, setEnterClicked] = useState(false);
  const [isInitial, setIsInitial] = useState(true);

  const navigate = useNavigate();

  const handleCourseComplete = async () => {
    const email = localStorage.getItem("email");
    const courseName = localStorage.getItem("courseName");
    try {
      const response = await fetch(`${ip[0]}/course-completion-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email, courseName}),
      });

    } catch (error) {
      console.log("An error occurred", error);
    }
  };

  const updateWords = async (get_last) => {
    data_ = await fetchWords(get_last);

    if (wordFreq === 10 && wordFrequency === -10) {
      return;
    }

    if (wordFreq === -10) {
      wordFreq = wordFrequency;
    }

    console.log(data_); // data_

    if ((data_[2].length === 0 && data_[2][0] === undefined) ||
          data_[2][0].length === 0 && data_[2][0][0] === undefined) {
          data_[2][0] = "(course completed)";
          handleCourseComplete();
    } else {
      saveWordFrequency(wordFreq, data_[2][0]);
    }

    if (data_) {
      setBlockIndex(Math.floor(data_[1] / blockSize));
    } else {
      setBlockIndex("0");
    }
  };

  // const updateEnterCicked = () => {
  //   setEnterClicked(!enterClicked);
  // }

  const handleKeyPress = (event) => {
    const nextBtn = document.getElementById("next-btn");

    // Simulate button clicks based on key press
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
        setIsInitial(false);
        setEnterClicked((prevState) => {return !prevState});
      }
    }
    if (["0", "1", "2", "3", "4", "5", "6", "7"].includes(event.key)) {
      document.getElementById("button" + event.key)?.focus();
      nextBtn.disabled = false;
    } else {
      document.getElementById("button0")?.blur();
      document.getElementById("button1")?.blur();
      document.getElementById("button2")?.blur();
      document.getElementById("button3")?.blur();
      document.getElementById("button4")?.blur();
      document.getElementById("button5")?.blur();
      document.getElementById("button6")?.blur();
      document.getElementById("button7")?.blur();
      nextBtn.disabled = true;
    }
  };

  // Use effect to disable the button on component mount
  useEffect(() => {
    const button = document.getElementById("next-btn");
    if (button) {
      if (!(
        localStorage.courseName === "Age of Acquisition" ||
        localStorage.courseName === "New Age of Acquisition"
      )) {
        button.disabled = true;
      } else {
        ageValueHandler(0);
        // setAgeValue("0 (unknown word)");
      }
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
      if (
        localStorage.courseName === "Age of Acquisition" ||
        localStorage.courseName === "New Age of Acquisition"
      ) {
        ;
      }
      else {
        if (!buttonIds.includes(event.target.id)) {
          // Handle the case when something other than the specified buttons is clicked
          nextBtn.disabled = true;
        } else {
          nextBtn.disabled = false;
        }
      }
    };

    if (
        localStorage.courseName === "Age of Acquisition" ||
        localStorage.courseName === "New Age of Acquisition"
    ) {
      ;
    } else {
      // Keyboard enable functionality
      window.addEventListener("keydown", handleKeyPress);
      window.addEventListener("click", handleClickOutsideButtons);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("click", handleClickOutsideButtons);
    };
  }, []);

  let data_ = [null, null, [null, null]];
  let wordFreq = -10; // global

  // useEffect(() => {
  //   setWordFrequency(wordFreq);
  // }, [wordFreq])

  const changeWordFrequency = (value) => {
    wordFreq = value;
    const nextBtn = document.getElementById("next-btn");
    nextBtn.disabled = false;
    setWordFrequency(value);
  };

  const getBlockSize = async (val) => {
    const courseName = localStorage.getItem("courseName");
    try {
        const response = await fetch(`${ip[0]}/get-block-size/${courseName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setBlockSize(result.block_size ? result.block_size : 0);

    } catch (error) {
        console.log('An error occurred:', error);
    }
  }

  const togglePopup = () => {
    setIsVisiblePopup(!isVisiblePopup);
  };

  const saveWordFrequency = async (value, word) => {
    const email = localStorage.getItem("email");
    const courseName = localStorage.getItem("courseName");
    try {
      const response = await fetch(`${ip[0]}/save-freq`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify([email, words[0], wordFrequency]),
        body: JSON.stringify([email, courseName, word, value]),
      });

    } catch (error) {
      console.log("An error occurred", error);
    }
  };

  useEffect(() => {
    if (!isInitial) {
      exportData();
    }
  }, [blockIndex])

  useEffect(() => {
    if (!isInitial) {
      updateWords(true);
    }
    setBlockIndex(Math.floor(data_[1] / blockSize));
  }, [blockSize])

  useEffect(() => {
    if (!isInitial) {
      updateWords(false);
    }
  }, [enterClicked])

  useEffect(() => {
    if (localStorage.courseName === undefined) {
      navigate("/home");
    }
    if (localStorage.length === 0 || JSON.parse(localStorage.userinfo)['isadmin']) {
      navigate("/login");
    }
    else {
      getBlockSize('init');
      setIsInitial(false);
      // updateWords(-10); // TODO: Don't need to get the next word
    }
  }, []);
  // const nextBtn = document.getElementById("next-btn");
  // nextBtn.disabled = true;

  const exportData = async () => {
    const email = localStorage.getItem("email");
    const endpoint = `${ip[0]}/export-data`;
    try {
      const response = await fetch(endpoint,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(email),
        }
      );
      data_ = await response.json();
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  }

  const fetchWords = async (get_last) => {
    let data_ = null;
    const email = localStorage.getItem("email");
    const endpoint = `${ip[0]}/words`;
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
            get_last
          ]),
        }
      );

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data_ = await response.json();
        // console.log(data_);
        setData(data_);
        // setQuestionsRemaining(data_[0] - data_[1]);
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

  const ageValueHandler = (event) => {
    let age = 0;
    if (event === 0) {
      setAgeValue("0 (unknown word)");
    } else {
      age = event.target.value;
    }

    changeWordFrequency(+age);
    // setWordFrequency(age);

    let valText = age;
    if (valText === 0) {
      valText = "0 (unknown word)";
    } else {
      if (valText === 1) {
        valText += " year";
      } else {
        valText += " years";
      }
    }

    const ageSlider = document.getElementById("ageSlider");
    const ageInput = document.getElementById("ageInput");

    let comp = ageSlider;
    if (event !== 0) {
      comp = event.target.id;
      if ( comp === "ageInput" ) {
        ageSlider.value = age;
      }
      if ( comp === "ageSlider" ) {
        ageInput.value = age;
      }
    } else {
      // Reset all values to default (0)
      ageSlider.value = age;
      ageInput.value = age;
    }

    setAgeValue(valText);
  }

  const handleNextBtnClick = () => {
    setIsInitial(false);
    updateWords();
  }

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
          <h3 className={`word-heading ${word === "(course completed)" ? "course-ended" : ""}`}>{word}</h3>
        ))}

        {
          (
            (
              localStorage.courseName === "Age of Acquisition" ||
              localStorage.courseName === "New Age of Acquisition"
            ) &&
            words[0] !== "(course completed)"
          ) ? (
            <>
              <label for="ageSlider" class="form-label">Age of Acquisition</label>
              <br />
              <input onChange={ageValueHandler} type="range" class="form-range age-slider" min="0" max="200" id="ageSlider"></input>
              <br />
              <input onChange={ageValueHandler} type="number" class="form-range age-input" min="0" max="200" id="ageInput"></input>
              <div id="ageSliderValue">{ageValue}</div>
            </>
          ) : (
            (
              words[0] !== "(course completed)"
            ) ? (
              <>
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

            </>
            ) : (
              <>
              </>
            )
          )
        }

        <br />

        {/* <button className="btn btn-outline-primary btn-bootstrap" onClick={() => setAlwaysUpdate(1-alwaysUpdate)}>Next</button> */}
        {/* 

        {
          (
            words[0] !== "(course completed)"
          ) ? (
            <>
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
            </>
          ) : (
            <>
            </>
          )
        }
       */}

        <button
          className={`btn btn-outline-success btn-bootstrap next-btn ${words[0] === "(course completed)" ? "hide" : ""}`}
          onClick={handleNextBtnClick}
          id="next-btn"
        >
          Next
        </button>
        <p className="status-text">
          {
            (
              words[0] !== "(course completed)"
            ) ? (
              <>
                <p>
                  Only {blockSize - (data[1] % blockSize)} Questions Remaining To Complete Block {blockIndex + 1}
                </p>
              </>
            ) : (
              <>
                Visit <a className="link" href="/my-projects">My Projects</a> page for more courses...
              </>
            )
          }
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default Course;
