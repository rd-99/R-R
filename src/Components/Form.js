import { CONFIG, REMOTE_URL } from "../config";
import { Container, Col, Form } from "react-bootstrap";
import "../App.css";
import Axios from "axios";
import { useState, useEffect } from "react";
import swal from "sweetalert2";
import Header from "./Header";
import * as Icon from "react-bootstrap-icons";
import Footer from "./Footer";
import Authenticator from "./Authenticator";
import download from "downloadjs";
import axios from "axios";
import { sendMail } from "../utils/mailer";

function Forms() {
  let cat = window.location.href
    .split("$")[0]
    .split("=")[1]
    .replace(/%20/g, " ");
  const [nomObj, setnomObj] = useState({});
  let uuidNew = window.location.href.split("$")[1].split("=")[1];
  useEffect(() => {
    axios.post(`${CONFIG.DETAILS_URL}?n=${uuidNew}`).then((res) => {
      if (res.data.data != null) {
        setnomObj(res.data.data);
      }
    });
  }, []);

  const [select1, setSelect1] = useState("");
  const [members, setMembers] = useState("");
  const reviewersList = [];
  const [select, setSelect] = useState("");
  const [ntype, setNtype] = useState("");
  const [profile, setProfile] = useState([]);
  const [file, setfile] = useState();
  const [pfile, setpfile] = useState();
  const [imageName, setImageName] = useState([]);

  const handleDomain = (e) => {
    setSelect(e.target.value);
    setnomObj({ ...nomObj, domain: e.target.value });
  };

  const handleCategory = (e) => {
    setSelect1(e.target.value);
    setnomObj({ ...nomObj, improvementCategory: e.target.value });
  };
  const deleteimage = async (e, name) => {
    e.preventDefault();
    if (imageName.indexOf(name) > -1) {
      const result = await Axios.post(`${CONFIG.DELETE_FILES}?type=file`, {
        filename: uuidNew + "_" + name,
      });
      imageName.splice(imageName.indexOf(name), 1);
      setImageName([...imageName]);
    } else if (profile.indexOf(name) > -1) {
      const result = await Axios.post(`${CONFIG.DELETE_FILES}?type=img`, {
        filename: uuidNew + "_" + name,
      });
      profile.splice(profile.indexOf(name), 1);
      setProfile([...profile]);
    }
  };

  const handleImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("uuid", uuidNew);
    formData.append("uploaded_file", file);
    formData["uploaded_file"] = file;
    var format = /[!@#$%^&*()+\-=\[\]{};':"\\|,<>\/?]+/;
    if (format.test(formData.uploaded_file.name)) {
      swal.fire({
        title: "Failure",
        showDenyButton: false,
        confirmButtonText: `Ok`,
        text: `Special characters are not allowed`,
      });
      return;
    }
    formData["uuid"] = uuidNew;
    // console.log(formData.uploaded_file.name.replace(/_/g, ''))
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
        uuidNew,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setImageName([...imageName, result.data.filename]);
    }
  };
  const handleProfileImage = async (e) => {
    e.preventDefault();
    const formData1 = new FormData();
    formData1.append("uuid", uuidNew);
    formData1.append("uploaded_profile", pfile);
    formData1["uploaded_profile"] = pfile;
    var format = /[!@#$%^&*()+\-=\[\]{};':"\\|,<>\/?]+/;
    if (format.test(formData1.uploaded_profile.name)) {
      swal.fire({
        title: "Failure",
        showDenyButton: false,
        confirmButtonText: `Ok`,
        text: `Special characters are not allowed`,
      });

      return;
    }
    formData1["uuid"] = uuidNew;
    formData1.append("filename", formData1.uploaded_profile.name);
    if (profile.length == 1) {
      swal.fire({
        title: "Failure",
        showDenyButton: false,
        confirmButtonText: `Ok`,
        text: `Only 1 file can be uploaded `,
      });
    } else {
      const result = await Axios.post(
        `${REMOTE_URL}/changeProfile`,
        formData1,
        uuidNew,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setProfile([...profile, result.data.filename]);
    }
  };

  const domainList = ["Clinops", "DSSM", "AIML", "Other-Specify"];
  const improvementCategoryList = [
    "Adoption",
    "Automation",
    "CSAT Score",
    "DevOps",
    "Process",
    "Product KPI",
    "Technology",
    "Tool",
    "User Experience",
    "Other-Specify",
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    //add form url
    await Axios.post(
      CONFIG.BASE_URL,
      {
        ...nomObj,
        uuid: uuidNew,
        nominationCategory: cat,
        statusOfNomination: "Pending_Reviewer_Assignment",
        nominatorEmail: window.localStorage.getItem("email"),
        teamMembers: members ? members.split(",") : null,
        reviewersList,
        filesUploaded: imageName,

        profileImg: profile,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${window.localStorage.token}`,
          email: window.localStorage.getItem("email"),
          role: window.localStorage.getItem("role"),
        },
      }
    )
      .then((res) => {
        if (res.status == 200) {
          swal
            .fire({
              title: "Success",
              showDenyButton: false,
              confirmButtonText: `Ok`,
              denyButtonText: `No`,
              text: `Nomination Successfull!`,
            })
            .then(async (response) => {
              if (response.isConfirmed) {
                window.location = CONFIG.F_CATEGORY_URL;
              }
            });
          sendMail({
            mailSubject: "Nomination Created",
            toEmail: [window.localStorage.getItem("email")],
            appName: "Rewards & Recognition", //TEST APPLICATION //R&R
            messageType: "Notification", //A NEW MESSAGE
            appText:
              "Your Nomination has been created and will be reviewed by the Review Commitee", //SOME TEXT WILL COME HERE
          });
        }
      })
      .catch((err) => console.log(err));
  };
  const handleSaveLater = async (e) => {
    await Axios.post(
      CONFIG.BASE_URL,
      {
        ...nomObj,
        uuid: uuidNew,
        nominationCategory: cat,
        statusOfNomination: "Incomplete",
        nominatorEmail: window.localStorage.getItem("email"),
        teamMembers: members ? members.split(",") : null,
        reviewersList,
        filesUploaded: imageName,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${window.localStorage.token}`,
        },
      }
    )
      .then((res) => {
        if (res.status == 200) {
          swal
            .fire({
              title: "Saved",
              showDenyButton: false,
              confirmButtonText: `Ok`,
              denyButtonText: `No`,
              text: `Form Saved For Later!`,
            })
            .then(async (response) => {
              if (response.isConfirmed) {
                window.location = CONFIG.F_CATEGORY_URL;
              }
            });
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <Authenticator />
      <Header />
      <Container>
        <h4
          className="title-section"
          style={{ marginLeft: "30px", marginTop: "30px" }}
        >
          Award For {cat}
        </h4>
        <div className="divider" style={{ marginLeft: "30px" }}></div>

        <Col className="n-form col-md-8" style={{ marginLeft: "30px" }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="nomineeform mb-3" controlId="formName">
              <Form.Label className="form-label">
                Are you nominating an individual or a team?
              </Form.Label>
              <div>
                <Form.Check
                  inline
                  label="Individual"
                  required
                  value="Individual"
                  name="group1"
                  type="radio"
                  id={`inline-Individual-1`}
                  onChange={(e) => setNtype(e.target.value)}
                />
                <Form.Check
                  inline
                  label="Team"
                  required
                  value="Team"
                  name="group1"
                  type="radio"
                  id={`inline-Team-2`}
                  onChange={(e) => setNtype(e.target.value)}
                />
              </div>

              {ntype == "Individual" && (
                <Form.Group className="nomineeform mb-3" controlId="formName">
                  <Form.Label className="form-label">
                    Name of the Nominee:
                  </Form.Label>
                  <Form.Control
                    className="input-box"
                    required
                    type="text"
                    placeholder="Enter name"
                    value={nomObj.nomineeName || ""}
                    onChange={(e) => {
                      setnomObj({ ...nomObj, nomineeName: e.target.value });
                    }}
                  />
                </Form.Group>
              )}
              {ntype == "Team" && (
                <>
                  <Form.Group className="nomineeform mb-3" controlId="formName">
                    <Form.Label className="form-label">
                      Name of the Team:
                    </Form.Label>
                    <Form.Control
                      className="input-box"
                      required
                      type="text"
                      placeholder="Enter name"
                      value={nomObj.nomineeName || ""}
                      onChange={(e) => {
                        setnomObj({ ...nomObj, nomineeName: e.target.value });
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="nomineeform mb-3" controlId="formTeam">
                    <Form.Label className="form-label">
                      Team members:
                    </Form.Label>
                    <Form.Control
                      className="input-box"
                      required
                      type="text"
                      placeholder="Enter names of members each separated by a comma"
                      onChange={(e) => {
                        setMembers(e.target.value);
                      }}
                    />
                  </Form.Group>
                </>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formdomain">
              <Form.Label className="form-label">Domain:</Form.Label>
              <Form.Select
                className="input-box"
                aria-label="Default select example"
                value={nomObj.domain || select}
                onChange={handleDomain}
              >
                <option value="">Select One</option>
                {domainList.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Form.Select>
              {select === "Other-Specify" && (
                <Form.Control
                  type="text"
                  placeholder="Specify the domain"
                  className="other-input mt-3"
                  onChange={(e) => {
                    setnomObj({ ...nomObj, domain: e.target.value });
                  }}
                />
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formdescription">
              <Form.Label className="form-label">Description:</Form.Label>
              <Form.Control
                as="textarea"
                className="input-box"
                required
                value={nomObj.description || ""}
                type="text"
                placeholder=" Enter description"
                style={{ height: "10vh" }}
                onChange={(e) => {
                  setnomObj({ ...nomObj, description: e.target.value });
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formImp">
              <Form.Label className="form-label">
                Improvement Category:
              </Form.Label>
              <Form.Select
                className="input-box"
                aria-label="Default select example"
                value={nomObj.improvementCategory || select1}
                onChange={handleCategory}
              >
                <option value="">Select One</option>
                {improvementCategoryList.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Form.Select>
              {select1 === "Other-Specify" && (
                <Form.Control
                  className="input-box mt-3"
                  type="text"
                  placeholder="Specify the category" //value={nomObj.improvementCategory || ''}
                  onChange={(e) => {
                    setnomObj({
                      ...nomObj,
                      improvementCategory: e.target.value,
                    });
                  }}
                />
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBenefits">
              {cat.split("-")[0] == "Employee Recognition" ? (
                <>
                  <div className="mb-2">Benefits(in $):</div>
                  <Form.Control
                    className="input-box"
                    value={nomObj.benefits || ""}
                    type="number"
                    placeholder=" Enter amount"
                    onChange={(e) => {
                      setnomObj({ ...nomObj, benefits: e.target.value });
                    }}
                  />
                </>
              ) : (
                <>
                  <Form.Label className="form-label">
                    Benefits(in $):
                  </Form.Label>
                  <Form.Control
                    className="input-box"
                    value={nomObj.benefits || ""}
                    type="number"
                    placeholder=" Enter amount"
                    onChange={(e) => {
                      setnomObj({ ...nomObj, benefits: e.target.value });
                    }}
                  />
                </>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formImp">
              <Form.Label className="form-label">
                Improvement Justification/Benefit Calculation:
              </Form.Label>
              <Form.Control
                as="textarea"
                className="input-box"
                value={nomObj.justification || ""}
                required
                type="text"
                placeholder="Give proper justification"
                style={{ height: "10vh" }}
                onChange={(e) => {
                  setnomObj({ ...nomObj, justification: e.target.value });
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formCmp">
              <Form.Label className="form-label">
                Complexity Involved:
              </Form.Label>
              <Form.Control
                className="input-box"
                value={nomObj.complexity || ""}
                required
                type="text"
                placeholder="Enter the complexities "
                onChange={(e) => {
                  setnomObj({ ...nomObj, complexity: e.target.value });
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDocs">
              <Form.Label className="form-label">
                Related Artifacts [Maximum number of files=3, Maximum file size
                per file=10MB] :
              </Form.Label>
              <input
                required
                className="form-control"
                filename={file}
                onChange={(e) => setfile(e.target.files[0])}
                type="file"
                // accept="image/*"
              ></input>
              <button
                className="btn btn-outline-info "
                type="submit"
                onClick={handleImage}
              >
                Upload
              </button>
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
                              `${CONFIG.VIEW_FILES}?name=${
                                uuidNew + "_" + item
                              }`
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
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDocs">
              <div className="mb-2">Upload Profile Image :</div>
              <input
                className="form-control"
                filename={pfile}
                onChange={(e) => setpfile(e.target.files[0])}
                type="file"
              ></input>
              <button
                className="btn btn-outline-info "
                type="submit"
                onClick={handleProfileImage}
              >
                Upload
              </button>
              <table className="table table-responsive table-bordered">
                <tbody>
                  {profile.map((item) => (
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
                              `${CONFIG.VIEW_FILES}?image=${
                                uuidNew + "_" + item
                              }`
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
            </Form.Group>

            <Form.Group className="mb-3" controlId="formName">
              <Form.Label className="form-label">Your name :</Form.Label>
              <Form.Control
                className="input-box"
                required
                type="text"
                placeholder="Enter your name"
                value={nomObj.nominatorName || ""}
                onChange={(e) =>
                  setnomObj({ ...nomObj, nominatorName: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formName">
              <Form.Label className="form-label">Your email :</Form.Label>
              <Form.Control
                className="input-box"
                type="text"
                disabled={true}
                placeholder={window.localStorage.getItem("email")}
              />
            </Form.Group>
            <button className="btn btn-outline-primary" type="submit">
              <Icon.CheckCircleFill />
              &nbsp; Submit
            </button>
            <button
              className="btn btn-outline-warning"
              onClick={handleSaveLater}
            >
              <Icon.PencilSquare />
              &nbsp; Save for Later
            </button>
          </Form>
        </Col>
      </Container>
      <Footer />
    </>
  );
}

export default Forms;
