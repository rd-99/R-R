import * as Icon from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";
import React from "react";
import { CONFIG } from "../../config";
const QuickLinks = () => {
  const email = window.localStorage.getItem("email");
  const role = window.localStorage.getItem("role");
  return (
    <div className="col-lg-3 col-md-3 col-sm-3">
      <h5 className="title-section">Quick Links</h5>
      <div className="divider"></div>
      <ul className="list-group" style={{ listStyle: "none" }}>
        <li>
          <NavLink
            to={`${CONFIG.F_CATEGORY_URL}`}
            className="p-1 mb-2 text-secondary"
          >
            <h5>
              <Icon.UiRadiosGrid size={20} />
              &nbsp; Nomination Categories
            </h5>
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`${CONFIG.F_MYNOMINATIONS_URL}?n=${email}&type=any`}
            className="p-1 mb-2 text-secondary"
          >
            <h5>
              <Icon.PersonVideo3 size={20} />
              &nbsp; My Nominations
            </h5>
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`${CONFIG.F_NOMINEES_URL}?type=Incomplete`}
            className="p-1 mb-2 text-secondary"
          >
            <h5>
              <Icon.PencilSquare size={20} />
              &nbsp; Saved For Later Forms
            </h5>
          </NavLink>
        </li>

        {role == "admin" && (
          <li>
            <NavLink
              to={`${CONFIG.F_NOMINEES_URL}?type=Pending_Reviewer_Assignment`}
              className="p-1 mb-2 text-secondary"
            >
              <h5>
                <Icon.Clock size={20} />
                &nbsp; Assign Reviewers
              </h5>
            </NavLink>
          </li>
        )}

        {(role == "reviewer" || role == "admin") && (
          <>
            <li>
              <NavLink
                to={`${CONFIG.F_NOMINEES_URL}?type=Pending`}
                className="p-1 mb-2 text-secondary"
              >
                <h5>
                  <Icon.Command size={20} />
                  &nbsp; Review Nominations
                </h5>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`${CONFIG.F_MYNOMINATIONS_URL}?n=${email}&type=reviewedbyme`}
                className="p-1 mb-2 text-secondary"
              >
                <h5>
                  <Icon.Check2Circle size={20} />
                  &nbsp; Nominations Reviewed By Me
                </h5>
              </NavLink>
            </li>
          </>
        )}

        {(role == "approver" || role == "admin") && (
          <>
            <li>
              <NavLink
                to={`${CONFIG.F_RANKING_URL}`}
                className="p-1 mb-2 text-secondary"
              >
                <h5>
                  <Icon.HandThumbsUp size={20} />
                  &nbsp; Approve Nominations
                </h5>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`${CONFIG.F_NOMINEES_URL}?type=Winner`}
                className="p-1 mb-2 text-secondary"
              >
                <h5>
                  <Icon.Trophy size={20} />
                  &nbsp; Rewarded Nominations
                </h5>
              </NavLink>
            </li>
          </>
        )}

        {role == "final approver" && (
          <>
            <li>
              <NavLink
                to={`${CONFIG.F_FINALAPPROVAL_URL}`}
                className="p-1 mb-2 text-secondary"
              >
                <h5>
                  <Icon.Clipboard2Pulse size={20} />
                  &nbsp; Rate the Approved Candidates
                </h5>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`${CONFIG.F_NOMINEES_URL}?type=Winner`}
                className="p-1 mb-2 text-secondary"
              >
                <h5>
                  <Icon.Trophy size={20} />
                  &nbsp;Rewarded Nominations
                </h5>{" "}
              </NavLink>
            </li>
          </>
        )}
        {role == "admin" && (
          <li>
            <NavLink
              to={`${CONFIG.F_ALLNOMS_URL}`}
              className="p-1 mb-2 text-secondary"
            >
              <h5>
                <Icon.Box size={20} />
                &nbsp; All Nominations
              </h5>
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  );
};

export default QuickLinks;
