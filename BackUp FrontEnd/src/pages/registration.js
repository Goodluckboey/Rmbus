// dependencies
import axios from "axios";
import React, { useReducer } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

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

  // Make click handle for Registration
  const innerRegistration = (event) => {
    event.preventDefault();
    const post = async () => {
      const data = {
        userName: input.userName,
        hash: input.password,
        email: input.email,
        botName: input.botName,
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

  return (
    <div className="registrationPage">
      <form>
        <input
          type="text"
          value={input.botName}
          onChange={(event) => {
            dispatchInput({
              type: "BotName",
              payload: { input: event.target.value },
            });
          }}
          placeholder="BotName"
        />
        <input
          type="email"
          value={input.email}
          onChange={(event) => {
            dispatchInput({
              type: "Email",
              payload: { input: event.target.value },
            });
          }}
          placeholder="Email"
        />
        <input
          type="text"
          value={input.userName}
          onChange={(event) => {
            dispatchInput({
              type: "Username",
              payload: { input: event.target.value },
            });
          }}
          placeholder="Username"
        />
        <input
          type="password"
          value={input.password}
          onChange={(event) => {
            dispatchInput({
              type: "Password",
              payload: { input: event.target.value },
            });
          }}
          placeholder="Password"
        />
        <Link to="/login">
          <button onClick={innerRegistration} value="Sign up" type="submit">
            Register
          </button>
        </Link>
      </form>
    </div>
  );
};

export default Registration;
