import React from "react";
import { Link } from "react-router-dom";

const Front = () => {
  return (
    <div>
      <h1>This is Front Page</h1>
      <Link to="/registration">
        <button>To Registration</button>
      </Link>
      <br />
      <Link to="/login">
        <button>To Login</button>
      </Link>
    </div>
  );
};

export default Front;
