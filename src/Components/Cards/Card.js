import React from 'react' 
import '../../public/styles/Card.css' 
import * as Icon from 'react-bootstrap-icons' 
import { CardCategories } from './CardCategories' 
import Header from '../Header' 
import Footer from '../Footer' 
import Authenticator from '../Authenticator' 
import QuickLinks from './QuickLinks' 
import { CONFIG } from '../../config'
import { NavLink } from 'react-router-dom'
const { v4: uuidv4 } = require("uuid")
const Cards = () => {
  let email = null 
  try {
    email = localStorage.getItem("email").split('@')[0]
  } catch (error) {
    window.location.href = CONFIG.F_LOGOUT_URL
  }
  return (
    <>
      <Authenticator />
      <Header />
      <main>
        <div style={{marginTop: "3vh"}}>
			{/* <div className="container">
		   <div className="row">
              <div className="col-lg-6">
                <h4 className="title-section">
                  <Icon.PersonCircle className="mb-1 text-primary" size={22} />
                  &nbsp;
                  Hello {email[0].toUpperCase() + email.slice(1)}!
                </h4>
                <p className="mb-1"></p>
              </div>
            </div>
		  <hr className="mb-5" />
			</div>*/}
          <div className="container">
            <div className="row">

              {/* Cards */}
              <div className="col-lg-9">
                <h4 className="title-section">Nomination Categories</h4>
                <div className="divider"></div>
                { CardCategories.map(item => (
                          <div key={item.title} className="card" style={{width: "15rem", marginInline:"20px"}}>
                            <div className="text-center category" >
                              <img className="card-img-top mt-4 mb-2" src={item.image} style={{ width: "130px", height: "100px", objectFit: "contain" }} alt="Card image cap" />
                            </div>
                            <div className="card-body">
                              <h6 className="card-title mt-1 mb-2">{item.title}</h6>
                              
                              <p>
                                <NavLink to={`${CONFIG.F_FORM_URL}?cat=${item.title}$u=${uuidv4()}` }>Tap to nominate!</NavLink>
                              </p>
                            </div>
                        </div>
                  ))
                }
                </div>
              <QuickLinks />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Cards
