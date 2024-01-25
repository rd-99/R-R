import React, { useState, useEffect, useContext } from 'react' 


const Authenticator = () => {
    
    useEffect(() => {
		try {
			if(!localStorage.getItem("token") || !localStorage.getItem("email")  ) {
				window.location.href = "/rr/"
			}
		} catch(error) {
			window.location.href = "/rr/" 
		}
    }, []) 
    
    return (
      <div>
      </div>
    )
}

export default Authenticator 
