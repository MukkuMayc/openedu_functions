import * as React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Authenticate from "./components/Authenticate";
import InviteEnroll from "./components/InviteEnroll";
import { NavBar } from "./components/NavBar";

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authenticating, setAuthenticating] = useState(true);

  useEffect(() => {
    fetch("/api/check-authentication")
      .then((res) => res.text())
      .then((res) => {
        setAuthenticated(res === "Authenticated");
      })
      .catch((e) => {
        console.error(e);
      })
      .then(() => setAuthenticating(false));
  }, []);

  return (
    <div className="app">
      {!authenticating && (
        <Router>
          <NavBar authenticated={authenticated} />
          <Switch>
            <Route path="/authenticate">
              <Authenticate {...{ setAuthenticated }} />
            </Route>
            <Route path="/invite-enroll">
              <InviteEnroll />
            </Route>
          </Switch>
        </Router>
      )}
    </div>
  );
};

export default App;
