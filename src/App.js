import React from 'react'
import Forms from './Components/Form'
import Cards from './Components/Cards/Card'
import Login from './Components/Login'
import LandingPage from './Components/LandingPage'
import FinalApproval from './Components/NomineePages/FinalApproval'
import NomineeCards from './Components/NomineePages/NomineeCards'
import NomineeDetails from './Components/NomineePages/NomineeDetails'
import Dashboard from './Components/Dashboard'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import WorkflowPopup from './Components/WorkflowPopup'
import Signup from './Components/Signup'
import Logout from './Components/Logout'
import MyNoms from './Components/myNoms'
import CardSubcategories from './Components/Cards/CardSubcategories'
import AllNominations from './Components/AllNominations'
import Rankings from './Components/Rankings'
import Temp from './Components/NomineePages/Certificate'
import OAuth2 from './Components/OAuth2'
import AssignRoles from './Components/AssignRoles'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path='/rr/nominationform' element={<Forms />}/>
        <Route exact path='/rr/allUsers' element={<AssignRoles />}/>
        <Route exact path='/rr/dashboard' element={<Dashboard />}/>
        <Route exact path='/rr/' element={<LandingPage />} />
        <Route exact path='/rr/nominationCategories' element={<Cards />} />
        <Route exact path='/rr/certificate' element={< Temp />} />
        <Route exact path='/rr/finalApproval' element={< FinalApproval />} />
        <Route exact path='/rr/nominees' element={< NomineeCards />} />
        <Route exact path='/rr/workflow' element={< WorkflowPopup />} />
        <Route exact path='/rr/userLogin' element={< Login />} />
        <Route exact path='/rr/details' element={< NomineeDetails />} />
        <Route exact path='/rr/rankingofReviewedNominations' element={< Rankings />} />
        <Route exact path='/rr/logout' element={< Logout />} />
        <Route exact path='/rr/signup' element={< Signup />} />
        <Route exact path='/rr/myNominations' element={< MyNoms />} />
        <Route exact path='/rr/subcategories' element={< CardSubcategories />} />
        <Route exact path='/rr/allNominations' element={< AllNominations />} />
		    <Route exact path='/rr/oauth2' element={< OAuth2 />} />
      </Routes>
    </Router>
  )
}

export default App

