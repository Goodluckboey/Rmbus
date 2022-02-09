// >>>> To Update DB with new REQUEST
export const handleSendRequest = async (prototype) => {
  const endpoint = `http://localhost:5000/main/${prototype}/`;
  try {
    const res = await axios.put(endpoint, userTranscript);
    // console.log(res);
  } catch (error) {
    console.log(error);
  }
};

// >>>> To GET Request Data from DB based on user
export const handleGetRequest = async (prototype) => {
  try {
    const res = await axios.get(`http://localhost:5000/requests/${userid}`);
  } catch (err) {
    // console.log(err);
  }
};

// >>>> To DELETE Request Data from DB based on user
export const handleClearRequests = async () => {
  try {
    const res = await axios.delete(
      `http://localhost:5000/deleteRequests/${userid}`
    );
  } catch (err) {
    // console.log(err);
  }
};

// >>>> To fetch Weather Data
export const handleWeather = async () => {
  try {
    const res = await axios.get(
      `https://goweather.herokuapp.com/weather/singapore`
    );
    setWeather(res.data);
  } catch (err) {}
};
