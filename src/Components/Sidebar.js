import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import * as Icon from "react-bootstrap-icons";
import img from "../public/images/iqvia-logo_color.svg";
import { CONFIG } from "../config";

const Sidebar = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let role = window.localStorage.getItem("role");
  return (
    <div>
      <Button variant="" onClick={handleShow}>
        <Icon.List size={28} />
      </Button>
      <Offcanvas show={show} className="sidebar" onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title style={{ margin: "20px" }}>
            <h3>
              <img src={img} />
              &emsp; R&R
            </h3>{" "}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <NavLink to={`${CONFIG.F_DASHBOARD_URL}`} className="nav-link mb-5">
            <h5>
              <Icon.House size={20} /> &nbsp; Dashboard
            </h5>
          </NavLink>
          <NavLink to={`${CONFIG.F_CATEGORY_URL}`} className="nav-link mb-5">
            <h5>
              <Icon.UiRadiosGrid size={20} />
              &nbsp;Nomination Categories
            </h5>
          </NavLink>
          <NavLink
            to={`${CONFIG.F_NOMINEES_URL}?type=Incomplete`}
            className="nav-link mb-5"
          >
            <h5>
              <Icon.PencilSquare size={20} />
              &nbsp;Saved For Later Forms
            </h5>
          </NavLink>

          <NavLink
            to={`${CONFIG.F_MYNOMINATIONS_URL}?n=${window.localStorage.getItem(
              "email"
            )}&type=any`}
            className="nav-link mb-5"
          >
            <h5>
              <Icon.PersonVideo3 size={20} />
              &nbsp; My Nominations
            </h5>
          </NavLink>

          {role == "admin" && (
            <NavLink
              to={`${CONFIG.F_NOMINEES_URL}?type=Pending_Reviewer_Assignment`}
              className="nav-link mb-5"
            >
              <h5>
                <Icon.Clock size={20} />
                &nbsp; Assign Reviewers
              </h5>
            </NavLink>
          )}

          {(role == "reviewer" || role == "admin") && (
            <>
              <NavLink
                to={`${CONFIG.F_NOMINEES_URL}?type=Pending`}
                className="nav-link mb-5"
              >
                {" "}
                <h5>
                  <Icon.Command size={20} />
                  &nbsp;Review Nominations
                </h5>{" "}
              </NavLink>
              <NavLink
                to={`${
                  CONFIG.F_MYNOMINATIONS_URL
                }?n=${window.localStorage.getItem("email")}&type=reviewedbyme`}
                className="nav-link mb-5"
              >
                {" "}
                <h5>
                  <Icon.Check2Circle size={20} />
                  &nbsp;Nominations Reviewed By Me
                </h5>{" "}
              </NavLink>
            </>
          )}

          {(role == "approver" || role == "admin") && (
            <>
              <NavLink to={`${CONFIG.F_RANKING_URL}`} className="nav-link mb-5">
                {" "}
                <h5>
                  <Icon.HandThumbsUp size={20} />
                  &nbsp;Approve Nominations
                </h5>{" "}
              </NavLink>
              <NavLink
                to={`${CONFIG.F_NOMINEES_URL}?type=Winner`}
                className="nav-link mb-5"
              >
                <h5>
                  <Icon.Trophy size={20} />
                  &nbsp;Rewarded Nominations
                </h5>{" "}
              </NavLink>
            </>
          )}

          {role == "final approver" && (
            <>
              <NavLink
                to={`${CONFIG.F_FINALAPPROVAL_URL}`}
                className="nav-link mb-5"
              >
                <h5>
                  <Icon.Clipboard2Pulse size={20} />
                  &nbsp; Rate the Approved Candidates
                </h5>
              </NavLink>
              <NavLink
                to={`${CONFIG.F_NOMINEES_URL}?type=Winner`}
                className="nav-link mb-5"
              >
                <h5>
                  <Icon.Trophy size={20} />
                  &nbsp;Rewarded Nominations
                </h5>{" "}
              </NavLink>
            </>
          )}
          {role == "admin" && (
            <NavLink to={`${CONFIG.F_ALLNOMS_URL}`} className="nav-link mb-5">
              <h5>
                <Icon.Box size={20} />
                &nbsp; All Nominations
              </h5>
            </NavLink>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};
export default Sidebar;
