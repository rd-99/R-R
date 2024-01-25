import React, { useState } from "react";
import image from "../public/images/undraw_profile_re_4a55.svg";
import "../public/styles/Login.css";
import Axios from "axios";
import Swal from "sweetalert";
import swal from "sweetalert2";
import { CONFIG } from "../config";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import * as Icon from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newUser, setNewUser] = useState({});
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const demoLogin = (e) => {
    e.preventDefault();
    Swal("Login Successful!", "Welcome to R&R!", "success");
    window.localStorage.setItem("token", "res.data.token");
    window.localStorage.setItem("email", "demoUser@earth.com");
    window.localStorage.setItem("role", "admin");
    window.location.href = CONFIG.F_DASHBOARD_URL;
  };

  const login = (e) => {
    e.preventDefault();
    Axios.post(`${CONFIG.LOGIN_URL}`, {
      email,
      password,
    })
      .then((res) => {
        if (res.data.success == true) {
          console.log(res.data);
          Swal("Login Successful!", "Welcome to R&R!", "success");
          window.localStorage.setItem("token", res.data.token);
          window.localStorage.setItem("email", res.data.email);
          window.localStorage.setItem("role", res.data.role);
          window.location.href = CONFIG.F_DASHBOARD_URL;
        }
      })
      .catch((err) => {
        console.log(err, 34567);
        swal.fire({
          title: "Failure",
          showDenyButton: false,
          // confirmButtonText: `Ok`,
          text: "You may not have access to the platform!",
        });
      });
    console.log(e);
  };
  const handleNewUser = async (e) => {
    e.preventDefault();
    try {
      let response = await Axios.post(CONFIG.ADD_USER_URL, {
        id: newUser.employeeID,
        role: "user",
      });
      swal
        .fire({
          title: "Success",
          showDenyButton: false,
          confirmButtonText: `Ok`,
          text: "Employee added successfully!",
        })
        .then(() => handleClose());
    } catch (error) {
      console.log(error.response);
      swal
        .fire({
          title: "Failure",
          showDenyButton: false,
          confirmButtonText: `Ok`,
          text: error.response.data.err,
        })
        .then(() => handleClose());
    }
  };
  const loginSSO = (e) => {
    e.preventDefault();
    location.href = CONFIG.SSO_URL;
  };

  return (
    <div style={{ marginTop: "10vh" }}>
      <form className="form-signin">
        <div className="text-center mb-4">
          <img
            className="mb-4"
            src={image}
            alt=""
            width="50%"
            height="90"
            style={{ margin: "20px" }}
          />
          <h4 className=" mb-3 text-muted">Login to continue</h4>
        </div>

        <div className="form-floating mb-3">
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
          />
          <label htmlFor="floatingInput">Email address</label>
        </div>

        <div className="form-floating mb-3">
          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>
        <button
          className="mt-1 w-100 btn-secondary"
          type="submit"
          onClick={login}
        >
          Sign in
        </button>
        <hr />

        <button
          className="mt-1 mb-2 w-100 btn-primary"
          type="submit"
          onClick={loginSSO}
        >
          Login using SSO (Recommended)
        </button>
        <hr />
        <button
          className="mt-1 mb-2 w-100 btn-primary"
          type="submit"
          onClick={demoLogin}
        >
          Demo Login as Admin
        </button>
        <hr />

        <NavLink
          to="#"
          style={{ color: "#216297", textDecoration: "none" }}
          onClick={handleShow}
        >
          <Icon.PeopleFill size={18} /> Request Access
        </NavLink>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Request Access</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Enter you QID/UID:</p>
            <div className="form-floating mb-3">
              <input
                onChange={(e) => {
                  setNewUser({ ...newUser, employeeID: e.target.value });
                }}
                type="text"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
              />
              <label htmlFor="floatingPassword">Employee ID</label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={handleNewUser}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
        <NavLink
          to="mailto:abc@rutu.com?cc=def@rutu.com&amp;subject=Regarding Rewards and Recognition App"
          style={{
            color: "#216297",
            textDecoration: "none",
            marginInlineStart: "50%",
          }}
        >
          <Icon.InfoCircleFill size={18} /> Help
        </NavLink>
        <p className="mt-3 text-muted text-center">&copy; Retracted 2023</p>
      </form>
    </div>
  );
};

export default Login;
