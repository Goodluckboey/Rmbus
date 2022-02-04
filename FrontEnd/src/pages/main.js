import React from "react";
import { useRef, useState, useContext, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import axios from "axios";
import userContext from "../context/userContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Main = () => {
  const callAndSetUserId = useContext(userContext);
  const setUserId = callAndSetUserId.setUserId;
  const userid = callAndSetUserId.userId;

  const [userTranscript, setUserTranscript] = useState("");
  const [checker, setChecker] = useState(false);
  const [allUserReqs, setAllUserReqs] = useState();

  let history = useHistory();

  // For Testing purposes
  useEffect(() => {
    setUserId("61fba1b8b6a1344d4a6ee8c6");
  }, []);

  useEffect(() => {
    if (checker) {
      handleSendRequest();
      resetTranscript();
    }
  }, [checker]);

  let { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const microphoneRef = useRef(null);

  useEffect(() => {
    setUserTranscript(transcript);
    handleGetRequest();
  }, [transcript]);

  // useEffect(() => {
  //   handleReadRequest();
  // }, [allUserReqs]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <div className="mircophone-container">
        Browser is not Support Speech Recognition.
      </div>
    );
  }

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
    setChecker(true);
    console.log(`{${userTranscript}}`, "has been Sent!");
  };

  const handleReset = () => {
    stopHandle();
    resetTranscript();
  };

  const handleListing = () => {
    setChecker(false);
    resetTranscript();
    setIsListening(true);
    microphoneRef.current.classList.add("listening");
    SpeechRecognition.startListening({
      continuous: true,
    });
    setTimeout(stopListening, 3000);
  };

  const handleSendRequest = async () => {
    // console.log("P: ", parameter);
    const endpoint = `http://localhost:5000/main/${userid}/`;
    try {
      const res = await axios.put(endpoint, userTranscript);
      console.log("res: ", res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    setUserId("");
    return history.push(`/`);
  };

  const handleGetRequest = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/requests/${userid}`);
      // console.log("fetched!");
      // console.log("req.data: >>>>>>>>>>>>>>>>>");
      // console.log(res.data);
      setAllUserReqs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // const handleReadRequest = () => {
  // console.log(allUserReqs);
  // };

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  if (transcript.includes("reset")) {
    resetTranscript();
    handleListing();
  }
  if (isListening) {
    if (transcript.includes("terminate")) {
      stopHandle();
    }
  }

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
