import React, { useEffect, useState } from "react";
import axios from "axios";
import { CONFIG } from "../config";
import { Form, Modal } from "react-bootstrap";
import swal from "sweetalert2";
import Header from "./Header";
import * as Icon from "react-bootstrap-icons";
import DataTable from "react-data-table-component";

const AssignRoles = () => {
  const roles = ["user", "reviewer", "approver", "final approver", "admin"];
  let [users, setUsers] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [newUser, setNewUser] = useState({});
  const [searchName, setSearchName] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    axios
      .post(CONFIG.ALL_USERS_URL, {
        token: window.localStorage.token,
      })
      .then((response) => {
        setUsers(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const removeUser = async (e, id) => {
    e.preventDefault();
    try {
      let resp = axios.post(CONFIG.REMOVE_USER_URL, {
        token: window.localStorage.token,
        id,
      });
      swal
        .fire({
          title: "Success",
          showDenyButton: false,
          confirmButtonText: `Ok`,
          text: "User removed successfully!",
        })
        .then(() => window.location.reload());
    } catch (error) {
      console.log(error.response);
      swal
        .fire({
          title: "Failure",
          showDenyButton: false,
          confirmButtonText: `Ok`,
          text: error.response.data.err,
        })
        .then(() => window.location.reload());
    }
  };
  const handleNewUser = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.post(CONFIG.ADD_USER_URL, {
        id: newUser.employeeID,
        role: newUser.role,
      });
      swal
        .fire({
          title: "Success",
          showDenyButton: false,
          confirmButtonText: `Ok`,
          text: "Employee added successfully!",
        })
        .then(() => window.location.reload());
    } catch (error) {
      console.log(error.response);
      swal.fire({
        title: "Failure",
        showDenyButton: false,
        confirmButtonText: `Ok`,
        text: error.response.data.err,
      });
    }
  };
  const assignRole = async (e, id) => {
    e.preventDefault();
    let resp = axios
      .post(
        CONFIG.CHANGE_ROLE_URL,
        {
          token: window.localStorage.token,
          id,
          role: newRole,
        },
        { headers: { authorization: `Bearer ${window.localStorage.token}` } }
      )
      .then((response) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const columns = [
    {
      name: "Employee ID",
      selector: (row) => row.userId,
    },
    {
      name: "Employee",
      selector: (row) => row.firstName + " " + row.lastName,
      sortable: true,
    },
    {
      name: "Email ID",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Current Role",
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: "Assign New Role",
      selector: (row) => (
        <div className="row m-1">
          <select
            className="form-select col"
            multiple=""
            aria-label="Default select example"
            onChange={(e) => {
              setNewRole(e.target.value);
            }}
          >
            <option value="">Pick one</option>
            {roles.map((role) => {
              return <option key={role}>{role}</option>;
            })}
          </select>
          <button
            className="btn btn-outline-primary btn-sm col-4"
            onClick={(e) => assignRole(e, row._id)}
          >
            <Icon.CheckCircleFill />
            {/* &nbsp;Update*/}
          </button>
        </div>
      ),
    },
    {
      name: "Remove User",
      selector: (row) => (
        <div className="row m-1">
          <button
            className="btn btn-outline-danger btn-sm col"
            onClick={(e) => removeUser(e, row.userId)}
          >
            <Icon.Trash3 />
          </button>
        </div>
      ),
    },
  ];

  if (searchName != "") {
    const filteredData = users.filter(
      (item) =>
        (item.firstName &&
          item.firstName.toLowerCase().includes(searchName.toLowerCase())) ||
        (item.lastName &&
          item.lastName.toLowerCase().includes(searchName.toLowerCase()))
    );
    users = filteredData;
  }
  return (
    <div>
      <Header />
      <div className="container">
        <div className="d-flex mx-auto">
          <div className="col">
            <h4 className="title-section mt-5">Assign Roles to Employees</h4>
            <div className="divider"></div>

            <div className="row w-75 mb-4">
              <Form.Control
                className="col w-100 m-2"
                style={{ borderRadius: "10px", marginInline: "100px" }}
                type="search"
                id="form1"
                placeholder="Search by the name"
                onChange={(e) => {
                  setSearchName(e.target.value);
                }}
              />{" "}
            </div>
          </div>
          <button className="btn btn-info w-25 h-50 mt-5" onClick={handleShow}>
            Add User
          </button>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form className="container" onSubmit={handleNewUser}>
              <Form.Group className="mb-3" controlId="userid">
                <Form.Label className="form-label">Employee ID:</Form.Label>
                <Form.Control
                  className="input-box"
                  required
                  type="text"
                  placeholder=" Enter QID/UID"
                  onChange={(e) => {
                    setNewUser({ ...newUser, employeeID: e.target.value });
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="accesslevel">
                <Form.Label className="form-label">Employee Role:</Form.Label>
                <Form.Select
                  className="input-box"
                  required
                  type="text"
                  placeholder=" Enter role level"
                  onChange={(e) => {
                    setNewUser({ ...newUser, role: e.target.value });
                  }}
                >
                  {roles.map((role) => {
                    return <option key={role}>{role}</option>;
                  })}
                </Form.Select>
              </Form.Group>
              <button className="btn btn-success">Add</button>
            </Form>
            </Modal.Body>
          </Modal>
        </div>
        <DataTable columns={columns} data={users} pagination />
      </div>
    </div>
  );
};

export default AssignRoles;
