import React, { useEffect, useState } from "react"
import axios from "axios"
import {CONFIG} from "../config"
import img1 from '../public/images/undraw_taken_re_yn20.svg'
import Header from "./Header"
import Footer from "./Footer"
import '../public/styles/Card.css'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Authenticator from "./Authenticator"
import DetailsTemplate from "./DetailsTemplate"
import DataTable from 'react-data-table-component'
import { CardCategories } from "./Cards/CardCategories"
const email = window.localStorage.getItem('email')
const columns = [
  {
    name: 'Nomination Name',
    selector: row => row.nomineeName,
    sortable: true,
  },
  {
    name: 'Nominator',
    selector: row => row.nominatorEmail,
    sortable: true,
  },

  {
    name: 'Domain',
    selector: row => row.domain || "-",
    sortable: true,
  },
  {
    name: 'Nomination Date',
    selector: row => row.createdOn.split("T")[0],
    sortable: true,
  },
]

const MyNoms = () => {
  let reviewed = (window.location.href.split("&")[1].split("=")[1] == "reviewedbyme") ? "yes" : "no"
  let [nominees, setNominees] = useState([])
  useEffect(() => {
    getMyNominations()
  }, [])
  const getMyNominations = () => {
    axios
      .post(`${CONFIG.MY_NOMINEES_URL}`, {
        reqType:  window.localStorage.getItem("email"),//(window.location.href.split('?')[1].split('=')[1].split("&")[0] || ''),
        reviewed
      } , {headers : { 'authorization': `Bearer ${window.localStorage.token}`, email : window.localStorage.getItem("email")  }} )
      .then((response) => {
        setNominees(response.data.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const data = nominees.map(item => {
    let disabled = false
    // if (reviewed == "no") delete (item.statusOfNomination)
    return { ...item, disabled }
  })


  const ExpandedComponent = ({ data }) => (
    <div className="row">
      <div className='container col-md-6 bg-light' style={{ "margin": "10px" }}>
        <DetailsTemplate obj={data} />
      </div>
      {/* show review details */}
      {reviewed == "yes" &&
        <div className="col bg-light w-100" style={{ marginLeft: "10vh", marginTop: "10vh" }} >
          <h5 className="title-section d-flex justify-content-between align-items-center mb-3">
            Review Details-</h5>
          <div className="divider"></div>
          <ul className="list-group m-3 w-75">
            <li className="list-group-item" > <b className="m-3">Scores Obtained :</b>
              {
                Object.keys(CardCategories.find(c => c.title == data.nominationCategory).reviewQuestions).map(ques => (
                  <div key={ques} className=' m-3'>
                    <OverlayTrigger trigger={["hover", "focus"]} placement="top" overlay={
                      <Popover id="popover-basic">
                        <Popover.Header as="h3" >About</Popover.Header>
                        <Popover.Body>{CardCategories.find(c => c.title == data.nominationCategory).reviewQuestions[ques]}
                        </Popover.Body>
                      </Popover>
                    }>

                      <h6 style={{ "color": "#3172c5" }}>{ques}:</h6>
                    </OverlayTrigger>
                    <small >Scores assigned (out of 5): &nbsp;
                      {data?.reviewerScores[email.replace(/[.]/g, '_')][Object.keys(CardCategories.find(c => c.title == data.nominationCategory).reviewQuestions).indexOf(ques) + 1] || "-"}
                    </small>
                  </div>
                ))}</li>
            <li className="list-group-item d-flex justify-content-between" >
              <div className='m-2'>
                <b className="m-3 col">Additional Comments:</b>
                <div className='col'>
                  <small className="m-3" >{data?.reviewerComments[email.replace(/[.]/g, '_')] || 'N/A'}</small>
                </div>
              </div> </li>

          </ul>
        </div>}
    </div>
  )
  return (
    <div>
      <Authenticator />
      <Header />
      <div className='container mt-4'>
        <div className="col md-5">
          {reviewed == "no" ? <h4 className="title-section"> My Nominations</h4>
            : <h4 className="title-section"> Nominations Reviewed By Me</h4>}
          <div className="divider"></div>
          {nominees.length <= 0 &&
            <div style={{ "textAlign": "center !important" }}>
              <center>
                <img src={img1} style={{ width: "230px", height: "200px" }} />
                <h4>
                  No data found
                </h4>
              </center>
            </div>
          }
          {nominees.length > 0 &&
            <DataTable
              columns={columns}
              data={data}
              expandableRows
              expandOnRowClicked
              expandableRowDisabled={row => row.disabled}
              expandableRowsComponent={ExpandedComponent}
              pagination />}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default MyNoms 
