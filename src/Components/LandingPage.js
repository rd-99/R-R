import React from 'react' 
import Header from './Header' 
import Footer from './Footer' 
import img1 from '../public/images/bg_image_1.png' 
import { NavLink } from "react-router-dom";
import '../App.css'
import Button from 'react-bootstrap/Button' 
import OverlayTrigger from 'react-bootstrap/OverlayTrigger' 
import Popover from 'react-bootstrap/Popover' 
import {CardCategories} from './Cards/CardCategories' 
import { CONFIG } from '../config'
import * as Icon from 'react-bootstrap-icons'

const LandingPage = () => {

  return (
    <div>
      
      <Header/>
      <div className="page-banner home-banner">
        <div className="container h-100">
          <div className="row align-items-center h-100">
            <div className="col-lg-6   wow fadeInUp">
              <h1 className="mb-4">Welcome to Rewards and Recognitions</h1>
              <p className="text-lg mb-5">Recognizing and celebrating the extarordinary talents.</p>

             {! window.localStorage.getItem('email') &&
             <NavLink to={`${CONFIG.F_LOGIN_URL}`} className="btn btn-outline border text-secondary">Sign In</NavLink>}
              <NavLink to={`${CONFIG.F_WORKFLOW_URL}`} className="btn btn-primary btn-split ml-2">
                &nbsp; Rewards Process
                <div className="fab">
                  <span className="mai-play"></span>
                </div>
              </NavLink>
            </div>
            <div className="col-lg-6">
              <div className="img-place">
                <img src={img1} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <main>
      <div className="page-section features">
        <div className="row justify-content-center" style={{marginInline:"100px"}}>
           { CardCategories.map( item => (
            <div key={item.title} className="col-md-3 col-lg">
            <div className="d-flex flex-row">
              <div className="img-fluid">
                <Icon.TrophyFill size={40} style={{color:"#5599f6", marginTop:"17px"}}/>
              </div>
              <OverlayTrigger trigger={["hover","focus"]} placement="top" overlay={
                <Popover id="popover-basic">
                <Popover.Header as="h3" >Judged On</Popover.Header>
                <Popover.Body>
                   { Object.keys(item.reviewQuestions).map(ques => (
                      <p key={ques}>{ques} </p>
                    ))}
                </Popover.Body>
              </Popover>
              }>
            <Button variant="default"><h6 >{item.title}</h6></Button>
           </OverlayTrigger>

            </div>
          </div>
          )  )} 
          
        </div>
    </div>
  </main>
      <Footer/>
    </div>
  )
}

export default LandingPage
