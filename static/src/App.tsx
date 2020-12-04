import * as React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Authenticate from "./components/Authenticate";
import { Home } from "./components/Home";
import InviteEnroll from "./components/InviteEnroll";
import { NavBar } from "./components/NavBar";
import { Loading } from "./Loading";

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
      <Router>
        <NavBar authenticated={authenticated} />
        {authenticating ? (
          <Loading />
        ) : (
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/authenticate" exact>
              <Authenticate {...{ setAuthenticated }} />
            </Route>
            <Route path="/invite-enroll" exact>
              <InviteEnroll />
            </Route>
          </Switch>
        )}
      </Router>
    </div>
  );
};

export default App;
