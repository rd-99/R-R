import React, { useEffect, useState } from "react"
import axios from "axios"
import { CONFIG } from "../config"
import Header from "./Header"
import Footer from "./Footer"
import Authenticator from "./Authenticator"
import DetailsTemplate from "./DetailsTemplate"
import DataTable from "react-data-table-component"
import { NavLink } from "react-router-dom";
import { CSVLink } from "react-csv"
import { CardCategories } from "./Cards/CardCategories"
import { Form } from "react-bootstrap"
const ExpandedComponent = ({ data }) => (
    <div className="row">
        <div
            className="container col-md-6 bg-light mb-5"
            style={{ margin: "20px" }}
        >
            <DetailsTemplate obj={data} />
        </div>

        <div className="col bg-light w-100" style={{ marginLeft: "30vh", marginTop: "10vh" }} >
            <NavLink to={`${CONFIG.F_DETAILS_URL}?n=${data?.uuid || ""}`} className="col btn btn-outline-primary" style={{ margin: "10px" }}>
                View more
            </NavLink>
        </div>
    </div>
)

const columns = [
    {
        name: "Nomination Name",
        selector: (row) => row.nomineeName,
        sortable: true,
    },
    {
        name: "Category",
        selector: (row) => row.nominationCategory,
    },
    {
        name: "Domain",
        selector: (row) => row.domain || "-",
        sortable: true,
    },
    {
        name: "Status",
        selector: (row) => {
            if (row.statusOfNomination == "Approved") {
                return (
                    <div className="alert alert-success p-1 mt-1 mb-1">
                        {row.statusOfNomination}
                    </div>
                )
            }
            else if (row.statusOfNomination == "Winner") {
                return (
                    <div className="alert alert-warning p-1 mt-1 mb-1">
                        {row.statusOfNomination}
                    </div>
                )
            }  else if (row.statusOfNomination == "Reviewed") {
                return (
                    <div className="alert alert-info p-1 mt-1 mb-1">
                        {row.statusOfNomination}
                    </div>
                )
            } else if (row.statusOfNomination == "Pending") {
                return (
                    <div className="alert alert-secondary p-1 mt-1 mb-1">
                        {row.statusOfNomination}
                    </div>
                )
            } else if (row.statusOfNomination == "Pending_Reviewer_Assignment") {
                return (
                    <div className="alert alert-light p-1 mt-1 mb-1">
                        {row.statusOfNomination.replace(/_/g, " ")}
                    </div>
                )
            } else if (row.statusOfNomination == "Rejected") {
                return (
                    <div className="alert alert-danger p-1 mt-1 mb-1">
                        {row.statusOfNomination}
                    </div>
                )
            }
        },
    },
    {
        name: "Nomination Date",
        selector: (row) => row.createdOn.split("T")[0],
        sortable: true,
    },
]

const pseudocolumns = [
    {
        name: "Category",
        selector: (row) => row,
        sortable: true,
    },
]
const AllNominations = () => {
    let [nominees, setNominees] = useState([])
    var [searchCategory, setsearchCategory] = useState('')
    var [searchStatus, setSearchStatus] = useState("")
    var [searchDate, setSearchDate] = useState('')
    var index = 0
    useEffect(() => {
        getAllNominees()
    }, [])

    const getAllNominees = () => {
        axios.post(`${CONFIG.ALL_NOMINATIONS_URL}`, {
            token: window.localStorage.token,
        })

            .then((response) => {
                setNominees(response.data.data)
            })

            .catch((err) => {
                console.log(err)
            })
    }
    var categorywiseData = [];
    CardCategories.map(cat => {
        categorywiseData[CardCategories.indexOf(cat)] = nominees.filter(nom => nom.nominationCategory == cat.title)
    })
    var data = nominees.map((item) => {
        let disabled = false
        return { ...item, disabled }
    })
    if (searchCategory != '') {
        const filteredData = data.filter(
            item => item.nominationCategory && item.nominationCategory.toLowerCase().includes(searchCategory.toLowerCase()),
        )
        data = filteredData
    }
    if (searchStatus != '') {
        const filteredData = data.filter(
            item => item.statusOfNomination && item.statusOfNomination.toLowerCase().includes(searchStatus.toLowerCase()),
        )
        data = filteredData
    }
    if (searchDate != '') {
        let currYear = new Date(Date.now()).getFullYear()
        const dateRange = [
            {
                name: "Q1",
                startDate: new Date(`${currYear}-01-01`).toISOString(),
                endDate: new Date(`${currYear}-03-31`).toISOString()
            },
            {
                name: "Q2",
                startDate: new Date(`${currYear}-04-01`).toISOString(),
                endDate: new Date(`${currYear}-07-02`).toISOString()
            },
            {
                name: "Q3",
                startDate: new Date(`${currYear}-07-03`).toISOString(),
                endDate: new Date(`${currYear}-09-30`).toISOString()
            },
            {
                name: "Q4",
                startDate: new Date(`${currYear}-10-01`).toISOString(),
                endDate: new Date(`${currYear}-12-31`).toISOString()
            }
        ]
        var reqRange = dateRange.find(quarter => quarter.name == searchDate)
        reqRange ? data = data.filter(item =>
            item.createdOn >= reqRange.startDate && item.createdOn <= reqRange.endDate) : data 
    }
    var csvData =JSON.parse(JSON.stringify(nominees))
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
            <div className="container mt-4">
                <div className="col md-5">
                    <div className="d-flex mx-auto">
                        <div className="col">
                            <h4 className="title-section">All Nominations</h4>
                            <div className="divider"> </div>
                            <div className="row w-75 mb-4">
                                <Form.Control className="col w-100 m-2"  style={{borderRadius:"10px",marginInline:"100px"}}
                                 type="search" id="form1" placeholder="Search by the nomination status"
                                    onChange={(e) => { setSearchStatus(e.target.value) }} />
                                <Form.Select className="col w-100 m-2" style={{borderRadius:"10px", width:"25px"}} onChange={(e) => { setSearchDate(e.target.value) }}>
                                    <option value ={null}>Filter By Quarter</option>
                                    {['Q1', 'Q2', 'Q3','Q4',"View All"].map(item => (
                                        <option key={item}>{item}</option>
                                    ))}
                                </Form.Select>
                                <Form.Select className="col w-100 m-2" style={{borderRadius:"10px", width:"25px"}} onChange={(e) => setsearchCategory(e.target.value)}>
                                    <option value ={null}>Filter By Category</option>
                                    {CardCategories.map(item => (
                                        <option key={item.title} value={item.title}>{item.title}</option>
                                    ))}
                                    <option value=''>View All Nominations</option>
                                </Form.Select>
                            </div>

                        </div>

                        <CSVLink
                            data={csvData}
                            className="btn btn-outline rounded-pill text-center h-50"
                            style={{ paddingTop: "10px" }}>
                            <b>Export to CSV</b>
                        </CSVLink>
                    </div>
                    {nominees.length > 0 && (
                        <DataTable
                            columns={columns}
                            data={data}
                            expandableRows
                            expandOnRowClicked
                            expandableRowDisabled={(row) => row.disabled}
                            expandableRowsComponent={ExpandedComponent}
                            pagination
                        />
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default AllNominations