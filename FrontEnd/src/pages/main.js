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
  const [userTranscript, setUserTranscript] = useState("");
  const [botResponse, setBotResponse] = useState("");

  // >>>> To Enable Text to Speech return
  const { speak } = useSpeechSynthesis();

  // >>>> To Let App know when LISTENING has stopped
  const [stopped, setStopped] = useState(false);
  const [allUserReqs, setAllUserReqs] = useState();
  const [botReady, setBotReady] = useState(0);

  let history = useHistory();

  // USE EFFECTS =============================================================

  useEffect(() => {
    speak({ text: botResponse });
  }, [botReady]);

  // >>>> set Eternal Login for Testing purposes
  useEffect(() => {
    setUserId("61fba1b8b6a1344d4a6ee8c6");
    handleGetRequest();
  }, []);

  // >>>> To Send Data to DB, and Reset the transcript once LISTENING has stopped
  useEffect(() => {
    botCommands();

    if (stopped) {
      handleSendRequest();
      resetTranscript();
      handleGetRequest();
    }
  }, [stopped]);

  let { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const microphoneRef = useRef(null);

  useEffect(() => {
    setUserTranscript(transcript);
    console.log("botResponse: ", botResponse);
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
      console.log("res: ", res);
    } catch (error) {
      console.log(error);
    }
  };

  // >>>> To GET Request Data from DB based on user
  const handleGetRequest = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/requests/${userid}`);
      setAllUserReqs(res.data);
      // console.log(allUserReqs);
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
    setStopped(true);
    console.log(`{${userTranscript}}`, "has been Sent!");
  };

  const autoStopListening = () => {
    setIsListening(false);
    microphoneRef.current.classList.remove("listening");
    SpeechRecognition.stopListening();
    setStopped(true);
    console.log(`{${userTranscript}}`, "has been Sent!");
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
    setTimeout(stopListening, 3500);
  };

  const autoHandleListing = () => {
    setStopped(false);
    resetTranscript();
    setIsListening(true);
    microphoneRef.current.classList.add("listening");
    SpeechRecognition.startListening({
      continuous: true,
    });
    setTimeout(autoStopListening, 3500);
  };

  // GLOBAL CODES ===================================================================

  // >>>> Commands to control activities
  if (userTranscript.includes("reset")) {
    resetTranscript();
    handleListing();
  }
  if (isListening) {
    if (userTranscript.includes("terminate")) {
      stopHandle();
    }
  }

  // BOT COMMANDS ===================================================================

  const botCommands = () => {
    if (userTranscript.toLowerCase().includes("hello")) {
      setBotResponse("Good afternoon sir, How is your day?");
      setBotReady(botReady + 1);
      handleListing();
    } else if (userTranscript.toLowerCase().includes("weather")) {
      setBotResponse("It's not that good today, is it?");
      setBotReady(botReady + 1);
    } else if (userTranscript.toLowerCase().includes("evening")) {
      setBotResponse("Good evening sir, how has your day been?");
      setBotReady(botReady + 1);
      handleListing();
    } else if (userTranscript.toLowerCase().includes("goodbye")) {
      setBotResponse("ah, leaving so soon sir?");
      setBotReady(botReady + 1);
    } else if (userTranscript.toLowerCase().includes("not good")) {
      setBotResponse("thats a pity sir, anything i can do to help?");
      setBotReady(botReady + 1);
      handleListing();
    } else if (
      userTranscript.toLowerCase().includes("good") &&
      userTranscript.toLowerCase().includes("about you") &&
      (botResponse === "Good afternoon sir, How is your day?" ||
        botResponse === "Good evening sir, how has your day been?")
    ) {
      setBotResponse(
        "Thats great to hear sir! My day has been fantastic. Nothing happened actually"
      );
      setBotReady(botReady + 1);
    }
  };

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
      {transcript && (
        <div className="microphone-result-container">
          <ul className="microphone-result-text">
            <p>{transcript}</p>
          </ul>
          <button className="microphone-reset btn" onClick={handleReset}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default Main;
