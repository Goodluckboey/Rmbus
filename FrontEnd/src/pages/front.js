import React from "react";
import { Link } from "react-router-dom";
import styles from "./front.module.css";

const Front = () => {
  return (
    <div
      data-aos="fade-in"
      data-aos-delay="50"
      data-aos-duration="1000"
      data-aos-easing="ease-in-out"
      data-aos-once="true"
    >
      <div className={styles.largeBtns}>
        <Link to="/registration">
          <button className={styles.registerBtn}> To Registration</button>
        </Link>

        <Link to="/login">
          <button className={styles.loginBtn}>To Login</button>
        </Link>
      </div>
      <p className={styles.placeHolderRegister}>Register an Account</p>
      <p className={styles.placeHolderLogin}>Login to your Account</p>
      <p className={styles.textFont}>PERSONIFYING MEMORIES</p>
      <p className={styles.mainTitle}>RMBUS</p>
    </div>
  );
};

export default Front;
