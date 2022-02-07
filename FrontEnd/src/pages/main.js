import React from "react";
import { useRef, useState, useContext, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import axios from "axios";
import userContext from "../context/userContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Speech from "react-speech";
import { useSpeechSynthesis } from "react-speech-kit";

const Main = () => {
  // INITIALIZING CODES; CONTEXT, STATES, HISTORY, PARAMS =============================================================

  const callAndSetUserId = useContext(userContext);
  const setUserId = callAndSetUserId.setUserId;
  const userid = callAndSetUserId.userId;
  const botName = callAndSetUserId.botName;
  const [userTranscript, setUserTranscript] = useState("");
  const [botResponse, setBotResponse] = useState("");
  const [greet, setGreet] = useState(false);

  // >>>> To Enable Text to Speech return
  const { speak } = useSpeechSynthesis();

  // >>>> To Let App know when LISTENING has stopped
  const [stopped, setStopped] = useState(false);
  const [botReady, setBotReady] = useState(false);
  const [reqDelete, setReqDelete] = useState(false);

  let history = useHistory();

  const voices = speechSynthesis.getVoices();

  // USE EFFECTS =============================================================

  useEffect(() => {
    if (botReady === true) {
      // stopListening();
      speak({ text: botResponse });
      setBotReady(false);
      setBotReady(false);
    }
  }, [botReady]);

  // >>>> set Eternal Login for Testing purposes
  useEffect(() => {
    setUserId("61fba1b8b6a1344d4a6ee8c6");
    handleGetRequest();
    handleListing(6000);
  }, []);

  // >>>> To Send Data to DB, and Reset the transcript once LISTENING has stopped
  useEffect(() => {
    if (stopped) {
      handleGetRequest();
      setBotReady(false);
      setBotReady(false);
    }
  }, [stopped]);

  // useEffect(() => {
  //   if (stopped != true) {
  //     handleSendRequest();
  //   }
  // }, [userTranscript]);

  let { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const microphoneRef = useRef(null);

  useEffect(() => {
    setUserTranscript(transcript);
    setUserTranscript(transcript);
    // console.log("botResponse: ", botResponse);
  }, [transcript]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <div className="mircophone-container">
        Browser is not Support Speech Recognition.
      </div>
    );
  }

  // MAJOR HANDLES ==========================================================

  // >>>> To Update DB with new REQUEST

  const handleSendRequest = async () => {
    const endpoint = `http://localhost:5000/main/${userid}/`;
    try {
      const res = await axios.put(endpoint, userTranscript);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  // >>>> To GET Request Data from DB based on user
  const handleGetRequest = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/requests/${userid}`);
    } catch (err) {
      // console.log(err);
    }
  };

  // >>>> To DELETE Request Data from DB based on user
  const handleClearRequests = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/deleteRequests/${userid}`
      );
    } catch (err) {
      // console.log(err);
    }
  };

  const handleWeather = async () => {
    try {
      const res = await axios.get(
        `https://goweather.herokuapp.com/weather/singapore`
      );
      console.log("weather: ", res.data.description);
      weather = res.data.description;
    } catch (err) {
      // console.log(err);
    }
  };

  // Minor Handles ============================================================
  const handleLogout = () => {
    setUserId("");
    stopListening();
    return history.push(`/`);
  };

  const handleReset = () => {
    stopHandle();
    resetTranscript();
  };

  const stopHandle = () => {
    setIsListening(false);
    microphoneRef.current.classList.remove("listening");
    SpeechRecognition.abortListening();
    resetTranscript();
  };

  const stopListening = () => {
    setIsListening(false);
    microphoneRef.current.classList.remove("listening");
    SpeechRecognition.stopListening();
    handleSendRequest();
    setStopped(true);
    setStopped(true);
  };

  // >>>> To Begin Listening
  const handleListing = () => {
    setStopped(false);
    resetTranscript();
    setIsListening(true);
    microphoneRef.current.classList.add("listening");
    SpeechRecognition.startListening({
      continuous: true,
    });
    // setTimeout(stopListening, timeOut);
    setReqDelete(false);
  };

  const innerListening = () => {
    setStopped(false);
    resetTranscript();
    setIsListening(true);
    microphoneRef.current.classList.add("listening");
    SpeechRecognition.startListening({
      continuous: true,
    });
    // setTimeout(stopListening, 8000);
    setReqDelete(false);
  };

  // GLOBAL CODES ===================================================================

  // >>>> Time And Date Functions
  let weather = "";
  let today = new Date();
  let month = today.getMonth() + 1;
  const monthList = [
    "january",
    "febuary",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    " november",
    "december",
  ];
  const monthFunction = () => {
    for (let i = 1; i < monthList.length; i++) {
      if (i === month) {
        month = monthList[i];
      }
    }
  };
  monthFunction();
  let todayDate =
    "day " + today.getDate() + " of " + month + ", " + today.getFullYear();
  let hours = today.getHours();
  let timeDetermine = "AM";
  let minutes = today.getMinutes();
  const rightTime = () => {
    if (hours > 12) {
      hours -= 12;
      timeDetermine = "PM";
    }
  };
  rightTime();
  let todayTime = `The time now is ${hours} ${minutes} ${timeDetermine}`;
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // BOT COMMANDS ==================================================================
  const botCommandsGRP1 = () => {
    if (botResponse != true) {
      if (userTranscript.includes("destroy")) {
        // resetTranscript();
        if (reqDelete === false) {
          handleClearRequests();
          console.log("sentClearRequests");
          setReqDelete(true);
          resetTranscript();
        }
      }
      if (userTranscript.toLowerCase().includes(`hello ${botName}`)) {
        setBotResponse(
          "Well Hello there, it's nice to meet you. How can i help?"
        );
        setBotReady(true);
        resetTranscript();
        setUserTranscript("");
        setUserTranscript("");
        setGreet(true);
      }

      if (greet) {
        if (userTranscript.toLowerCase().includes(`hello ${botName}`)) {
          setBotResponse("Didnt you greet me earlier?");
          setBotReady(true);
          resetTranscript();
          setUserTranscript("");
          setUserTranscript("");
        }
        if (userTranscript.toLowerCase().includes("weather")) {
          handleWeather();
          setBotResponse("Let me pull up my newspaper..");
          setBotResponse(
            `Ah.. my newspaper says it'll be ${weather} in Singapore today`
          );
          setBotReady(true);
          resetTranscript();
          setUserTranscript("");
          setUserTranscript("");
        } else if (userTranscript.toLowerCase().includes("evening")) {
          setBotResponse("Good evening, how has your day been?");
          setBotReady(true);
          resetTranscript();
          setUserTranscript("");
          setUserTranscript("");
        } else if (userTranscript.toLowerCase().includes("goodbye")) {
          setBotResponse("It's been a pleasure.");
          setBotReady(true);
          resetTranscript();
          setUserTranscript("");
          setUserTranscript("");
          stopListening();
        } else if (userTranscript.toLowerCase().includes("time")) {
          setBotResponse(`${todayTime}`);
          setBotReady(true);
          resetTranscript();
          setUserTranscript("");
          setUserTranscript("");
        } else if (userTranscript.toLowerCase().includes("date")) {
          setBotResponse(`The date today is ${todayDate}.`);
          setBotReady(true);
          resetTranscript();
          setUserTranscript("");
          setUserTranscript("");
        }
      }
    }
  };

  let printedResponse = botResponse;

  botCommandsGRP1();
  return (
    <div className="microphone-wrapper">
      <button onClick={handleLogout}>Logout</button>

      <div className="mircophone-container">
        <div
          className="microphone-icon-container"
          ref={microphoneRef}
          onClick={handleListing}
        >
          <img
            src="/images/207-2078589_recording-symbol-vector-iphone-microphone-icon.png"
            className="microphone-icon"
          />
        </div>
        <div className="microphone-status">
          {isListening ? "Listening........." : "Click to start Listening"}
        </div>
        {isListening && (
          <button className="microphone-stop btn" onClick={stopHandle}>
            Stop
          </button>
        )}
      </div>
      <div className="microphone-result-container">
        <ul className="microphone-result-text">
          <p>{transcript}</p>
          <h4>{printedResponse}</h4>
        </ul>
      </div>
      {transcript && (
        <div className="microphone-result-container">
          <button className="microphone-reset btn" onClick={handleReset}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default Main;
