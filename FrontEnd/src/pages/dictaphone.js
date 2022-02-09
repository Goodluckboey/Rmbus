import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useSpeechSynthesis } from "react-speech-kit";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import userContext from "../context/userContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { todayDate, todayTime, hours, minutes } from "./dateTime";

// ========================================================================================================================================================================================================================================
// COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE |
// COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE |
// ========================================================================================================================================================================================================================================

const Dictaphone = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [userTranscript, setUserTranscript] = useState();
  const [stopped, setStopped] = useState(false);
  const [providedName, setProvidedName] = useState("Default User");
  const [weather, setWeather] = useState("");
  const callAndSetUserId = useContext(userContext);
  const setUserId = callAndSetUserId.setUserId;
  const userid = callAndSetUserId.userId;
  const botName = callAndSetUserId.botName;
  const morMeter = callAndSetUserId.morMeter;
  let history = useHistory();
  const { speak } = useSpeechSynthesis();

  useEffect(() => {
    if (!stopped) {
      SpeechRecognition.startListening({ continuous: true });
      //   setUserTranscript(transcript);
      commandList1(firstPerson);
    }
  }, [transcript, stopped]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const restartMic = () => {
    SpeechRecognition.startListening();
    setStopped(false);
  };

  const commandList1 = (array) => {
    array.map((element) => {
      if (transcript.toLowerCase().includes(element.first)) {
        if (transcript.toLowerCase().includes(element.second)) {
          if (element.function !== undefined) {
            element.function();
          }
          speak({ text: element.reply });
          resetTranscript();
        }
      }
    });

    // if (transcript.toLowerCase().includes("stop")) {
    //   SpeechRecognition.stopListening();
    //   setStopped(true);
    // }
  };

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

  const firstPerson = [
    {
      first: "hello",
      second: botName,
      reply: `Well hello there!`,
      function: () => {
        console.log("This is the start");
      },
    },
    {
      first: "how",
      second: "you",
      reply: `A bit nervous. I'm presenting today aren't I?`,
      function: () => {
        console.log("of something new");
      },
    },
    {
      first: "no",
      second: "nervous",
      reply: `Thanks ${providedName}. Hello Everyone!`,
    },
    {
      first: "date",
      second: "date",
      reply: `The date today is ${todayDate}.`,
    },
    {
      first: "log",
      second: "out",
      reply: `This is ${botName}, Logging you out.`,
    },
  ];

  return (
    <div>
      <p>Microphone: {listening ? "on" : "off"}</p>
      <button onClick={restartMic}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>{transcript}</p>
    </div>
  );
};
export default Dictaphone;
