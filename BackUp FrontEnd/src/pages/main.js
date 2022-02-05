import React from "react";
import { useRef, useState, useContext, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import axios from "axios";
import userContext from "../context/userContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Speech from "react-speech";

const Main = () => {
  // INITIALIZING CODES; CONTEXT, STATES, HISTORY, PARAMS =============================================================

  const callAndSetUserId = useContext(userContext);
  const setUserId = callAndSetUserId.setUserId;
  const userid = callAndSetUserId.userId;

  const [userTranscript, setUserTranscript] = useState("");

  // >>>> To Let App know when LISTENING has stopped
  const [stopped, setStopped] = useState(false);
  const [allUserReqs, setAllUserReqs] = useState();

  let history = useHistory();

  // USEEFFECTS =============================================================

  // >>>> set Eternal Login for Testing purposes
  useEffect(() => {
    setUserId("61fba1b8b6a1344d4a6ee8c6");
    handleGetRequest();
  }, []);

  // >>>> To Send Data to DB, and Reset the transcript once LISTENING has stopped
  useEffect(() => {
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

  console.log(
    "Speech: ",
    <Speech text={`${userTranscript}`} voice="Google UK English Male" />
  );

  // console.log(
  //   typeof (
  //     <Speech text={`${userTranscript}`} voice="Google UK English Male">

  //     </Speech>
  //   )
  // );

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
      <Speech text={`${userTranscript}`} voice="Google UK English Male">
        {
          (<Speech text={`${userTranscript}`} voice="Google UK English Male" />)
            .type.prototype
        }
      </Speech>
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
