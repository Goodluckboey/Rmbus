import React, { useContext, useReducer, useEffect } from "react";
import axios from "axios";
import userContext from "../context/userContext";
import { useHistory, Link } from "react-router-dom/cjs/react-router-dom.min";
import styles from "./login.module.css";
import "../App.css";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
// ..
AOS.init();

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
    <div
      data-aos="fade-left"
      data-aos-delay="50"
      data-aos-duration="1000"
      data-aos-easing="ease-in-out"
      data-aos-once="true"
      className={styles.loginPage}
    >
      <img src="/images/logo.png" className={styles.logo} />
      <div className={styles.inputCollection}>
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
          className={styles.inputbar}
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
          className={styles.inputbar}
          placeholder="Password"
        />
      </div>
      <button
        className={styles.loginButton}
        type="button"
        onClick={handleLogin}
      >
        Login
      </button>
      <div className={styles.Linkage}>
        <Link to="/registration">
          <h4>Create an Account</h4>
        </Link>
        <Link to="/">
          <h4>Return to Homepage</h4>
        </Link>
      </div>
    </div>
  );
};

export default Login;
