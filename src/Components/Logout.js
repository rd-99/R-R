import React, { useState, useEffect, useContext } from 'react' 
import img3 from '../public/images/iqvia-logo_color.svg' 
import 'bootstrap/dist/css/bootstrap.min.css' 
import '../public/styles/maicons.css' 
import '../public/styles/theme.css' 
import Sidebar from './Sidebar' 


const Logout = () => {
    
    useEffect(() => {
		try {
			localStorage.removeItem("token") 
			localStorage.removeItem("email") 
			localStorage.removeItem("role") 
			window.location.href = "/rr" 
		} catch(error) {
			window.location.href = "/rr" 
		}
    }, []) 
    
    return (
      <div>
      </div>
    )
}

export default Logout 
