import React from "react";
import { Link, useLocation } from "react-router-dom";

export interface INavBarProps {
  authenticated: boolean;
}

const NavBar: React.FC<INavBarProps> = ({ authenticated }) => {
  const pathname = useLocation().pathname;
  return (
    <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <div className="navbar-nav">
          <Link
            to="/"
            className={`nav-item nav-link ${
              pathname === "/" || pathname === "" ? "active" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/invite-enroll"
            className={`nav-item nav-link ${
              pathname === "/invite-enroll" ? "active" : ""
            }`}
          >
            Invite and enroll students
          </Link>
          <Link
            to="/authenticate"
            className={`nav-item nav-link ${
              pathname === "/authenticate" ? "active" : ""
            }`}
          >
            {authenticated ? "Reauthenticate" : "Authenticate"}
          </Link>
        </div>
        <span className="navbar-text">
          Status:{" "}
          {authenticated ? (
            <div style={{ color: "green" }}>Authenticated to Openedu</div>
          ) : (
            <div style={{ color: "tomato" }}>Not authenticated to Openedu</div>
          )}
        </span>
      </div>
    </nav>
  );
};

export { NavBar };
