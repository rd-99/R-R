import React, { useEffect, useState } from "react"
import { Form } from "react-bootstrap"
import axios from "axios"
import img1 from '../../public/images/undraw_taken_re_yn20.svg'
import { CONFIG } from '../../config'
import Header from "../Header"
import Footer from "../Footer"
import Authenticator from "../Authenticator"
import swal from 'sweetalert2'
import DetailsTemplate from "../DetailsTemplate"
import { CSVLink } from "react-csv"
import DataTable from 'react-data-table-component'
import * as Icon from 'react-bootstrap-icons'
import { CardCategories } from "../Cards/CardCategories"
import { NavLink } from "react-router-dom"
const FinalApproval = () => {
    var [searchCategory, setsearchCategory] = useState("")
    const [nominees, setNominees] = useState([])
    const [rating, setRating] = useState('')
    useEffect(() => {
        getAllNominees()
    }, [])

    const getAllNominees = () => {
        axios
            .post(`${CONFIG.NOMINEES_URL}?type=Approved`, {
                token: window.localStorage.token,
                //nominatorEmail: window.localStorage.getItem("email"),
            }, { headers: { 'authorization': `Bearer ${window.localStorage.token}`, 'email' : window.localStorage.getItem("email") } },
            )
            .then((response) => {
                setNominees(response.data.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    var data = nominees.map(item => {
        let disabled = false
        return { ...item, disabled }

    })
    data.sort(function (a, b) { return b.finalApproverScore - a.finalApproverScore })
    if (searchCategory != '') {
        const filteredData = data.filter(
            item => item.nominationCategory && item.nominationCategory.toLowerCase().includes(searchCategory.toLowerCase()),
        )
        data = filteredData
    }

    const ExpandedComponent = ({ data }) => (
        <div className="row">
            <div className='container col-md-6 bg-light mb-5' style={{ "margin": "20px" }}>
                <DetailsTemplate obj={data} />
            </div>
            <div className="col bg-light w-100" style={{ "marginLeft": "30vh", "marginTop": "10vh" }}>
                <NavLink to={`${CONFIG.F_DETAILS_URL}?n=${data?.uuid || ''}`} className="col btn btn-outline-primary" style={{ "margin": "10px" }}>View more</NavLink>
            </div>
        </div>
    )
    const finalRating = async (e, uuid) => {
        e.preventDefault()
        if (rating != "" && (rating > 5 || rating < 1)) {
            alert('Rating must lie between 1 to 5')
        }
        else {
            let res = await axios
                .post(CONFIG.ASSIGN_FINALSCORE_URL, {
                    token: window.localStorage.token,
                    uuid,
                    finalRating: Number(rating)
                }, { headers: { 'authorization': `Bearer ${window.localStorage.token}` } },
                )
                .then((response) => {
                    swal.fire({
                        title: 'Done',
                        showDenyButton: false,
                        confirmButtonText: `Ok`,
                        denyButtonText: `No`,
                        text: `Suuccessfully rated the candidate!`
                    }).then(()=>
                    window.location.reload())
                }).catch(err => console.log(err))
        }
    };

    const columns = [
        {
            name: 'Nomination Name',
            selector: row => row.nomineeName,
        },
        {
            name: 'Category',
            selector: row => row.nominationCategory || "-",
        },
        {
            name: 'Status',
            selector: row =>
            { if (row.statusOfNomination == "Approved") {
                return (
                    <div className="alert alert-info p-1 mt-1 mb-1">
                        {row.statusOfNomination}
                    </div>
                )
            }
            else if (row.statusOfNomination == "Winner") {
                return (
                    <div className="alert alert-success p-1 mt-1 mb-1">
                        {row.statusOfNomination}
                    </div>
                )
            }  }
        },
        {
            name: 'Final Approvers Score',
            selector: row =>  row.finalApproverScore,
            sortable: true
        },
        {
            name: `Assign Rating(1 being least & 5 being highest)`,
            selector: row =>
            (row.finalRating>0 ?
                <>Your Rating: {row.finalRating}</> :
                <><input className="p-1" type="number" min={1} max={5} onChange={(e) => setRating(e.target.value)} />
                    <button className="btn btn-outline-primary p-1" onClick={(e) => finalRating(e, row.uuid)}>
                        <Icon.CheckCircleFill />
                        &nbsp;Submit</button>
                </>
            ),
        },
        {
            name: 'Nomination Date',
            selector: row => row.createdOn.split("T")[0],
            sortable: true,
        },
    ]

    //csv exported data
var csvData =JSON.parse(JSON.stringify(data))
    csvData = csvData.map(item => {
       delete(item.qWiseScores)
       delete(item.reviewerComments)
       delete(item.reviewerScores)
       delete item.approverComments
       delete item.approverScores
       return { ...item } 
   })
    return (
        <div>
            <Authenticator />
            <Header />
            <div className='container mt-4'>
                <div className="col md-5">
                    <div className="d-flex mx-auto">
                        <div className="col">
                            <h4 className="title-section"> Nominations Scored by Approvers</h4>
                            <div className="divider"></div>
                            <div className="row w-50 mb-4">
                                <Form.Select className="col w-50 m-2" style={{ borderRadius: "10px", width: "25px" }} onChange={(e) => setsearchCategory(e.target.value)}>
                                    <option value={null}>Filter By Category</option>
                                    {CardCategories.map(item => (
                                        <option key={item.title} value={item.title}>{item.title}</option>
                                    ))}
                                    <option value=''>View All Nominations</option>
                                </Form.Select>
                            </div>
                        </div>
                        <CSVLink data={csvData}
                            className="btn btn-outline rounded-pill text-center h-50"
                            style={{ "paddingTop": "10px" }}><b>Export to CSV</b></CSVLink>
                    </div>
                    {nominees.length <= 0 &&
                        <div className='justify-content-center m-3' >
                            <center>
                                <img src={img1} style={{ width: "230px", height: "200px" }} />
                                <h4>
                                    No data found or you don't have access to view the page
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

export default FinalApproval
