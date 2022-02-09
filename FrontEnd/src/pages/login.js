import React, { useContext, useReducer, useEffect } from "react";
import axios from "axios";
import userContext from "../context/userContext";
import { useHistory, Link } from "react-router-dom/cjs/react-router-dom.min";
import "../App.css";

const Login = () => {
  const changeInput = (inputLogin, action) => {
    switch (action.type) {
      case "Username":
        return { ...inputLogin, Username: action.payload.inputLogin };
      case "Password":
        return { ...inputLogin, Password: action.payload.inputLogin };
      default:
        return inputLogin;
    }
  };
  const [inputLogin, dispatchInput] = useReducer(changeInput, {
    Username: "",
    Password: "",
  });

  const assignedUserData = useContext(userContext);
  const setUserId = assignedUserData.setUserId;
  const userId = assignedUserData.userId;
  const setBotName = assignedUserData.setBotName;
  const setMorMeter = assignedUserData.setMorMeter;
  let history = useHistory();

  useEffect(() => {
    if (userId) {
      return history.push(`/main/${userId}`);
    }
  }, [userId]);

  //function to compare username to get the userid
  const retriveUserNameToRetriveUserId = () => {
    //This userLogin has to match the object in back end. This input field is the req.body as tested in postman.
    const userLogin = {
      userName: inputLogin.Username,
      hash: inputLogin.Password,
    };
    //Login at backend checks if the username matches the password. The password is bcrypted so if the correct password matches the username, the hash in the db and the password hash will match and valid = true
    axios.post("http://localhost:5000/login", userLogin).then((res) => {
      if (res.data.valid) {
        console.log(res.data.user._id);
        console.log(res.data.user.botName);
        setUserId(res.data.user._id);
        setBotName(res.data.user.botName);
        setMorMeter(res.data.user.morality);
        console.log("morality: ", res.data.user.morality);
      } else if (res.data.valid != true) {
        alert("Wrong username or password");
        console.log("test");
      }
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    retriveUserNameToRetriveUserId();
  };

  return (
    <div>
      <img src="/images/logo.png" className="logo" />
      <input
        type="text"
        value={inputLogin.Username}
        onChange={(event) => {
          dispatchInput({
            type: "Username",
            payload: { inputLogin: event.target.value },
          });
        }}
        placeholder="Username"
      ></input>
      <input
        type="password"
        value={inputLogin.Password}
        onChange={(event) => {
          dispatchInput({
            type: "Password",
            payload: { inputLogin: event.target.value },
          });
        }}
        placeholder="Password"
      />
      <Link to="/registration">
        <h4>Create an Account</h4>
      </Link>
      <Link to="/">
        <h4>Return to Homepage</h4>
      </Link>
      <button type="button" onClick={handleLogin}>
        continue
      </button>
    </div>
  );
};

export default Login;
