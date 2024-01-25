import * as Icon from "react-bootstrap-icons";
import download from "downloadjs";
import React, { useState, useEffect, useMemo, useReducer } from "react";
import { CONFIG } from "../config";
import Axios from "axios";
import swal from "sweetalert2";
import formReducer from "../utils/formReducer";
import { CardCategories } from "./Cards/CardCategories";
import { sendMail } from "../utils/mailer";

const DetailsTemplate = ({ obj }) => {
  const uuid = obj?.uuid;
  const [imageName, setImageName] = useState([]);
  const [file, setfile] = useState();
  const status = obj?.statusOfNomination;

  const deleteimage = async (e, name) => {
    e.preventDefault();
    if (imageName.indexOf(name) > -1) {
      const result = await Axios.post(`${CONFIG.DELETE_FILES}?type=file`, {
        filename: uuid + "_" + name,
      });
      imageName.splice(imageName.indexOf(name), 1);
      setImageName([...imageName]);
    }
  };
  const handleImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("uuid", uuid);
    formData.append("uploaded_file", file);
    formData["uploaded_file"] = file;
    var format = /[!@#$%^&*()+\-=\[\]{};':"\\|,<>\/?]+/;
    if (format.test(formData.uploaded_file.name)) {
      swal.fire({
        title: "Failure",
        showDenyButton: false,
        confirmButtonText: `Ok`,
        text: `Special characters are not allowed in file name`,
      });
      return;
    }
    formData["uuid"] = uuid;
    formData.append("filename", formData.uploaded_file.name);
    if (imageName.indexOf(formData.uploaded_file.name) > -1) {
      swal.fire({
        title: "Failure",
        showDenyButton: false,
        confirmButtonText: `Ok`,
        text: `File already uploaded `,
      });
    } else if (imageName.length == 3) {
      swal.fire({
        title: "Failure",
        showDenyButton: false,
        confirmButtonText: `Ok`,
        text: `Maximum 3 files can be uploaded `,
      });
    } else {
      const result = await Axios.post(
        `${CONFIG.UPLOAD_FILES}`,
        formData,
        uuid,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(result.data.filename);
      setImageName([...imageName, result.data.filename]);
    }
  };

  const NotAdmin = () => {
    const submitAdditionalInfo = async () => {
      let reviewersAskingInfo = [];

      obj?.moreDetails.map(
        (rev) =>
          !reviewersAskingInfo.includes(rev?.reviewer?.email) &&
          reviewersAskingInfo.push(rev?.reviewer?.email)
      );
      console.log(reviewersAskingInfo);
      const afterInfoProcess = () => {
          sendMail({
            mailSubject: 'Additional Info updated',
            toEmail: reviewersAskingInfo , //'ruturaj.dhakane@iqvia.com',
            appName: "Rewards & Recognition", //TEST APPLICATION //R&R
            messageType: 'Notification', //A NEW MESSAGE
            appText: `The additional information requested for the nomination of ${obj?.nomineeName} has been updated by the nominator. Please go to R&R website to review it. Thank you!`, //SOME TEXT WILL COME HERE
        })
        window.location.reload();
      };
      const updateFileName = await Axios.post(`${CONFIG.UPDATE_FILE_NAME}`, {
        uuid,
        imageName,
      }).then((res) => {
        console.log("res = ", res);
        swal
          .fire({
            title: "Success",
            showDenyButton: false,
            confirmButtonText: `Ok`,
            text: `File uploaded! `,
          })
          .then(() => window.location.reload());
      });
    };
    return (
      <>
        {obj?.moreDetails && (
          <div className="row">
            <div className="col-6 col-md-4 text-muted">
              Additional Info Requested:{" "}
            </div>
            <div className="col-md-8">
              {(obj?.moreDetails).map(
                (item) =>
                  item?.reviewer && (
                    <h6>Reviewer : {item?.reviewer.comments}</h6>
                  )
              )}
            </div>
            <hr />
          </div>
        )}
        {window.localStorage.email == obj?.nominatorEmail &&
          (status == "Pending" || status == "Pending_Reviewer_Assignment") && (
            <div className="row">
              <div className="col-6 col-md-4 text-muted">
                Upload requested file(s):{" "}
              </div>
              <div className="col  col-md-8 ">
                <input
                  className="form-control mb-2"
                  filename={file}
                  onChange={(e) => setfile(e.target.files[0])}
                  type="file"
                ></input>
                <button
                  className="btn btn-outline-info btn-sm "
                  onClick={(e) => handleImage(e)}
                >
                  Upload
                </button>
              </div>
              <table className="table table-responsive table-bordered">
                <tbody>
                  {imageName.map((item) => (
                    <tr key={item}>
                      <td>
                        <div className="mt-3">{item}</div>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={async () => {
                            const res = await fetch(
                              `${CONFIG.VIEW_FILES}?name=${uuid + "_" + item}`
                            );
                            const blob = await res.blob();
                            download(blob, item);
                          }}
                        >
                          <Icon.Download />
                          &nbsp; Download file
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => deleteimage(e, item)}
                        >
                          <Icon.Trash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                className="btn btn-primary"
                onClick={submitAdditionalInfo}
              >
                Submit
              </button>
              <hr />
            </div>
          )}

        <div className="row">
          <div className="col-6 col-md-4 text-muted">Nomination name: </div>
          <div className="col-md-8">
            <h6>{obj?.nomineeName || "-"} </h6>
          </div>
          <hr />
        </div>

        {obj?.teamMembers && (
          <div className="row">
            <div className="col-6 col-md-4 text-muted">Team Members:</div>
            <div className="col-md-8">
              {obj?.teamMembers.map((member) => (
                <h6 key={member}>{member}</h6>
              ))}
            </div>
            <hr />
          </div>
        )}

        <div className="row">
          <div className="col-6 col-md-4 text-muted">Nomination ID: </div>
          <div className="col-md-8">
            <h6>{obj?.uuid || "-"} </h6>
          </div>
          <hr />
        </div>

        {status && (
          <div className="row">
            <div className="col-6 col-md-4 text-muted">Status: </div>
            <div className="col-md-8">
              <h6>{status.replace(/_/g, " ") || "-"} </h6>
            </div>
            <hr />
          </div>
        )}

        <div className="row">
          <div className="col-6 col-md-4 text-muted">Nomination category:</div>
          <div className="col-md-8">
            <h6>{obj?.nominationCategory || "-"}</h6>
          </div>
          <hr />
        </div>

        <div className="row">
          <div className="col-6 col-md-4 text-muted">Description: </div>
          <div className="col-md-8">
            <h6>{obj?.description || "-"}</h6>
          </div>
          <hr />
        </div>

        {status != "Reviewed" && (
          <div className="row">
            <div className="col-6 col-md-4 text-muted">Domain: </div>
            <div className="col-md-8">
              <h6>{obj?.domain || "-"}</h6>
            </div>
            <hr />
          </div>
        )}
        <div className="row">
          <div className="col-6 col-md-4 text-muted">
            Improvement category:{" "}
          </div>
          <div className="col-md-8">
            <h6>{obj?.improvementCategory || "-"}</h6>
          </div>
          <hr />
        </div>
        <div className="row">
          <div className="col-6 col-md-4 text-muted">Benefits: </div>
          <div className="col-md-8">
            <h6>{obj?.benefits || "-"}</h6>
          </div>
          <hr />
        </div>
        <div className="row">
          <div className="col-6 col-md-4 text-muted">
            Improvement Justification:
          </div>
          <div className="col-md-8">
            <h6>{obj?.justification || "-"}</h6>
          </div>
          <hr />
        </div>
        <div className="row">
          <div className="col-6 col-md-4 text-muted">Complexity:</div>
          <div className="col-md-8">
            <h6>{obj?.complexity || "-"}</h6>
          </div>
          <hr />
        </div>
        <div className="row">
          <div className="col-6 col-md-4 text-muted">Nominator name:</div>
          <div className="col-md-8">
            <h6>{obj?.nominatorName || "-"}</h6>
          </div>
          <hr />
        </div>

        <div className="row">
          <div className="col-6 col-md-4 text-muted">Nomination Date:</div>
          <div className="col-md-8">
            <h6>{new Date(obj?.createdOn).toDateString()}</h6>
          </div>
          <hr />
        </div>
        <div className="row">
          <div className="col-6 col-md-4 text-muted">Files Uploaded:</div>
          <div className="col-md-8">
            <table className="table table-responsive table-bordered">
              <tbody>
                {obj?.filesUploaded
                  ? obj?.filesUploaded.map((file) => (
                      <tr key={file}>
                        <td>
                          <div className="m-2">{file}</div>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={async () => {
                              const res = await fetch(
                                `${CONFIG.VIEW_FILES}?name=${
                                  obj?.uuid + "_" + file
                                }`
                              );
                              const blob = await res.blob();
                              download(blob, file);
                            }}
                          >
                            <Icon.Download />
                            &nbsp;View file
                          </button>
                        </td>
                      </tr>
                    ))
                  : "-"}
              </tbody>
            </table>
          </div>
          <hr />
        </div>
        <div className="row">
          <div className="col-6 col-md-4 text-muted">Reviewers assigned: </div>
          <div className="col-md-8">
            {obj?.reviewersList ? (
              obj?.reviewersList.map((rev) => <h6 key={rev}>{rev}</h6>)
            ) : (
              <h6>Reviewers not assigned</h6>
            )}
          </div>{" "}
          <hr />
        </div>
        {obj.statusOfNomination == "Pending" && (
          <div className="row">
            <div className="col-6 col-md-4 text-muted">Reviewed By: </div>
            <div className="col-md-8">
              {obj?.reviewerScores ? (
                Object.keys(obj?.reviewerScores).map((rev) => (
                  <h6 key={rev}>{rev.replace(/_/g, ".")}</h6>
                ))
              ) : (
                <h6>No one</h6>
              )}
            </div>{" "}
            <hr />
          </div>
        )}
        {(status == "Reviewed" ||
          status == "Approved" ||
          status == "Winner") && (
          <>
            <div className="row">
              <div className="col-6 col-md-4 text-muted">
                Average review score (out of 5):{" "}
              </div>
              <div className="col-md-8">
                <h6>{obj?.finalScore}</h6>
              </div>
              <hr />
            </div>
            {status == "Reviewed" && (
              <div className="row">
                <div className="col-6 col-md-4 text-muted">Approved By: </div>
                <div className="col-md-8">
                  {obj?.approverScores ? (
                    Object.keys(obj?.approverScores).map((rev) => (
                      <h6 key={rev}>{rev.replace(/_/g, ".")}</h6>
                    ))
                  ) : (
                    <h6>No one</h6>
                  )}
                </div>{" "}
                <hr />
              </div>
            )}
            {(status == "Approved" || status == "Winner") && (
              <div className="row">
                <div className="col-6 col-md-4 text-muted">
                  Average final score (out of 5):{" "}
                </div>
                <div className="col-md-8">
                  <h6>{obj?.finalApproverScore}</h6>
                </div>
                <hr />
              </div>
            )}
          </>
        )}
      </>
    );
  };
  const IsAdmin = () => {
    const AdminChanges = async (e) => {
      e.preventDefault();
      await Axios.post(`${CONFIG.UPDATE_NOMINATION_URL}`, {
        uuid: `${obj?.uuid}`,
        admin_change: true,
        change: formState,
        email: window.localStorage.getItem("email"),
        token: window.localStorage.getItem("token"),
      }).then(() => {
        window.location.reload();
      });
    };

    const [detailsComment, setDetailsComment] = useState("");
    const handleAskforMoreDetails = async (e) => {
      e.preventDefault();
      let additionalDetails = await Axios.post(
        `${CONFIG.UPLOAD_MORE_DETAILS}`,
        {
          uuid: `${obj?.uuid}`,
          comments: detailsComment || "More Info Needed",
          email: window.localStorage.email,
        }
      )
        .then((res) => {
          swal.fire({
            title: "Success",
            showDenyButton: false,
            confirmButtonText: `Ok`,
            denyButtonText: `No`,
            text: `Request Sent!`,
          });
          sendMail({
            mailSubject: "Please submit more Details for your nomination",
            toEmail: [obj?.nominatorEmail],
            appName: "R&R",
            messageType: "Upload relevant Files",
            appText: `The information submitted for Nomination of- ${obj?.nomineeName} - has been deemed insufficient. Please visit the app and add the requested data in the form of PDF (preferably SINGLE file only) in 'My Nominations' page.`,
          });
        })
        .catch((err) => console.log(err));
    };

    const initialState = {
      nomineeName: obj?.nomineeName,
      teamMembers: obj?.teamMembers,
      nominationCategory: obj?.nominationCategory,
      description: obj?.description,
      domain: obj?.domain,
      improvementCategory: obj?.improvementCategory,
      complexity: obj?.complexity,
      benefits: obj?.benefits,
      justification: obj?.justification,
    };
    const [formState, dispatch] = useReducer(formReducer, initialState);
    const handleTextChange = (e) => {
      dispatch({
        type: "HANDLE_INPUT_TEXT",
        field: e.target.name,
        payload: e.target.value,
      });
    };
    const categorylist = [];
    CardCategories.map((cat) => categorylist.push(cat.title));
    return (
      <>
        <button
          className="btn btn-outline-primary rounded-pill"
          onClick={AdminChanges}
        >
          Update Changes
        </button>
        <div className="row mt-2">
          <div className="col-6 col-md-4 text-muted">Nomination ID: </div>
          <div className="col-md-8">
            <h6>{obj?.uuid || "-"} </h6>
          </div>
          <hr />
        </div>

        {status && (
          <div className="row">
            <div className="col-6 col-md-4 text-muted">Status: </div>
            <div className="col-md-8">
              <h6>{status.replace(/_/g, " ") || "-"} </h6>
            </div>
            <hr />
          </div>
        )}

        <div className="row">
          <div className="col-6 col-md-4 text-muted">Nomination name:</div>
          <input
            name="nomineeName"
            onChange={(e) => handleTextChange(e)}
            value={formState?.nomineeName}
            className="form-control w-50 mb-2 col-md-8"
          />
          <hr />
        </div>

        {obj?.teamMembers && (
          <div className="row">
            <div className="col-6 col-md-4 text-muted">Team Members:</div>
            <input
              name="teamMembers"
              className="form-control w-50 mb-2 col-md-8"
              onChange={(e) => handleTextChange(e)}
              value={formState?.teamMembers}
            />
            <hr />
          </div>
        )}

        <div className="row">
          <div className="col-6 col-md-4 text-muted">Nomination category:</div>
          <select
            className="form-control w-50 mb-2 col-md-8"
            aria-label="Default select example"
            name="nominationCategory"
            onChange={(e) => handleTextChange(e)}
            value={formState?.nominationCategory}
          >
            <option value="">Select one</option>
            {categorylist.map((cat) => {
              return <option key={cat}>{cat}</option>;
            })}
          </select>
          <hr />
        </div>

        <div className="row">
          <div className="col-6 col-md-4 text-muted">Description: </div>
          <textarea
            style={{ borderRadius: "5px", height: "15vh", width: "48vh" }}
            name="description"
            className="form-control w-50 mb-2 form-control"
            onChange={(e) => handleTextChange(e)}
            value={formState?.description}
          />
          <hr />
        </div>
        <div className="row">
          <div className="col-6 col-md-4 text-muted">Improvement category:</div>
          <input
            name="improvementCategory"
            className="form-control w-50 mb-2 col-md-8"
            onChange={(e) => handleTextChange(e)}
            value={formState?.improvementCategory}
          />
          <hr />
        </div>
        <div className="row">
          <div className="col-6 col-md-4 text-muted">Benefits: </div>
          <input
            name="benefits"
            className="form-control w-50 mb-2 col-md-8"
            onChange={(e) => handleTextChange(e)}
            value={formState?.benefits}
          />
          <hr />
        </div>

        <div className="row">
          <div className="col-6 col-md-4 text-muted">
            Improvement Justification:
          </div>
          <textarea
            style={{ borderRadius: "5px", height: "15vh", width: "48vh" }}
            name="justification"
            className="form-control w-50 mb-2 col-md-8"
            onChange={(e) => handleTextChange(e)}
            value={formState?.justification}
          />
          <hr />
        </div>
        <div className="row">
          <div className="col-6 col-md-4 text-muted">Complexity:</div>
          <input
            className="form-control w-50 mb-2 col-md-8"
            name="complexity"
            onChange={(e) => handleTextChange(e)}
            value={formState?.complexity}
          />
          <hr />
        </div>
        <div className="row">
          <div className="col-6 col-md-4 text-muted">Nominator name:</div>
          <div className="col-md-8">
            <h6>{obj?.nominatorName || "-"}</h6>
          </div>
          <hr />
        </div>

        <div className="row">
          <div className="col-6 col-md-4 text-muted">Nomination Date:</div>
          <div className="col-md-8">
            <h6>{new Date(obj?.createdOn).toDateString()}</h6>
          </div>
          <hr />
        </div>
        <div className="row">
          <div className="col-6 col-md-4 text-muted">Files Uploaded:</div>
          <div className="col-md-8">
            <table className="table table-responsive table-bordered">
              <tbody>
                {obj?.filesUploaded
                  ? obj?.filesUploaded.map((file) => (
                      <tr key={file}>
                        <td>
                          <div className="m-2">{file}</div>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={async () => {
                              const res = await fetch(
                                `${CONFIG.VIEW_FILES}?name=${
                                  obj?.uuid + "_" + file
                                }`
                              );
                              const blob = await res.blob();
                              download(blob, file);
                            }}
                          >
                            <Icon.Download /> &nbsp;View file
                          </button>
                        </td>
                      </tr>
                    ))
                  : "-"}
              </tbody>
            </table>
          </div>
          <hr />
        </div>
        <div className="row">
          <div className="col-6 col-md-4 text-muted">Reviewers assigned:</div>
          <div className="col-md-8">
            {obj?.reviewersList ? (
              obj?.reviewersList.map((rev) => <h6 key={rev}>{rev}</h6>)
            ) : (
              <h6>Reviewers not assigned</h6>
            )}
          </div>
          <hr />
        </div>

        {obj?.moreDetails && (
          <div className="row">
            <div className="col-6 col-md-4 text-muted">
              {" "}
              Additional Info Requested:{" "}
            </div>
            <div className="col-md-8">
              {(obj?.moreDetails).map((i) =>
                i.reviewer ? (
                  <h6> Details required : {i.reviewer.comments}</h6>
                ) : (
                  { i }
                )
              )}
            </div>
            <hr />
          </div>
        )}
        {window.localStorage.getItem("email") == obj?.nominatorEmail &&
          status == "Pending" && (
            <div className="row">
              <div className="col-6 col-md-4 text-muted">
                Upload requested file(s):
              </div>
              <div className="col  col-md-8 ">
                <input
                  className="form-control mb-2"
                  filename={file}
                  onChange={(e) => setfile(e.target.files[0])}
                  type="file"
                ></input>
                {/* <textarea rows="3" cols="90" className='form-control' onChange={newComments} placeholder="Additional info" />*/}
                <button
                  className="btn btn-outline-info btn-sm "
                  type="submit"
                  onClick={(e) => handleImage(e)}
                >
                  Upload{" "}
                </button>
              </div>
              <table className="table table-responsive table-bordered">
                <tbody>
                  {imageName.map((item) => (
                    <tr key={item}>
                      <td>
                        {" "}
                        <div className="mt-3">{item}</div>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={async () => {
                            const res = await fetch(
                              `${CONFIG.VIEW_FILES}?name=${uuid + "_" + item}`
                            );
                            const blob = await res.blob();
                            download(blob, item);
                          }}
                        >
                          <Icon.Download /> &nbsp; Download file
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => deleteimage(e, item)}
                        >
                          <Icon.Trash /> Delete{" "}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <hr />
            </div>
          )}

        {status == "Pending_Reviewer_Assignment" && (
          <div className="row">
            <div className="col-6 col-md-4 text-muted">
              Ask for more details:
            </div>
            <textarea
              placeholder="Enter your comments "
              rows="3"
              cols="90"
              className="form-control w-50 mb-2 col-md-8"
              style={{ borderRadius: "5px", height: "90px" }}
              onChange={(e) => setDetailsComment(e.target.value || "N/A")}
            />
            <button
              className="btn btn-outline-primary rounded-pill"
              onClick={handleAskforMoreDetails}
            >
              {" "}
              Ask for more details
            </button>
            <hr />
          </div>
        )}
      </>
    );
  };

  return (
    <>
      {window.localStorage.getItem("role") == "admin" &&
      status == "Pending_Reviewer_Assignment" ? (
        <IsAdmin />
      ) : (
        <NotAdmin />
      )}
    </>
  );
};

export default React.memo(DetailsTemplate, () => {
  return true;
});
