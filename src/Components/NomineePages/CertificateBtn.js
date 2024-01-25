import React, { useEffect, useState } from "react";
import "../../App.css";
import axios from "axios";
import { CONFIG } from "../../config";
import { Modal } from "react-bootstrap";

const CertificateBtn = ({ uuid }) => {
  const [citation, setCitation] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {});
  const handleCitation = async () => {
    try {
      let response = await axios.post(
        CONFIG.ADD_CITATION_URL,
        {
          token: window.localStorage.token,
          uuid,
          citation,
        },
        { headers: { authorization: `Bearer ${window.localStorage.token}` } }
      );
      window.location.href = `${CONFIG.F_CERTIFICATE_URL}?n=${uuid}`;
    } catch (err) {
      console.log(err);
    }
  };
  function checkWordLen(val) {
    var len = val.split(/[\s]+/);
    console.log(len.length);
    if (len.length <= 30) {
      setCitation(val);
    } else {
      alert("You cannot put more than 30 words in this text area.");
      setCitation("");
      return false;
    }
    return true;
  }
  return (
    <div>
      <button className="btn btn-info h-50 mt-4  " onClick={handleShow}>
        Certificate
      </button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Certificate Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            value={citation}
            placeholder="Type something here! (max 30 words)"
            style={{ borderRadius: "5px", height: "20vh", width: "48vh" }}
            onChange={(e) => checkWordLen(e.target.value)}
          />
          {console.log(citation)}
          <button
            className=" btn btn-sm btn-outline-success rounded-pill m-2"
            onClick={handleCitation}
          >
            Generate Certificate
          </button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CertificateBtn;
