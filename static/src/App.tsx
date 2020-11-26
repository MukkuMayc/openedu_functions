import * as React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Authenticate from "./components/Authenticate";
import InviteEnroll from "./components/InviteEnroll";

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authenticating, setAuthenticating] = useState(true);

  useEffect(() => {
    fetch("/api/check-authentication")
      .then((res) => {
        res.text().then((txt) => console.log(txt));
        setAuthenticated(res.ok);
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
          <nav>
            <Link to="/">HOMO</Link> {" | "}
            {authenticated ? (
              <Link to="/invite-enroll">
                Invite and enroll students {" | "}
              </Link>
            ) : (
              <Link to="/authenticate">Authenticate {" | "}</Link>
            )}
          </nav>
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
