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
import { todayDate, todayTime, hours, minutes } from "./dateTime";

// COMPONENT BEGINS HERE COMPONENT BEGINS HERE COMPONENT BEGINS HERE COMPONENT BEGINS HERE COMPONENT BEGINS HERE COMPONENT BEGINS HERE COMPONENT BEGINS HERE

const Main = () => {
  // INITIALIZING CODES; CONTEXT, STATES, HISTORY, PARAMS =============================================================

  const callAndSetUserId = useContext(userContext);
  const setUserId = callAndSetUserId.setUserId;
  const userid = callAndSetUserId.userId;
  const botName = callAndSetUserId.botName;
  const morMeter = callAndSetUserId.morMeter;
  // ===============================================
  const { speak } = useSpeechSynthesis();
  const [userTranscript, setUserTranscript] = useState("");
  const [botResponse, setBotResponse] = useState("");
  const [greet, setGreet] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [botReady, setBotReady] = useState(false);
  const [weather, setWeather] = useState("");
  const [providedName, setProvidedName] = useState("");

  let history = useHistory();

  const voices = speechSynthesis.getVoices();

  // USE EFFECTS =============================================================

  useEffect(() => {
    handleGetRequest();
    handleListing();
  }, []);
  // useEffect(() => {
  //   if (botReady === true) {
  //     speak({ text: botResponse });
  //     setBotReady(false);
  //   }
  // }, [botReady]);

  let { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const microphoneRef = useRef(null);

  setUserTranscript(transcript);

  // ===========================================================

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <div className="mircophone-container">
        Browser is not Support Speech Recognition.
      </div>
    );
  }
  // ===========================================================

  // >>>> To Update DB with new REQUEST
  const handleSendRequest = async () => {
    const endpoint = `http://localhost:5000/main/${userid}/`;
    try {
      const res = await axios.put(endpoint, userTranscript);
      // console.log(res);
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

  // >>>> To fetch Weather Data
  const handleWeather = async () => {
    try {
      const res = await axios.get(
        `https://goweather.herokuapp.com/weather/singapore`
      );
      setWeather(res.data);
    } catch (err) {}
  };

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
    setStopped(true);
  };

  // >>>> To Begin Listening
  const handleListing = () => {
    setStopped(false);
    setIsListening(true);
    microphoneRef.current.classList.add("listening");
    SpeechRecognition.startListening({
      continuous: true,
    });
  };

  let printedResponse = botResponse;

  const afterEachResponse = () => {
    handleSendRequest();
    resetTranscript();
    setUserTranscript("");
    setBotReady(true);
  };

  const bringToProfile = () => {
    stopListening();
    return history.push(`/profile/${userid}`);
  };

  const runThroughArray = (TS, array) => {
    array.map((element) => {
      if (TS.toLowerCase().includes(element.first)) {
        if (TS.toLowerCase().includes(element.second)) {
          setBotResponse(element.reply);

          if (element.function !== undefined) {
            element.function();
          }

          if (
            TS.toLowerCase().includes("hello") &&
            TS.toLowerCase().includes(botName)
          ) {
            setGreet(true);
          }
          afterEachResponse();
        }
      }
    });
  };

  const firstPerson = [
    {
      first: "hello",
      second: botName,
      reply: `Well hello there!`,
      function: () => {
        resetTranscript();
        setTimeout(() => {
          setProvidedName(userTranscript);
          setBotReady(true);
        }, 6000);
      },
    },
    {
      first: "how",
      second: "you",
      reply: `A bit nervous. I'm presenting today aren't I?`,
    },
    {
      first: "no",
      second: "nervous",
      reply: `Thanks ${providedName}. Hello Everyone!`,
    },
    {
      first: "repeat",
      second: "repeat",
      reply: botResponse,
    },
    {
      first: "date",
      second: "date",
      reply: `The date today is ${todayDate}.`,
    },
    {
      first: "log",
      second: "out",
      reply: `Logging you out ${providedName}.`,
      function: handleLogout(),
    },
  ];

  const secondPerson = [
    {
      first: "hello",
      second: botName,
      reply: `Well hello there!`,
    },
    {
      first: "how",
      second: "you",
      reply: `A bit nervous. I'm presenting today aren't I?`,
    },
    {
      first: "no",
      second: "nervous",
      reply: `Thanks ${providedName}. Hello Everyone!`,
    },
    {
      first: "repeat",
      second: "repeat",
      reply: botResponse,
    },
    {
      first: "date",
      second: "date",
      reply: `The date today is ${todayDate}.`,
    },
  ];

  const thirdPerson = [
    {
      first: "hello",
      second: botName,
      reply: `Well hello there!`,
    },
    {
      first: "how",
      second: "you",
      reply: `A bit nervous. I'm presenting today aren't I?`,
    },
    {
      first: "no",
      second: "nervous",
      reply: `Thanks ${providedName}. Hello Everyone!`,
    },
    {
      first: "repeat",
      second: "repeat",
      reply: botResponse,
    },
    {
      first: "date",
      second: "date",
      reply: `The date today is ${todayDate}.`,
    },
  ];

  runThroughArray(transcript, firstPerson);

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  return (
    <div className="grid">
      <p>{providedName}</p>
      <h2>{userTranscript}</h2>
      <div className="microphone-wrapper">
        <button onClick={bringToProfile}>Profile</button>
        <button onClick={handleLogout}>Logout</button>

        <div className="mircophone-container">
          <div
            className="microphone-icon-container"
            ref={microphoneRef}
            onClick={handleListing}
          ></div>
          <div className="microphone-status"></div>
          {isListening && (
            <button className="microphone-stop btn" onClick={stopHandle}>
              Stop
            </button>
          )}
        </div>
        <div className="microphone-result-container">
          <h2>
            Begin with "Hello{" "}
            {botName.charAt(0).toUpperCase() + botName.slice(1)}!"
          </h2>
          <ul className="microphone-result-text">
            <h4>{transcript}</h4>
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
    </div>
  );
};

export default Main;
