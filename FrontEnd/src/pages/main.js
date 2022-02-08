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
  const morMeter = callAndSetUserId.morMeter;
  const [userTranscript, setUserTranscript] = useState("");
  const [botResponse, setBotResponse] = useState("");
  const [greet, setGreet] = useState(false);

  const [assigningName, setAssigningName] = useState(0);
  const [providedName, setProvidedName] = useState("");

  // >>>> To Enable Text to Speech return
  const { speak } = useSpeechSynthesis();

  // >>>> To Let App know when LISTENING has stopped
  const [stopped, setStopped] = useState(false);
  const [botReady, setBotReady] = useState(false);
  const [reqDelete, setReqDelete] = useState(false);
  const [weather, setWeather] = useState("");
  const [repeat, setRepeat] = useState("");

  let history = useHistory();

  const voices = speechSynthesis.getVoices();

  // USE EFFECTS =============================================================
  const newft = () => {
    console.log("functioning");
    if (providedName.length != "") {
      console.log("also functioning");
      setBotResponse(`${providedName},  I'll remember that. How can i help?`);
      afterEachResponse();
    }
  };

  useEffect(() => {
    console.log(transcript);
    setUserTranscript(transcript);
    console.log("istranscriptworking");
    setProvidedName(userTranscript);
    if (userTranscript.length > 0) {
      setProvidedName(userTranscript);
      console.log("setProvidedName to Transcript");
    }
  }, [assigningName]);

  useEffect(() => {
    setTimeout(newft, 8500);
  }, [providedName]);

  useEffect(() => {
    if (botReady === true) {
      speak({ text: botResponse });
      setBotReady(false);
      setBotReady(false);
    }
  }, [botReady]);

  // >>>> set Eternal Login for Testing purposes
  useEffect(() => {
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

  let { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const microphoneRef = useRef(null);

  useEffect(() => {
    setUserTranscript(transcript);
    setUserTranscript(transcript);
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

  const handleWeather = async () => {
    try {
      const res = await axios.get(
        `https://goweather.herokuapp.com/weather/singapore`
      );
      // console.log("weather: ", res.data);
      setWeather(res.data);
      setWeather(res.data);
    } catch (err) {}
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
    // handleSendRequest();
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

  // GLOBAL CODES ===================================================================

  // >>>> Time And Date Functions
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

  const afterEachResponse = () => {
    handleSendRequest();
    setBotReady(true);
    resetTranscript();
    // setUserTranscript("");
    setUserTranscript("");
  };

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
        if (greet === false) {
          // handleWeather();

          setBotResponse(
            `Hello! My name is ${
              botName.charAt(0).toUpperCase() + botName.slice(1)
            }, How may I address you?`
          );
          afterEachResponse();
          resetTranscript();
          setTimeout(setProvidedName(userTranscript), 7900);
          setGreet(true);
        }
      }

      if (greet) {
        if (assigningName === 0) {
          setAssigningName(+1);
        }
        if (assigningName > 0) {
          if (userTranscript.toLowerCase().includes(`hello ${botName}`)) {
            setBotResponse(`Didnt you greet me earlier ${providedName}?`);
            afterEachResponse();
            // } else if (userTranscript.toLowerCase().includes("weather")) {
            //   setBotResponse(
            //     `My newspaper says it'll be ${weather.description} in Singapore today, at ${weather.temperature}elcius, with winds of ${weather.wind}`
            //   );
            //   afterEachResponse();
          } else if (userTranscript.toLowerCase().includes("evening")) {
            setBotResponse(
              `Good evening ${providedName}, how has your day been?`
            );

            afterEachResponse();
          } else if (userTranscript.toLowerCase().includes("goodbye")) {
            setBotResponse(`It's been a pleasure ${providedName}.`);
            afterEachResponse();
            handleLogout();
          } else if (userTranscript.toLowerCase().includes("time")) {
            setBotResponse(`${todayTime}`);

            afterEachResponse();
          } else if (userTranscript.toLowerCase().includes("date")) {
            setBotResponse(`The date today is ${todayDate}.`);

            afterEachResponse();
          } else if (userTranscript.toLowerCase().includes("thank you")) {
            setBotResponse(`You're very welcome ${providedName}.`);

            afterEachResponse();
          } else if (
            userTranscript.toLowerCase().includes("log") &&
            userTranscript.toLowerCase().includes("out")
          ) {
            setBotResponse(`Understood ${providedName}, Logging you out.`);

            afterEachResponse();
            handleLogout();
          } else if (userTranscript.toLowerCase().includes("repeat")) {
            afterEachResponse();
          } else if (
            userTranscript.toLowerCase().includes("find") &&
            userTranscript.toLowerCase().includes("me")
          ) {
            setBotResponse(`Of course, what would you like me to find?`);

            afterEachResponse();
            if (userTranscript != "") {
            }
          } else if (
            userTranscript.toLowerCase().includes("how") &&
            userTranscript.toLowerCase().includes("you")
          ) {
            setBotResponse(`A bit nervous. I'm presenting today aren't I?`);
            afterEachResponse();
          } else if (
            userTranscript.toLowerCase().includes("no") &&
            userTranscript.toLowerCase().includes("nervous")
          ) {
            setBotResponse(`Thanks ${providedName}. Hello Everyone!`);

            afterEachResponse();
          }
        }
      }
    }
  };

  let printedResponse = botResponse;

  const bringToProfile = () => {
    stopListening();
    return history.push(`/profile/${userid}`);
  };

  botCommandsGRP1();

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  return (
    <div className="grid">
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
            {/* {transcript != "" && (
              <p>
                {botName.charAt(0).toUpperCase() + botName.slice(1)} is
                listening..
              </p>
            )} */}
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
