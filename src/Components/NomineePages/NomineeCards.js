import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { CONFIG } from "../../config";
import Header from "../Header";
import "../../public/styles/Card.css";
import swal from "sweetalert2";
import { Col, Row, Container, Form, Modal } from "react-bootstrap";
import image1 from "../../public/images/useravatar";
import img1 from "../../public/images/undraw_taken_re_yn20.svg";
import { CardCategories } from "../Cards/CardCategories";
import { NavLink } from "react-router-dom";

function Items({ currentItems }) {
  return (
    <Row xs={1} md={4} className="g-4">
      {currentItems &&
        currentItems.map((item) => (
          <div key={item.uuid} className="card" style={{ width: "18rem" }}>
            <div className="text-center">
              {item.profileImg ? (
                <img
                  className="card-img-top mt-4 mb-2"
                  src={`${CONFIG.VIEW_FILES}?display_img=${item?.uuid}_${item?.profileImg[0]}`}
                  style={{ width: "100px", height: "100px" }}
                  alt="Nomination Picture"
                />
              ) : (
                <img
                  className="card-img-top mt-4 mb-2"
                  src={image1}
                  style={{ width: "100px", height: "100px" }}
                />
              )}
              <hr />
            </div>
            <div className="card-body text-center ">
              <h4 className="card-title mb-2">{item.nomineeName}</h4>
              <h6 className="text-muted">Nominated under:</h6>
              <p>{item.nominationCategory} </p>
              {item.statusOfNomination == "Winner" && (
                <h6 className="text-warning">
                  Rating by Nivedita: {item.finalRating}/5
                </h6>
              )}
              {item.statusOfNomination == "Pending" &&
                (item.sendBackCount && item.sendBackCount == 1 ? (
                  <b className="badge bg-warning" style={{ fontSize: "small" }}>
                    Waiting for Additional Info
                  </b>
                ) : (
                  <p></p>
                ))}

              {item.statusOfNomination == "Incomplete" ? (
                <NavLink
                  to={`${CONFIG.F_FORM_URL}?cat=${item.nominationCategory}$u=${item.uuid}`}
                >
                  Complete the form{" "}
                </NavLink>
              ) : (
                <p>
                  <NavLink to={`${CONFIG.F_DETAILS_URL}?n=${item.uuid || ""}`}>
                    View More
                  </NavLink>
                </p>
              )}
            </div>
          </div>
        ))}
    </Row>
  );
}

const NomineeCards = () => {
  const [nominees, setNominees] = useState([]);
  var [searchDate, setSearchDate] = useState("");
  var [searchCategory, setsearchCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    getNominee();
  }, []);

  const handleWinners = async () => {
    console.log("hey");
    let response = await axios
      .post(CONFIG.UPDATE_WINNERS_URL)
      .then((response) => {
        console.log(response.data.data);
        swal
          .fire({
            title: "Success",
            showDenyButton: false,
            confirmButtonText: `Ok`,
            text: "Wall of Fame Updated!",
          })
          .then(() => (window.location.href = CONFIG.F_DASHBOARD_URL));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getNominee = async () => {
    let response = await axios
      .post(
        `${CONFIG.NOMINEES_URL}?type=${window.location.href.split("?")[1].split("=")[1]
        }`,
        {
          token: window.localStorage.token,
          reqType: window.location.href.split("?")[1].split("=")[1],
          nominatorEmail: window.localStorage.getItem("email"),
          role: window.localStorage.getItem("role"),
        },
        {
          headers: {
            authorization: `Bearer ${window.localStorage.token}`,
            email: window.localStorage.getItem("email"),
          },
        }
      )
      .then((response) => {
        setNominees(response.data.data);
        setIsLoading(false);
        let fetchnom = response.data.data;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  var data = nominees;
  if (searchCategory != "") {
    const filteredData = data.filter(
      (item) =>
        item.nominationCategory &&
        item.nominationCategory
          .toLowerCase()
          .includes(searchCategory.toLowerCase())
    );
    data = filteredData;
  }
  if (searchDate != "") {
    const dateRange = [
      {
        name: "Q1",
        startDate: new Date(
          `${new Date(Date.now()).getFullYear()}-01-01`
        ).toISOString(),
        endDate: new Date(
          `${new Date(Date.now()).getFullYear()}-03-31`
        ).toISOString(),
      },
      {
        name: "Q2",
        startDate: new Date(
          `${new Date(Date.now()).getFullYear()}-04-01`
        ).toISOString(),
        endDate: new Date(
          `${new Date(Date.now()).getFullYear()}-07-02`
        ).toISOString(),
      },
      {
        name: "Q3",
        startDate: new Date(
          `${new Date(Date.now()).getFullYear()}-07-03`
        ).toISOString(),
        endDate: new Date(
          `${new Date(Date.now()).getFullYear()}-09-30`
        ).toISOString(),
      },
      {
        name: "Q4",
        startDate: new Date(
          `${new Date(Date.now()).getFullYear()}-10-01`
        ).toISOString(),
        endDate: new Date(
          `${new Date(Date.now()).getFullYear()}-12-31`
        ).toISOString(),
      },
    ];
    var reqRange = dateRange.find((quarter) => quarter.name == searchDate);
    reqRange
      ? (data = data.filter(
        (item) =>
          item.createdOn >= reqRange.startDate &&
          item.createdOn < reqRange.endDate
      ))
      : data;
  }

  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;
  const status = window.location.href.split("?")[1].split("=")[1];
  const currentItems = data.slice(itemOffset, itemOffset + itemsPerPage);
  const pageCount = Math.ceil(nominees.length / itemsPerPage);
  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % nominees.length;
    setItemOffset(newOffset);
  };
  const sendAllNominationsForApproval = (e) => {
    e.preventDefault()
    data.forEach(async (nomination) => {
      try {
        var qWiseScores = [];
        var avgQScore = 0;
        var avgFinalScore = 0;
        let nomCategoryquestions = CardCategories.find(cat => cat.title == nomination.nominationCategory)
        let qLength = Object.keys(nomCategoryquestions.reviewQuestions).length
        for (var i = 0; i < qLength; i++) {
          var temp = 0;
          nomination.reviewerScores && Object.keys(nomination.reviewerScores).map((rev) => {
            temp += Number(nomination.reviewerScores?.[rev][i + 1])
          });

          qWiseScores.push(
            nomination.reviewerScores ? Math.round((temp * 10) / Object.keys(nomination.reviewerScores).length) / 10 : 0
          );
        }
        //calculate overall avg score of noms
        for (var i = 0; i < qWiseScores.length; i++) {
          avgQScore += qWiseScores[i];
        }
        avgFinalScore += avgQScore / qWiseScores.length;
        avgFinalScore = Math.round(avgFinalScore * 100) / 100
        // send all nom to db
        let resp = await axios.post(CONFIG.SEND_NOMS_FOR_APPROVAL, {
          uuid: nomination.uuid,
          qWiseScores: qWiseScores,
          finalScore: avgFinalScore,

        }).then(() => {
          if (data.indexOf(nomination) == data.length - 1) {
            swal
              .fire({
                title: "Success",
                showDenyButton: false,
                confirmButtonText: `Ok`,
                text: "Nominations Updated!",
              }).then(window.location.href = `${CONFIG.F_NOMINEES_URL}?type=Pending`)
          }
        }
        )
      }
      catch (e) {
        console.log("error=", e);
      }
    })
  }


  return (
    <div>
      <Header />
      <Container style={{ marginBlock: "50px" }}>
        <Col mb={5}>
          {/* page titles */}
          <div>
            {" "}
            {
              status == "Pending" && (
                <div className="row">
                  <div className="col">
                    <h4 className="title-section col">Review Nominations</h4>
                    <div className="divider"></div>
                  </div>
                  {window.localStorage.getItem("role") == 'admin' &&

                    <><button
                      className="btn btn-primary col col-2 h-75"
                      onClick={handleShow}
                    >
                      Send all Nominations for Approval
                    </button><Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                          <Modal.Title>Confirm</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          Are you sure you want to send all nominations for next level?
                        </Modal.Body>
                        <Modal.Footer>
                          <button className="btn-success" onClick={sendAllNominationsForApproval}>
                            Yes
                          </button>
                        </Modal.Footer>
                      </Modal></>}
                </div>
              )
              // <><h4 className="title-section">Review Nominations</h4>
              //   <div className="divider"></div></>
            }
          </div>
          <div>
            {" "}
            {status == "Winner" && (
              <div className="row">
                <div className="col">
                  <h4 className="title-section col">Wall Of Fame</h4>
                  <div className="divider"></div>
                </div>
                <button
                  className="btn btn-primary col col-2 h-75"
                  onClick={handleShow}
                >
                  {" "}
                  Show Winners on Dashboard
                </button>
                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Confirm</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Are you sure you want to show this quarter's winners on
                    dashboard?
                  </Modal.Body>
                  <Modal.Footer>
                    <button className="btn-success" onClick={handleWinners}>
                      Yes
                    </button>
                  </Modal.Footer>
                </Modal>
              </div>
            )}
          </div>
          <div>
            {" "}
            {status == "Pending_Reviewer_Assignment" && (
              <>
                <h4 className="title-section">Assign Reviewers</h4>
                <div className="divider"></div>
              </>
            )}
          </div>
          <div>
            {" "}
            {status == "Incomplete" && (
              <>
                <h4 className="title-section">Forms Saved For later</h4>
                <div className="divider"></div>
              </>
            )}
          </div>
        </Col>

        {isLoading == true && <p className="text-muted"> Loading...</p>}
        {/* filters for category and quarters */}
        <div className="row w-75 mb-4">
          <Form.Select
            className="col w-100 m-2"
            style={{ borderRadius: "10px", width: "25px" }}
            onChange={(e) => {
              setSearchDate(e.target.value);
            }}
          >
            <option value={null}>Filter By Quarter</option>
            {["Q1", "Q2", "Q3", "Q4", "View All"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Form.Select>
          <Form.Select
            className="col w-100 m-2"
            style={{ borderRadius: "10px", width: "25px" }}
            onChange={(e) => setsearchCategory(e.target.value)}
          >
            <option value={null}>Filter By Category</option>
            {CardCategories.map((item) => (
              <option key={item.title} value={item.title}>
                {item.title}
              </option>
            ))}
            <option value="">View All Nominations</option>
          </Form.Select>
        </div>
        {currentItems.length <= 0 && isLoading == false && (
          <div className="justify-content-center m-3">
            <center>
              <img src={img1} style={{ width: "230px", height: "200px" }} />
              <h4>No data found or you don't have access to view the page</h4>
            </center>
          </div>
        )}
        {currentItems.length > 0 && isLoading == false && (
          <>
            <Items currentItems={currentItems} />
            <ReactPaginate
              containerClassName={"pagination "}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              breakLabel="..."
              nextLabel="Next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel="< Previous"
              renderOnZeroPageCount={null}
            />
          </>
        )}
      </Container>
    </div>
  );
};

export default NomineeCards;
