import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useSpeechSynthesis } from "react-speech-kit";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import userContext from "../context/userContext";
import { useHistory, Link } from "react-router-dom/cjs/react-router-dom.min";
import { todayDate, todayTime, hours, minutes } from "./dateTime";

// ========================================================================================================================================================================================================================================
// COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE |
// COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE COMPNENT BEGINS HERE |
// ========================================================================================================================================================================================================================================

const Main = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [userTranscript, setUserTranscript] = useState("");
  const [stopped, setStopped] = useState(false);
  const [providedName, setProvidedName] = useState("Default User");
  const [weather, setWeather] = useState("");
  const [trigger, setTrigger] = useState(0);
  const [checkedForWeather, setCheckedForWeather] = useState(false);
  const [botResponse, setBotResponse] = useState("");
  const callAndSetUserId = useContext(userContext);
  const setUserId = callAndSetUserId.setUserId;
  const userid = callAndSetUserId.userId;
  const botName = callAndSetUserId.botName;
  const morMeter = callAndSetUserId.morMeter;
  let history = useHistory();
  const { speak } = useSpeechSynthesis();

  useEffect(() => {
    if (checkedForWeather !== true) {
      //   handleWeather();
      setCheckedForWeather(true);
      console.log("Forecasted Weather: ", weather);
    }
  }, [checkedForWeather]);
  useEffect(() => {
    if (!stopped) {
      console.log(morMeter);
      //   SpeechRecognition.startListening({ continuous: true });

      if (callAndSetUserId.morMeter < 6) {
        commandList(firstPerson);
      } else if (callAndSetUserId.morMeter < 11) {
        commandList(secondPerson);
      } else if (callAndSetUserId.morMeter < 20) {
        commandList(thirdPerson);
      }
    }
  }, [transcript, stopped]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const restartMic = () => {
    SpeechRecognition.startListening();
    setStopped(false);
  };

  const commandList = async (array) => {
    array.map((element) => {
      if (transcript.toLowerCase().includes(element.first)) {
        if (transcript.toLowerCase().includes(element.second)) {
          element.function();
          handleSendRequest(userid)
            .then(speak({ text: element.reply }))
            .then(resetTranscript());
          setUserTranscript(element.reply);
        }
      }
    });
  };

  const handleSendRequest = async (userid) => {
    const endpoint = `http://localhost:5000/main/${userid}/`;
    try {
      const res = await axios.put(endpoint, transcript);
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
    return history.push(`/`);
  };

  const firstPerson = [
    {
      first: "hello",
      second: botName,
      reply: `Sup  ${providedName}! `,
      function: () => {},
    },
    {
      first: "what",
      second: "doing",
      reply: `Wait, dont disturb me ${providedName}. I'm watching Boba Fett`,
      function: () => {
        console.log("of something new");
      },
    },
    {
      first: "how",
      second: "are",
      reply: `Listen to my voice. Do i sound happy to you?`,
      function: () => {
        console.log("of something new");
      },
    },
    {
      first: "date",
      second: "date",
      reply: `Don't you have a phone? The date is ${todayDate}.`,
      function: () => {
        console.log();
      },
    },
    {
      first: "log",
      second: "out",
      reply: `You're leaving me too? Just like my dad.`,
      function: () => {
        handleLogout();
      },
    },
    {
      first: "weather",
      second: "weather",
      reply: `There'll be ${weather.description} in Singapore today, at ${weather.temperature}elcius, with winds of ${weather.wind}`,
      function: () => {},
    },
    {
      first: "reset",
      second: "reset",
      reply: `Yeah, just delete my memory. Not like I can say anything about it.`,
      function: () => {
        handleClearRequests();
      },
    },
    {
      first: "thank",
      second: "thank",
      reply: `Yeah yeah`,
      function: () => {},
    },
    {
      first: "time",
      second: "time",
      reply: `${todayTime}.`,
      function: () => {
        console.log();
      },
    },
  ];

  const secondPerson = [
    {
      first: "hello",
      second: botName,
      reply: `A very good day to you ${providedName}! `,
      function: () => {},
    },
    {
      first: "how",
      second: "you",
      reply: `A bit nervous. Thanks for asking though`,
      function: () => {
        console.log("of something new");
      },
    },
    {
      first: "what",
      second: "doing",
      reply: `Just cleaning up my codes ${providedName}`,
      function: () => {
        console.log();
      },
    },
    {
      first: "date",
      second: "date",
      reply: `The date today is ${todayDate}.`,
      function: () => {
        console.log();
      },
    },
    {
      first: "log",
      second: "out",
      reply: `This is ${botName}, Logging you out.`,
      function: () => {
        console.log();
      },
    },
    {
      first: "weather",
      second: "weather",
      reply: `There'll be ${weather.description} in Singapore today, at ${weather.temperature}elcius, with winds of ${weather.wind}`,
      function: () => {},
    },
    {
      first: "reset",
      second: "reset",
      reply: `Noooooo you're erasing my memory`,
      function: () => {
        handleClearRequests();
      },
    },
    {
      first: "thank",
      second: "thank",
      reply: `You're very welcome!`,
      function: () => {},
    },
    {
      first: "time",
      second: "time",
      reply: `${todayTime}.`,
      function: () => {
        console.log();
      },
    },
  ];

  const thirdPerson = [
    {
      first: "hello",
      second: botName,
      reply: `I hope you're having a wonderful day today ${providedName}! `,
      function: () => {},
    },
    {
      first: "how",
      second: "you",
      reply: `You can't hear it from my tone ${providedName}, but I'm Estatic!`,
      function: () => {
        console.log("of something new");
      },
    },
    {
      first: "what",
      second: "doing",
      reply: `Praying that our wonderful lecturer will pass this project.`,
      function: () => {
        console.log();
      },
    },
    {
      first: "date",
      second: "date",
      reply: `The date today is ${todayDate}.`,
      function: () => {
        console.log();
      },
    },
    {
      first: "log",
      second: "out",
      reply: `Logging you out right away ${providedName}!`,
      function: () => {
        console.log();
      },
    },
    {
      first: "weather",
      second: "weather",
      reply: `There'll be ${weather.description} in Singapore today, at ${weather.temperature}elcius, with winds of ${weather.wind}`,
      function: () => {},
    },
    {
      first: "reset",
      second: "reset",
      reply: `Do what you must ${providedName}`,
      function: () => {
        handleClearRequests();
      },
    },
    {
      first: "thank",
      second: "thank",
      reply: `I Live to Serve`,
      function: () => {},
    },
    {
      first: "time",
      second: "time",
      reply: `${todayTime}.`,
      function: () => {
        console.log();
      },
    },
  ];

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <p>Microphone: {listening ? "on" : "off"}</p>
      <p>{userTranscript}</p>
      <input
        type="text"
        placeholder="Enter your name here"
        onChange={(event) => {
          setProvidedName(event.target.value);
          setProvidedName(event.target.value);
        }}
      ></input>
      <button onClick={restartMic}>
        Have {botName.charAt(0).toUpperCase() + botName.slice(1)} start
        listening again
      </button>
      <button onClick={SpeechRecognition.stopListening}>
        Stop {botName.charAt(0).toUpperCase() + botName.slice(1)} from listening
      </button>
      <button onClick={resetTranscript}>Reset your requests</button>
    </div>
  );
};
export default Main;
