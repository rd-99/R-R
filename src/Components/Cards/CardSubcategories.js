import React from 'react' 
import '../../public/styles/Card.css' 
import * as Icon from 'react-bootstrap-icons' 
import { CardCategories } from './CardCategories' 
import Header from '../Header' 
import Footer from '../Footer' 
import Authenticator from '../Authenticator' 
import { NavLink } from "react-router-dom"
import QuickLinks from './QuickLinks' 
import { CONFIG } from '../../config'
const { v4: uuidv4 } = require("uuid")

const CardSubcategories = () => {
  let email = null 
  try {
    email = localStorage.getItem("email").split('@')[0]
  } catch (error) {
    window.location.href = CONFIG.F_LOGOUT_URL
  }
  let cat= window.location.href.split('?')[1].split('=')[1].replace("%20"," ") 
  let obj= CardCategories.find( obj => obj.title == cat) 
  return (
    <>
      <Authenticator />
      <Header />
      <main>
        <div style={{marginTop: "5vh"}}>
          <div className="container">
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
          </div>
          <div className="container">
            <div className="row">

              {/* CardSubcategories */}
              <div className="col-lg-8">
                <h4 className="title-section">Sub-Categories</h4>
                <div className="divider"></div>
                   { obj.awards.map( award => {
                        return(
                          
                            <div key={award+ obj?.awards.indexOf(award)} className="card" style={{ width: "18rem" }}>
                                    <div className="text-center category" style={{ backgroundColor: "#b2eaf8" }}>
                                        <img className="card-img-top mt-4 mb-2" src={obj.image} style={{ width: "130px", height: "100px", objectFit: "contain" }} alt="Card image cap" />
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title mt-1 mb-2">{award}</h5>

                                        <p>
                                            <NavLink to={`/nominationform?cat=${obj.title}$n=${award}&u=${uuidv4()}` }>Tap to nominate!</NavLink>
                                        </p>
                                    </div>
                                </div>
                                
                        )
                    })}
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

export default CardSubcategories
