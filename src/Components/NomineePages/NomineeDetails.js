import React from 'react'
import { useState, useEffect } from 'react'
import { CONFIG } from '../../config'
import '../../public/styles/NomineeDetails.css'
import axios from 'axios'
import Header from '../Header'
import Footer from '../Footer'
import Authenticator from '../Authenticator'
import DetailsTemplate from '../DetailsTemplate'
import * as Icon from 'react-bootstrap-icons'
import swal from 'sweetalert2'
import { CardCategories } from '../Cards/CardCategories'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import { Row, Col } from 'react-bootstrap'
import { sendMail } from '../../utils/mailer'
import CertificateBtn from './CertificateBtn'

const NomineeDetails = () => {
    const [nomineeDetails, setNomineeDetails] = useState({})
    const [assignedReviewers, setAssignedReviewers] = useState([])
    let [reviewers, setReviewers] = useState([])
    const [comments, setComments] = useState("")
    const [detailsComments, setDetailsComment] = useState("")
    const [scorelist, setScorelist] = useState({})
    let [approverScore, setApproverScore] = useState()
    let role = window.localStorage.getItem('role')
    let status = nomineeDetails?.statusOfNomination
    let email = window.localStorage.email
    const cat = CardCategories.find((obj) => (obj?.title == nomineeDetails?.nominationCategory))
    var action = (status == "Reviewed" && window.location.href.includes("&") &&
        window.location.href.split("&")[1].split("=")[1] == "approve") || status == "Pending" ? "Review" : "Reject"
    useEffect(() => {
        axios
            .post(`${CONFIG.DETAILS_URL}?n=${window.location.href.split('?')[1].split('=')[1]}`, {
                nominatorEmail: window.localStorage.email
            },
                { headers: { 'reqType': 'Pending', 'authorization': `Bearer ${window.localStorage.token}` } }
            )
            .then((response) => {
                setNomineeDetails(response.data.data)
            })
            .catch((err) => {
                console.log(err)
            })
        axios
            .post(`${CONFIG.USERS_BY_ROLE_URL}`, {
                token: window.localStorage.token,
                role: "reviewer",
            })
            .then((response) => {
                setReviewers(response.data.data)
            })
            .catch((err) => {
                console.log(err) 
            })
    }, [assignedReviewers])

    const submitReviewers = (e, id) => {
        e.preventDefault()
        axios.post(`${CONFIG.ASSIGN_REVIEWERS_URL}`, {
            uuid: id,
            reviewersList: assignedReviewers,
            statusOfNomination: 'Pending',
            token: window.localStorage.token
        })
        swal.fire({
            title: 'Success',
            showDenyButton: false,
            confirmButtonText: `Ok`,
            denyButtonText: `No`,
            text: `Reviewers assigned!`
        }).then(async (response) => {
            if (response.isConfirmed) {
                setAssignedReviewers([])
                window.location = CONFIG.F_DASHBOARD_URL
            }
        })
        sendMail({
            mailSubject: 'Nomination Review Assigned',
            toEmail: assignedReviewers , //'ruturaj.dhakane@iqvia.com',
            appName: "Rewards & Recognition", //TEST APPLICATION //R&R        
            messageType: 'Notification', //A NEW MESSAGE         
            appText: 'You have been assigned to review a nomination. Please go to R&R website to review it. Thank you!', //SOME TEXT WILL COME HERE     
        })
    }
    const deleteReviewer = async(e, reviewer) => {
        const index = assignedReviewers.indexOf(reviewer);
        if (index > -1) {
            assignedReviewers.splice(index,1) // only splice array when item is found
            setAssignedReviewers([...assignedReviewers])
        }
    }
    const handleSubmit = async (e, text) => {
        e.preventDefault()
        console.log("scorelist=", JSON.stringify(scorelist))
        if ((Object.keys(scorelist).length == Object.keys(cat.reviewQuestions)
            .length) || nomineeDetails?.statusOfNomination == "Reviewed") {

            let response = await axios.post(`${CONFIG.UPDATE_NOMINATION_URL}`, {
                uuid: `${nomineeDetails?.uuid}`,
                statusOfNomination: `${nomineeDetails?.statusOfNomination}`,
                comments: text || "N/A",
                token: window.localStorage.token,
                email: window.localStorage.email,
                reviewerScores: scorelist,
                action,
                approverScore: approverScore || '0'
            })
            action == "Review" ? (
                nomineeDetails.statusOfNomination == "Pending" ?
                    swal.fire({
                        title: 'Success',
                        confirmButtonText: `Ok`,
                        text: `Review Submitted`
                    }).then(async (resp) => {
                        if (resp.isConfirmed) {
                            window.location.href = CONFIG.F_CATEGORY_URL
                        }
                    }) : (
                        (approverScore ?
                            swal.fire({
                                title: 'Success',
                                confirmButtonText: `Ok`,
                                text: `Scoring Successful !`
                            }).then(async (resp) => {
                                if (resp.isConfirmed) {
                                    window.location.href = CONFIG.F_CATEGORY_URL
                                }
                            }) :
                            swal.fire({
                                title: 'Incomplete',
                                confirmButtonText: `Ok`,
                                text: `Provide the score!`
                            })
                        )
                    )


            ) :
                swal.fire({
                    title: 'Done',
                    showDenyButton: false,
                    confirmButtonText: `Ok`,
                    denyButtonText: `No`,
                    text: `Nomination rejected!`
                }).then(async (resp) => {
                    if (resp.isConfirmed) {
                        window.location.href = CONFIG.F_CATEGORY_URL
                    }
                })
        }
        else {
            swal.fire({
                title: 'Incomplete',
                confirmButtonText: `Ok`,
                text: `Answer all questions`
            })
            console.log("answer all questions")
        }
    }
    const handleAskforMoreDetails = async (e, text) => {
        e.preventDefault()
        let additionalDetails = await axios.post(`${CONFIG.UPLOAD_MORE_DETAILS}`, {
            uuid: `${nomineeDetails?.uuid}`,
            comments: text || "More Info Needed",
            email: window.localStorage.email,
        }).then(res => {
            console.log(res);
            swal.fire({
                title: 'Success',
                showDenyButton: false,
                confirmButtonText: `Ok`,
                denyButtonText: `No`,
                text: `Request Sent!`
            })
            sendMail({
                mailSubject: 'Please submit more Details for your nomination',
                toEmail: [nomineeDetails?.nominatorEmail],
                appName: 'R&R',
                messageType: "Upload relevant Files",
                appText:`The information submitted for Nomination of- ${nomineeDetails?.nomineeName} - has been deemed insufficient. Please visit the app and add the requested data in the form of PDF (preferably SINGLE file only) in 'My Nominations' page.`,
            })
        }).catch(err => console.log(err))

    }
    return (
        <div>
            <Authenticator />
            <Header />
            <div>{Object.keys(nomineeDetails).length <= 0 &&
                <h5>Loading</h5>
            }</div>

            <div>{Object.keys(nomineeDetails).length > 0 && <>
                <div className="container row" style={{ "maxWidth": "100%" }}>
                    <div className="col col-expand-lg" style={{ "marginInline": "7vh" }}>
                        <Row>
                            <Col>
                                <h3 className="title-section mb-3">{nomineeDetails?.nomineeName}</h3>
                                <div className="divider"></div>
                            </Col>
                            <Col>
                                {status == "Winner" && 
                                        <CertificateBtn uuid={nomineeDetails?.uuid}/>
                                    } </Col>
                        </Row>
                        <DetailsTemplate obj={nomineeDetails} />

                        {/* Assign reviewers */}
                        {(status == "Pending_Reviewer_Assignment" && role == "admin") &&
                            <div className="row mb-4">
                                <div className="col-6 col-md-4 text-muted">Selected reviewers:</div>
                                <div className="col-md-8">
                                    <table className='table table-responsive table-bordered'>
                                        <tbody>{assignedReviewers.length > 0 && assignedReviewers.map((item) => (
                                            <tr key={item}>
                                                <td>{item}</td>
                                                <td><button className="btn btn-sm btn-outline-danger" onClick={(e) => deleteReviewer(e, item)}>
                                            <Icon.Trash /> Delete</button></td>
                                           
                                            </tr>
                                        ))}</tbody>
                                    </table>
                                </div>
                                <hr />
                                <div className="col-6 col-md-4 text-muted">Assign Reviewer: </div>
                                <div className="col-md-5">
                                    <select className="form-select" multiple="" aria-label="Default select example"
                                     onChange={(e) => {assignedReviewers.includes(e.target.value)? setAssignedReviewers([...assignedReviewers]): setAssignedReviewers([...assignedReviewers, e.target.value])}}>
                                        <option value=''>Assign reviewers</option>
                                        {reviewers.map(reviewer => {
                                            return (
                                                <option key={reviewer.email}>{reviewer.email}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <button type="submit" className="btn btn-outline-primary btn-xs" style={{ "marginTop": "-1px", "paddingBlock": "5px" }}
                                        onClick={(e) => { submitReviewers(e, nomineeDetails?.uuid) }}>Submit</button>
                                </div>
                            </div>
                        }
                    </div>

                    <div className='col col-expand-lg' style={{ "marginInline": "7vh" }} >

                        {/* show review Details */}
                        {(status == "Approved" || status == "Reviewed" || status=='Winner') &&
                            <>
                                <h5 className="title-section d-flex justify-content-between align-items-center mb-3">
                                    Review Details-</h5>
                                <div className="divider"></div>
                                <ul className="list-group m-3 w-75">
                                    <li className="list-group-item" > <b className="m-3">Scores Obtained :</b>
                                        {Object.keys(cat.reviewQuestions).map(ques => (
                                            <div key={Object.keys(cat.reviewQuestions).indexOf(ques)} className=' m-3'>
                                                <OverlayTrigger trigger={["hover", "focus"]} placement="top" overlay={
                                                    <Popover id="popover-basic">
                                                        <Popover.Header as="h3" >About</Popover.Header>
                                                        <Popover.Body>{cat.reviewQuestions[ques]}
                                                        </Popover.Body>
                                                    </Popover>
                                                }>

                                                    <h6 style={{ "color": "#3172c5" }}>{ques}:</h6>
                                                </OverlayTrigger>
                                                <small >Avg score (out of 5): &nbsp;  {nomineeDetails?.qWiseScores[Object.keys(cat.reviewQuestions).indexOf(ques)]}
                                                </small>
                                            </div>
                                        ))}</li>

                                    <li className="list-group-item d-flex justify-content-between" >
                                        <div className='m-2'>
                                            <b className="m-3 col">Reviewer Comments:</b>
                                            {nomineeDetails?.reviewersList.map(rev => {
                                                return (
                                                    <div key={rev} className='col'>
                                                        <small className="m-3" >
                                                            {rev}: &nbsp; {nomineeDetails?.reviewerComments[rev.replace(/[.]/g,'_')]}</small>
                                                    </div>
                                                )
                                            })}
                                        </div> </li>
                                    <li className="list-group-item d-flex justify-content-between" >
                                        <div className='m-2'>
                                            <b className="m-3 col">Review Date:</b>
                                            <small>
                                                {new Date(nomineeDetails?.reviewedOn).toDateString()}</small>
                                        </div> </li>

                                    {(status == "Approved" || status=="Reviewed" || status=='Winner') && <>
                                        {role == 'approver' && nomineeDetails?.approverScores && <>
                                            <li className="list-group-item d-flex justify-content-between" >
                                                <div className='m-2'>
                                                    <b className="m-3 col">Approver Score(out of 5):</b>
                                                    <small className='m-3'>
                                                        {nomineeDetails?.approverScores[email.replace(/[.]/g, "_")]}</small>

                                                </div> </li>
                                            <li className="list-group-item d-flex justify-content-between" >
                                                <div className='m-2'>
                                                    <b className="m-3 col">Approver Comments:</b>
                                                    <div className='col'>
                                                        <small className='m-3'>
                                                            {nomineeDetails?.approverComments[email.replace(/[.]/g, "_")]}</small></div>
                                                </div> </li> </>
                                        }
                                        {((role == 'admin' || role=='final approver') && nomineeDetails?.approverComments) &&
                                            <li className="list-group-item d-flex justify-content-between" >
                                                <div className='m-2'>
                                                    <b className="m-3 col">Approver Comments:</b>
                                                    {Object.keys(nomineeDetails?.approverComments).map(approver =>
                                                        <div key={approver} className='col'>
                                                            <small className='m-3'>
                                                                {approver.replace(/_/g, ".")}: &nbsp; {nomineeDetails?.approverComments[approver]}</small></div>
                                                    )}
                                                </div> </li>
                                        }
                                        <li className="list-group-item d-flex justify-content-between" >
                                            <div className='m-2'>
                                                <b className="m-3 col">Updation Date:</b>
                                                <small>
                                                    {new Date(nomineeDetails?.updatedOn).toDateString()}</small>

                                            </div> </li></>
                                    }

                                </ul></>
                        }
                        {((status == "Reviewed" && (role == 'approver' || role == 'admin')) ||
                            (status == "Pending" && (role == 'reviewer' || role == 'admin'))) &&

                            <div className='col'>
                                <h5 className="title-section d-flex justify-content-between align-items-center mb-3">
                                    Action-</h5>
                                <div className="divider"></div>
                                <b className='m-2'>(1 being the lowest and 5 being the highest score)</b>

                                <ul className="list-group m-2 w-75">
                                    <form >
                                        {((status == "Pending") && (role == "reviewer" || role == "admin")) &&
                                            <>
                                                {Object.keys(cat.reviewQuestions).map(ques => (
                                                    <li key={Object.keys(cat.reviewQuestions).indexOf(ques)} className="list-group-item d-flex justify-content-between" >
                                                        <div >
                                                            <OverlayTrigger trigger={["hover", "focus"]} placement="top" overlay={
                                                                <Popover id="popover-basic">
                                                                    <Popover.Header as="h3" >About</Popover.Header>
                                                                    <Popover.Body>{cat.reviewQuestions[ques]}
                                                                    </Popover.Body>
                                                                </Popover>}>
                                                                <h6 className='form-label' style={{ "color": "#3172c5" }}>{ques}:</h6>
                                                            </OverlayTrigger>
                                                            {[1, 2, 3, 4, 5].map(i => (
                                                                <div key={i} className="form-check form-check-inline">
                                                                    <input className="form-check-input" type="radio" name={Object.keys(cat.reviewQuestions).indexOf(ques)}
                                                                        id="inlineCheckbox1" value={i} required
                                                                        onChange={(e) => setScorelist({ ...scorelist, [Object.keys(cat.reviewQuestions).indexOf(ques) + 1]: e.target.value })}
                                                                    />
                                                                    <label className="form-check-label" htmlFor="inlineCheckbox1" >{i}</label>
                                                                </div>
                                                            ))}
                                                        </div></li>
                                                ))}</>
                                        }
                                        {(window.location.href.includes('&') && status == "Reviewed") &&
                                            <li className="list-group-item d-flex justify-content-between ">
                                                <div >
                                                    <h6 className=" form-label m-2">Score (out of 5): </h6>
                                                    {[1, 2, 3, 4, 5].map(i => (
                                                        <div key={i} className="form-check form-check-inline" >
                                                            <input className="form-check-input" type="radio" name='score'
                                                                id="inlineCheckbox1" value={i} required
                                                                onChange={(e) => setApproverScore(e.target.value)} />
                                                            <label className="form-check-label" htmlFor="inlineCheckbox1" >{i}</label>
                                                        </div>
                                                    ))}</div>
                                            </li>}
                                        {(window.location.href.includes('&') || status == "Pending") &&
                                            <li className="list-group-item d-flex justify-content-between ">
                                                <div className="row ">
                                                    <h6 className="col-6 col-md-4">Additional Comments: </h6>
                                                    <div className="col-12 col-md-8">
                                                        <textarea placeholder='Enter your comments ' rows="3" cols="90" className='form-control'
                                                            style={{ "borderRadius": "5px", "height": "90px" }} onChange={(e) => setComments(e.target.value || 'N/A')} />

                                                    </div>
                                                    <div className=' justify-content-between mt-4'>
                                                        <button className="btn btn-outline-primary" onClick={(e) => handleSubmit(e, comments,)}>
                                                            <Icon.CheckCircleFill />
                                                            &nbsp;  Submit</button>
                                                    </div>
                                                </div>
                                            </li>}
                                        {(role == 'reviewer' || role == 'admin' ) && (status == 'Pending' || status == 'Pending_Reviewer_Assignment') &&
                                            <li className="list-group-item d-flex justify-content-between ">
                                                <div className="row ">
                                                    <h6 className="col-6 col-md-4">Ask for more details: </h6>
                                                    <div className="col-12 col-md-8">
                                                        <textarea placeholder='Enter your comments ' rows="3" cols="90" className='form-control'
                                                            style={{ "borderRadius": "5px", "height": "90px" }} onChange={(e) => setDetailsComment(e.target.value || 'N/A')} />

                                                    </div>
                                                    <div className=' justify-content-between mt-4'>
                                                        <button className="btn btn-outline-primary" onClick={(e) => { handleAskforMoreDetails(e, detailsComments); }}>
                                                            <Icon.CheckCircleFill />
                                                            &nbsp;  Send to Nominator</button>
                                                    </div>
                                                </div>
                                            </li>}
                                    </form>
                                </ul>
                            </div>}
                    </div>
                </div>
            </>

            }
            </div>
            <Footer />
        </div >
    )
}

export default NomineeDetails
