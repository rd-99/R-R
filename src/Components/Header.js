import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import img3 from "../public/images/iqvia-logo_color.svg";
import { CONFIG } from "../config";
import "bootstrap/dist/css/bootstrap.min.css";
import "../public/styles/maicons.css";
import "../public/styles/theme.css";
import "../App.css";
import Sidebar from "./Sidebar";

const Header = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isUserLoggedIn, setUserLoggedIn] = useState(false);
  let role = window.localStorage.getItem("role");
  useEffect(() => {
    if (localStorage.getItem("token") && localStorage.getItem("email")) {
      setSidebarVisible(true);
      setUserLoggedIn(true);
    }
  }, []);

  return (
    <div>
      <header>
        <nav
          className="navbar navbar-expand-sm navbar-light shadow-sm p-0"
          style={{ overflow: "auto" }}
        >
          {isSidebarVisible == true && <Sidebar />}

          <div className="container">
            <div className="navbar-brand">
              <img src={img3} />
              &emsp;
            </div>
            <h4 className="mt-1 nav-item">Name Retracted</h4>
            {isUserLoggedIn == true && (
              <NavLink
                to={`${CONFIG.F_DASHBOARD_URL}`}
                className="btn btn-sm btn-outline-info rounded-pill mt-1"
              >
                Go to Dashboard
              </NavLink>
            )}
            {role == "admin" && (
              <NavLink
                to={`${CONFIG.F_ALLUSERS_URL}`}
                className="btn btn-sm btn-outline-info rounded-pill mt-1"
              >
                Assign Roles to Employees
              </NavLink>
            )}
            <div>
              <div className="nav-item active ml-auto">
                {isUserLoggedIn == false && (
                  <NavLink
                    to={`${CONFIG.F_LOGIN_URL}`}
                    className="btn btn-outline rounded-pill"
                  >
                    Sign In
                  </NavLink>
                )}
                {isUserLoggedIn == true && (
                  <>
                    <a>
                      Logged In as:{" "}
                      {localStorage.getItem("email").split("@")[0]} &nbsp;
                      <span className="badge bg-primary text-md">
                        {window.localStorage.getItem("role")}
                      </span>
                    </a>
                    <NavLink
                      to={`${CONFIG.F_LOGOUT_URL}`}
                      className="btn btn-outline rounded-pill"
                    >
                      Logout
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;
