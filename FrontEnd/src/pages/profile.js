import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import userContext from "../context/userContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Profile = () => {
  const callAndSetUserId = useContext(userContext);
  const userid = callAndSetUserId.userId;
  const [profileData, setProfileData] = useState();
  const [pulled, setPulled] = useState();
  useEffect(() => {
    retrieveProfile();
    retrieveProfile();
  }, []);

  let history = useHistory();

  const retrieveProfile = () => {
    axios.get(`http://localhost:5000/profile/${userid}`).then((res) => {
      setProfileData(res.data[0]);
      setPulled(true);
    });
  };

  const backToMain = () => {
    return history.push(`/main/${userid}`);
  };

  return (
    <div>
      <button onClick={backToMain}>Back to Main</button>
      {pulled && (
        <>
          <h3>Name of Bot: {profileData.botName}</h3>
          <p>Email: {profileData.email}</p>
          <p>Username: {profileData.userName}</p>
          <p>Morality Score: {profileData.morality}</p>
        </>
      )}
    </div>
  );
};

export default Profile;
