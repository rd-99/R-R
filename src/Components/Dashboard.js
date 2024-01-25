import React, { useEffect, useState } from "react"
import axios from "axios"
import {CONFIG} from "../config"
import Header from "./Header"
import Footer from "./Footer"
import Authenticator from "./Authenticator"
import { CardCategories } from './Cards/CardCategories'
import "./../public/styles/Dashboard.css"
import QuickLinks from "./Cards/QuickLinks"
import * as Icon from 'react-bootstrap-icons'
import { Bar, Scatter } from "react-chartjs-2"
import "chart.js/auto"
import Carousel from "./Carousel"

const Dashboard = () => {

    let [nominees, setNominees] = useState([])
    useEffect(() => {
        getAllNominees()
    }, [])
    let email = null
    try {
        email = localStorage.getItem("email").split('@')[0]
    } catch (error) {
        window.location.href = CONFIG.F_LOGOUT_URL
    }

    const getAllNominees = () => {
        axios
            .post(`${CONFIG.ALL_NOMINATIONS_URL}`, {
                token: window.localStorage.token,
            })
            .then((response) => {
                setNominees(response.data.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const labels = []
    CardCategories.map(item => {
        !labels.includes(item.title.split('-')[0]) && labels.push(item.title.split('-')[0])
    })
    const numbers = []
    labels.map(label => {
        let num = 0
        nominees.map(nom => {
            if (nom?.nominationCategory.split('-')[0] == label) {
                num++
            }
        })
        numbers.push(num)
    })

    let reviewednom = 0
    let approvednom = 0
    let unprocessednom = 0
    nominees.map(nom => {
        if (nom.statusOfNomination == "Pending" || nom.statusOfNomination == "Pending_Reviewer_Assignment") {
            unprocessednom++
        }
        else if(nom.statusOfNomination=="Reviewed") {
            reviewednom++
        }
        else if(nom.statusOfNomination=="Approved"|| nom.statusOfNomination=='Winner'){
            approvednom++
        }
    })
    let totalNom = 0
    for (var i = 0; i < numbers.length; i++) {
        totalNom += numbers[i]
    }

    const data = {
        labels: labels,
        datasets: [
            {
                label: "Nominations till date",
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                ],
                borderWidth: 1,
                barThickness: 20,
                data: numbers,
            },
        ],
    }
    const chartOptions = {
        responsive: true,
        // indexAxis: 'y',
        scales: {
            y: {
                grid: {
                    display: false
                },
            },
            x: {
                grid: {
                    display: false
                },
            },
        },
        min: 0,
        // max: 20,
        ticks: {
            stepSize: 4
        }
    }
    let dataScatter = [];
    (nominees.filter( nom => nom?.statusOfNomination == "Approved")).map(item => {
        dataScatter.push({
            x:  ( new Date(item?.reviewedOn?.split("T")[0])- new Date(item?.createdOn?.split("T")[0]))/(1000 * 60 * 60 * 24),
            y: ( new Date(item?.updatedOn?.split("T")[0])- new Date(item?.reviewedOn?.split("T")[0]))/(1000 * 60 * 60 * 24)
        })
    })
    const Sdata = {
        datasets: [{
            label: 'Review Time v/s Approval Time', // Name the series
            data: dataScatter, // Specify the data values array
            borderColor: '#2196f3', // Add custom color border            
            backgroundColor: '#2196f3', // Add custom color background (Points and Fill)
        }]
    }
    const options = {
        scales: {
            x: {
                type: 'linear',
                position: 'bottom'
            }
        },
            min: 0,
            max: 20,
            ticks: {
            stepSize: 2
            }
    }


    return (
        <div>
            <Authenticator />
            <Header />
            <div style={{ marginTop: "3vh" }}>
                <div className="container" style={{maxWidth:'200vh',marginInline:'5vh'}}>
				{/* <div className="row">
                        <div className="col-lg-6">
                            <h4 className="title-section">
                                <Icon.PersonCircle className="mb-1 text-primary" size={22} />
                                &nbsp;
                                Hello {email[0].toUpperCase() + email.slice(1)}!
                            </h4>
                        </div>
                    </div>
				<hr className="mb-3" /> */}
                    <div className="row">
                        <div className="col col-md-2 col-sm-6">
                            <Icon.Flower2 className=" text-primary m-1" size={22} />
                            {/* <Icon.Flower2 className=" text-primary" size={22} />
                            <Icon.Flower2 className=" text-primary" size={22} /> */}
                            <div className="divider"></div>
                        <div className="row mb-2">
                                        <div className="card card-purple-blue text-white ">
                                            <div className="card-body d-flex justify-content-between align-items-end">
                                                <div className="card-number">
                                                    <div className="h3 m-0">{totalNom}</div><small><strong>TOTAL NOMINATIONS SUBMITTED</strong></small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card card-blue-green text-white">
                                            <div className="card-body d-flex justify-content-between align-items-end">
                                                <div className="card-number">
                                                    <div className="h3 m-0">{unprocessednom}</div><small><strong>NOMINATIONS UNDER PROCESS</strong></small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card card-salmon-pink text-white">
                                            <div className="card-body d-flex justify-content-between align-items-end">
                                                <div className="card-number">
                                                    <div className="h3 m-0">{reviewednom}</div><small><strong>TOTAL REVIEWED NOMINATIONS</strong></small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card card-purple-pink text-white">
                                            <div className="card-body d-flex justify-content-between align-items-end">
                                                <div className="card-number">
                                                    <div className="h3 m-0">{approvednom}</div><small><strong>TOTAL APPROVED NOMINATIONS</strong></small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                        </div>
                     <div className="col-lg-6 col-md-7 col-sm-12 m-2 justify-items-center container" >

                           <h5 className="title-section">
                                <Icon.TrophyFill className=" text-primary" size={22} /> &nbsp;
                                Wall of Fame (Previous Quarter Winners)</h5>
                            <div className="divider"></div>
                            <div className="shadow-sm" style={{
                                width: "90%",
                                backgroundImage: "linear-gradient( 135deg, #FAD7A1 10%, #E96D71 100%)" ,borderRadius:"10px"
                            }}>
                                <Carousel />
                            </div>
                            <hr />
                            <h5 className="title-section mt-4">
                                <Icon.Activity className=" text-primary" size={22} /> &nbsp;
                                Nominations Analytics</h5>
                            <div className="divider"></div>
                            <div className="card border border-light shadow-sm" 
                             style={{width: "90%"}}>
                            <div className="chart-container m-3 col-lg-8  w-75" >
                                <Bar data={data} options={chartOptions} style={{ "marginTop": "20px" }} />
                            </div></div>
                            {/* <div className="chart-container m-3 col-lg-8" style={{ "position": "relative", "height": "40vh", "width": "65vw" }}>
                                <Scatter option={options} data={Sdata} />
                            </div> */}
                        </div>
                        <QuickLinks />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Dashboard
