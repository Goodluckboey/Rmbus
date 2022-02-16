import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Registration from "./pages/registration";
import Front from "./pages/front";
import Main from "./pages/main";
import userContext from "./context/userContext";
import Login from "./pages/login";

function App() {
  const [userId, setUserId] = useState();
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <userContext.Provider value={{ userId, setUserId }}>
            <Route exact path="/">
              <Front></Front>
            </Route>
            <Route exact path="/login">
              <Login></Login>
            </Route>
            <Route exact path="/registration">
              <Registration></Registration>
            </Route>
            <Route exact path="/main/:userid">
              <Main></Main>
            </Route>
          </userContext.Provider>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
