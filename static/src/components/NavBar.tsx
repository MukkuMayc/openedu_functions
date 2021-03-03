import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavBar.css";
import { Navbar, Nav, Container } from "react-bootstrap";

export interface INavBarProps {
  authenticated: boolean;
}

const NavBar: React.FC<INavBarProps> = ({ authenticated }) => {
  const pathname = useLocation().pathname;
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Navbar.Toggle aria-controls="navbarToggler" />
        <Navbar.Collapse id="navbarToggler">
          <Container>
            <Nav>
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
            </Nav>
            <Navbar.Text>
              Status:{" "}
              {authenticated ? (
                <div style={{ color: "green" }}>Authenticated to Openedu</div>
              ) : (
                <div style={{ color: "tomato" }}>
                  Not authenticated to Openedu
                </div>
              )}
            </Navbar.Text>
          </Container>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export { NavBar };
