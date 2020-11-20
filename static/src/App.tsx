import * as React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Authenticate from "./components/Authenticate"
import InviteEnroll from "./components/InviteEnroll"

const App = () => {
  return (
    <div className="app">
      <Router>
        <nav>
          <Link to="/">HOMO</Link> {" | "}
          <Link to="/authenticate">Authenticate</Link> {" | "}
          <Link to="/invite-enroll">Invite and enroll students</Link> {" | "}
        </nav>
        <Switch>
        <Route path="/authenticate">
            <Authenticate />
          </Route>
          <Route path="/invite-enroll">
            <InviteEnroll />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
