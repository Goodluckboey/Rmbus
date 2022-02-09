import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Registration from "./pages/registration";
import Front from "./pages/front";
import userContext from "./context/userContext";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Main from "./pages/main";

function App() {
  const [userId, setUserId] = useState();
  const [botName, setBotName] = useState();
  const [morMeter, setMorMeter] = useState();
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <userContext.Provider
            value={{
              userId,
              setUserId,
              botName,
              setBotName,
              morMeter,
              setMorMeter,
            }}
          >
            <Route exact path="/">
              <Front></Front>
            </Route>
            <Route exact path="/login">
              <Login></Login>
            </Route>
            <Route exact path="/registration">
              <Registration></Registration>
            </Route>
            <Route path="/profile/:userid">
              <Profile></Profile>
            </Route>
            <Route exact path="/main/:userid">
              <Main></Main>
              {/* <Main></Main> */}
            </Route>
          </userContext.Provider>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
