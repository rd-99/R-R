import React, { useEffect, useState } from "react" 
import { Form } from "react-bootstrap"
import axios from "axios" 
import {CONFIG} from "../config" 
import Header from "./Header" 
import Footer from "./Footer" 
import Authenticator from "./Authenticator" 
import DetailsTemplate from "./DetailsTemplate" 
import { CSVLink} from "react-csv" 
import { NavLink } from "react-router-dom"
import DataTable from 'react-data-table-component' 
import { CardCategories } from "./Cards/CardCategories"

const Rankings = () => {
const email = window.localStorage.getItem('email').replace(/[.]/g,'_')
    var [searchCategory, setsearchCategory] = useState("")
    let [nominees, setNominees] = useState([]) 
    useEffect(() => {
        getAllNominees() 
    }, []) 

    const getAllNominees = () => {
        axios
            .post(`${CONFIG.ALL_NOMINATIONS_URL}`, {
                token: window.localStorage.token,
            } , { headers: { 'authorization': `Bearer ${window.localStorage.token}`, email : window.localStorage.getItem("email")}})
            .then((response) => {
                setNominees(response.data.data) 
            })
            .catch((err) => {
                console.log(err) 
            }) 
    } 

    const reqNom = nominees.filter(i => (i?.statusOfNomination == "Reviewed" || i?.statusOfNomination=='Approved'|| i?.statusOfNomination=='Winner'))
    var data = reqNom.map(item => {
        let disabled = false 
        return { ...item, disabled }

    })
    data.sort(function(a, b){return b.finalScore- a.finalScore})
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
        <div className="col bg-light w-100" style={{ "marginLeft": "30vh","marginTop":"10vh"}}>
        <NavLink to={`${CONFIG.F_DETAILS_URL}?n=${data?.uuid || ''}`} className="col btn btn-outline-primary" style={{ "margin": "10px" }}>View more</NavLink>
        </div>
        </div>
    )
    
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
            name: 'Average Review Score',
            selector: row => row.finalScore || "-",
            sortable: true,
        },
        {
            name: 'Status',
            selector: row =>
                  { if (row.statusOfNomination=='Approved'){
                    return( <div className="alert alert-success p-1 mt-1 mb-1">
                        {row.statusOfNomination}
                    </div>) }
                   else if (row.statusOfNomination=="Reviewed"){
                    return (<div className="alert alert-info p-1 mt-1 mb-1">
                    {row.statusOfNomination}
                </div>)
                   } 
                   else if(row.statusOfNomination=="Winner" ){
                   return( <div className="alert alert-warning p-1 mt-1 mb-1">
                   {row.statusOfNomination}
               </div>)
                   }}
        },
        {
            name: 'Action',
            selector: row =>
                 {if(row.statusOfNomination=="Reviewed"){
                    return( 
                    (row.approverScores && Object.keys(row.approverScores).includes(email) ) ?
                     <> Your score: {row.approverScores[email]}</> 
                     :<div>
                    <NavLink to={`${CONFIG.F_DETAILS_URL}?n=${row.uuid || ''}&action=approve`} className="btn btn-outline-primary p-1 mt-1 mb-1">Score</NavLink>
               </div>
               ) }
                else return (
                    <p>Level 2 completed</p>
                )
               }
            // {if(Object.keys(row).includes('approverScores')){
            //   return( <>
            //   Your score: {Object.keys(row?.approverScores).includes(email) ? row.approverScores[email] : 'Not scored'} </>) }
            // }
            ,
        },
        {
            name : 'Final Score By Approvers',
            selector: row => 
            (row.statusOfNomination == 'Approved' || row.statusOfNomination=="Winner") ?
            row.finalApproverScore : 'Approval under process',
            sortable:true
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
                    <h4 className="title-section">Ranking of Nominations</h4>
                    <div className="divider"></div>
                    <div className="row w-50 mb-4"> 
                                <Form.Select className="col w-50 m-2" style={{borderRadius:"10px", width:"25px"}} onChange={(e) => setsearchCategory(e.target.value)}>
                                    <option value ={null}>Filter By Category</option>
                                    {CardCategories.map(item => (
                                        <option key={item.title} value={item.title}>{item.title}</option>
                                    ))}
                                    <option value=''>View All Nominations</option>
                                </Form.Select>
                            </div>
                    </div>
                    <CSVLink data={csvData} 
                    className="btn btn-outline rounded-pill text-center h-50"
                     style={{"paddingTop": "10px"}}><b>Export to CSV</b></CSVLink>
                </div>
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

export default Rankings
