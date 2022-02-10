// dependencies
import axios from "axios";
import React, { useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
// import "../App.css";
import styles from "./registration.module.css";

const changeInput = (input, action) => {
  switch (action.type) {
    case "Username":
      return { ...input, userName: action.payload.input };
    case "Password":
      return { ...input, password: action.payload.input };
    case "Email":
      return { ...input, email: action.payload.input };
    case "BotName":
      return { ...input, botName: action.payload.input };
    default:
      return input;
  }
};

const Registration = () => {
  // Make a useReducer looking for Type of Input
  let history = useHistory();

  const [input, dispatchInput] = useReducer(changeInput, {
    userName: "",
    password: "",
    email: "",
    botName: "",
  });

  const [robot, setRobot] = useState("ChatBot");

  // Make click handle for Registration
  const innerRegistration = (event) => {
    event.preventDefault();
    const post = async () => {
      const data = {
        userName: input.userName,
        hash: input.password,
        email: input.email,
        botName: input.botName.charAt(0).toLowerCase() + input.botName.slice(1),
        morality: score,
      };
      try {
        const response = await axios.post(
          "http://localhost:5000/registration",
          data
        );
        console.log(response);
        console.log("sent data to mongo");
      } catch (error) {
        console.log(error);
      }
    };
    post();
    history.push("/");
  };

  const questions = [
    {
      questionText: `${robot} sees a wallet on the ground. What does it do?`,
      answerOptions: [
        { answerText: "Don't touch, got ghost.", moralityScore: 2 },
        { answerText: "Keep it", moralityScore: -1 },
        {
          answerText: "Try and return it.",
          moralityScore: 4,
        },
        {
          answerText: "Take some money out first.",
          moralityScore: 1,
        },
      ],
    },
    {
      questionText: `${robot} has escaped it's kidnappers, but notices another victim near it. What does it do?`,
      answerOptions: [
        { answerText: "Escape to call the cops.", moralityScore: 3 },
        { answerText: "Survival of the fittest yo.", moralityScore: 2 },
        {
          answerText: "Use him to escape",
          moralityScore: -2,
        },
        {
          answerText: "Hero die young",
          moralityScore: 4,
        },
      ],
    },
    {
      questionText: `${robot} is coding a new project but has no idea what to do. What does it do?`,
      answerOptions: [
        {
          answerText: "Tough it out",
          moralityScore: 4,
        },
        { answerText: "Stalk classmates", moralityScore: 2 },
        {
          answerText: "TAs, help please",
          moralityScore: 3,
        },
        {
          answerText: "Just copy from online",
          moralityScore: -1,
        },
      ],
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerOptionClick = (moralityScore) => {
    setScore(score + moralityScore);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div className={styles.registrationPage}>
      {/* <img src="/images/logo.png" className={styles.logo} /> */}
      {/* <div className={styles.sideImage}></div> */}
      <div className={styles.registerInfo}>
        <h1 className={styles.header}>Register and create a bot!</h1>
        <form>
          <input
            className={styles.inputbar}
            type="text"
            value={input.botName}
            onChange={(event) => {
              setRobot(event.target.value);
              setRobot(event.target.value);
              if (event.target.value === "") {
                setRobot("Chatbot");
              }
              dispatchInput({
                type: "BotName",
                payload: { input: event.target.value },
              });
            }}
            placeholder="Enter your Bot's name"
          />
          <input
            className={styles.inputbar}
            type="email"
            value={input.email}
            onChange={(event) => {
              dispatchInput({
                type: "Email",
                payload: { input: event.target.value },
              });
            }}
            placeholder="Enter your Email"
          />

          <input
            className={styles.inputbar}
            type="text"
            value={input.userName}
            onChange={(event) => {
              dispatchInput({
                type: "Username",
                payload: { input: event.target.value },
              });
            }}
            placeholder="Enter your Usernamee"
          />

          <input
            className={styles.inputbar}
            type="password"
            value={input.password}
            onChange={(event) => {
              dispatchInput({
                type: "Password",
                payload: { input: event.target.value },
              });
            }}
            placeholder="Enter your Password"
          />
        </form>
        {showScore ? (
          <div className="score-section">Your Morality Score is {score}</div>
        ) : (
          <>
            <div className="question-section">
              <div className={styles.questionCount}>
                Question {currentQuestion + 1} / {questions.length}
              </div>
              <h3 className={styles.questionText}>
                {questions[currentQuestion].questionText}
              </h3>
            </div>
            <div className={styles.answerSection}>
              {questions[currentQuestion].answerOptions.map((answerOption) => (
                <button
                  className={styles.answerSelections}
                  onClick={() =>
                    handleAnswerOptionClick(answerOption.moralityScore)
                  }
                >
                  {answerOption.answerText}
                </button>
              ))}
            </div>
          </>
        )}
        <div className={styles.linkings}>
          <Link to="/" className={styles.homepageLink}>
            Back to Homepage
          </Link>
          <Link to="/login" className={styles.homepageLink}>
            Already have an account?
          </Link>
          <Link to="/login">
            <button
              className={styles.submitBtn}
              onClick={innerRegistration}
              value="Sign up"
              type="submit"
            >
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Registration;
