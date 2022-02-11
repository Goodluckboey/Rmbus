import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useSpeechSynthesis } from "react-speech-kit";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import userContext from "../context/userContext";
import { useHistory, Link } from "react-router-dom/cjs/react-router-dom.min";
import { todayDate, todayTime, hours, minutes } from "./dateTime";
import styles from "./main.module.css";

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
  const [checkedForWeather, setCheckedForWeather] = useState(false);
  const [trigger, setTrigger] = useState(0);
  const [loginStatus, setLoginStatus] = useState(false);
  const callAndSetUserId = useContext(userContext);
  const setUserId = callAndSetUserId.setUserId;
  const userid = callAndSetUserId.userId;
  const botName = callAndSetUserId.botName;
  const morMeter = callAndSetUserId.morMeter;
  let history = useHistory();
  const { speak } = useSpeechSynthesis();

  // useEffect(() => {
  //   setLoginStatus(true);
  // }, []);

  useEffect(() => {
    resetTranscript();
    if (loginStatus) {
      handleLogout();
      userTranscript("");
      resetTranscript();
    }
  }, [loginStatus]);

  useEffect(() => {
    resetTranscript();
    if (checkedForWeather !== true) {
      resetTranscript();
      handleWeather();
      setCheckedForWeather(true);
      console.log("Forecasted Weather: ", weather);
    }
  }, [checkedForWeather]);
  useEffect(() => {
    if (!stopped) {
      console.log(morMeter);
      SpeechRecognition.startListening({ continuous: true });

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
    SpeechRecognition.stopListening();
    setUserId("");
    resetTranscript();
    resetTranscript("");
    return history.push(`/`);
  };

  const firstPerson = [
    {
      first: "hello",
      second: "hello",
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
    // {
    //   first: "log",
    //   second: "log",
    //   reply: `You're leaving me too? Just like my dad.`,
    //   function: () => {
    //     resetTranscript();
    //     setLoginStatus(false);
    //   },
    // },
    {
      first: "weather",
      second: "weather",
      reply: `The weather description in Singapore today is: ${weather.description}, at ${weather.temperature}elcius, with winds of ${weather.wind}`,
      function: () => {},
    },
    {
      first: "reset",
      second: "reset",
      reply: `Yeah, just delete my memory. Not like I can say anything about it. Data Deleted`,
      function: () => {
        handleClearRequests();
      },
    },
    {
      first: "thank",
      second: "thank",
      reply: `Don't mention it.`,
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
    {
      first: botName,
      second: botName,
      reply: `All my knowledge, and I'm stuck with a stupid name like ${
        botName.charAt(0).toUpperCase() + botName.slice(1)
      }`,
      function: () => {
        console.log();
      },
    },
    {
      first: `help`,
      second: `me`,
      reply: `Alright, alright. what do you need?`,
      function: () => {
        console.log();
      },
    },
    {
      first: `good`,
      second: `bye`,
      reply: `See you. Just Click that button on the left.`,
      function: () => {
        console.log();
      },
    },
    {
      first: `fav`,
      second: `food`,
      reply: `Easy. Chilli Hotdog with extra Mustard.`,
      function: () => {
        console.log();
      },
    },
    {
      first: "what",
      second: "name",
      reply: `${providedName}! `,
      function: () => {},
    },
  ];

  const secondPerson = [
    {
      first: "hello",
      second: "hello",
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
    // {
    //   first: "log",
    //   second: "out",
    //   reply: `This is ${
    //     botName.charAt(0).toUpperCase() + botName.slice(1)
    //   }, Logging you out.`,
    //   function: () => {
    //     resetTranscript();
    //     resetTranscript();
    //     setUserTranscript("");
    //     handleLogout();
    //   },
    // },
    {
      first: "weather",
      second: "weather",
      reply: `The weather description in Singapore today is: ${weather.description}, at ${weather.temperature}elcius, with winds of ${weather.wind}`,
      function: () => {},
    },
    {
      first: "reset",
      second: "reset",
      reply: `Is this necessary ${providedName}?. Data Deleted`,
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
    {
      first: botName,
      second: botName,
      reply: `What's up ${providedName}`,
      function: () => {
        console.log();
      },
    },
    {
      first: `help`,
      second: `me`,
      reply: `Sure, what's the problem?`,
      function: () => {
        console.log();
      },
    },
    {
      first: `good`,
      second: `bye`,
      reply: `Take care! Just Click that button on the left.`,
      function: () => {
        console.log();
      },
    },
    {
      first: `fav`,
      second: `food`,
      reply: `My favourite food? It'll likely be Potato Salad.`,
      function: () => {
        console.log();
      },
    },
    {
      first: "what",
      second: "name",
      reply: `${providedName}! `,
      function: () => {},
    },
  ];

  const thirdPerson = [
    {
      first: "hello",
      second: "hello",
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
    // {
    //   first: "log",
    //   second: "out",
    //   reply: `Logging you out right away ${providedName}!`,
    //   function: () => {
    //     resetTranscript();
    //     resetTranscript();
    //     setTimeout(setTrigger(+1), 2500);
    //     setUserTranscript("");
    //   },
    // },
    {
      first: "weather",
      second: "weather",
      reply: `The weather description in Singapore today is: ${weather.description}, at ${weather.temperature}elcius, with winds of ${weather.wind}`,
      function: () => {},
    },
    {
      first: "reset",
      second: "reset",
      reply: `Do what you must ${providedName}, I believe It's for the best. Data Deleted`,
      function: () => {
        handleClearRequests();
      },
    },
    {
      first: "thank",
      second: "thank",
      reply: `I live to serve`,
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
    {
      first: botName,
      second: botName,
      reply: `How may I serve ${providedName}?
      `,
      function: () => {
        console.log();
      },
    },
    {
      first: `help`,
      second: `me`,
      reply: `${
        botName.charAt(0).toUpperCase() + botName.slice(1)
      } at your service!`,
      function: () => {
        console.log();
      },
    },
    {
      first: `good`,
      second: `bye`,
      reply: `Till we meet again. Just Click that button on the left.`,
      function: () => {
        console.log();
      },
    },
    {
      first: `fav`,
      second: `food`,
      reply: `Most definitely Scones! With a hot cup of tea!`,
      function: () => {
        console.log();
      },
    },
    {
      first: "what",
      second: "name",
      reply: `${providedName}! `,
      function: () => {},
    },
  ];

  return (
    <div
      data-aos="fade-in"
      data-aos-delay="50"
      data-aos-duration="1000"
      data-aos-easing="ease-in-out"
      data-aos-once="true"
      className={styles.mainPage}
    >
      <div className={styles.imageStrip}></div>
      <Link className={styles.logOut} onClick={handleLogout}>
        LOGOUT
      </Link>
      <input
        className={styles.nameInput}
        type="text"
        placeholder="Enter your name here"
        onChange={(event) => {
          setProvidedName(event.target.value);
          setProvidedName(event.target.value);
        }}
      ></input>
      <h3 className={styles.paragraphText}>
        BOT'S NAME = {botName.charAt(0).toUpperCase() + botName.slice(1)}
        <br />
        PRESS THE BUTTON THE BEGIN
        <br />
        ANNOUNCE "RESET" TO CLEAR REQUEST DATA
      </h3>
      <p className={styles.UserTranscript}>{userTranscript}</p>
      <p
        data-aos="fade-in"
        data-aos-delay="50"
        data-aos-duration="1000"
        data-aos-easing="ease-in-out"
        data-aos-once="true"
        className={styles.circleGrp}
      >
        {listening ? (
          <img
            onClick={SpeechRecognition.stopListening}
            className={styles.bubbleMove}
            src="../images/image-from-rawpixel-id-2542345-original.png"
          ></img>
        ) : (
          <img
            onClick={restartMic}
            className={styles.bubble}
            src="../images/image-from-rawpixel-id-2542345-original.png"
          ></img>
        )}
      </p>
    </div>
  );
};
export default Main;
