import React from "react";
import { Link } from "react-router-dom";
import styles from "./front.module.css";

const Front = () => {
  return (
    <div>
      <p className={styles.textFont}>Personifying Memories</p>
      <Link to="/registration">
        <button className={styles.registerBtn}>To Registration</button>
      </Link>
      <br />
      <Link to="/login">
        <button className={styles.loginBtn}>To Login</button>
      </Link>{" "}
      <p className={styles.mainTitle}>RMBUS</p>
    </div>
  );
};

export default Front;
