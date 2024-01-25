import React, { useState, useEffect } from 'react'
import ExportPdfComponent from "./ExportPdfComponent"
import axios from 'axios'
import { CONFIG } from '../../config'
import '../../App.css'
const temp = () => {
    const [nomineeDetails, setNomineeDetails] = useState({})
    useEffect(() => {
        axios
            .post(`${CONFIG.DETAILS_URL}?n=${window.location.href.split('?')[1].split('=')[1]}` ,{
                nominatorEmail : window.localStorage.email
            } ,
            { headers: { 'reqType' : 'Pending' , 'authorization' : `Bearer ${window.localStorage.token}`} }  
            )
            .then((response) => {
                setNomineeDetails(response.data.data)
            })
            .catch((err) => {
                console.log(err)
            }) }, [])
    return (
          <ExportPdfComponent x={nomineeDetails}/>   
    )
}

export default temp
