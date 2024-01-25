import React from 'react';
import { Link } from 'react-router-dom';
import {CONFIG} from '../config';
import axios from 'axios';

const OAuth2 = () => {
	const params = new URLSearchParams(window.location.search);
	const code = params.get('code');
	
	React.useEffect(() => {
		axios.get(`http://ca2spafapp01q:3001/sso?code=${code}`)
		.then((resOauth)=>{
			let email = resOauth.data.email;
			axios.post(`${CONFIG.LOGIN_URL}`, {
			  email
			})
			.then((res)=>{
			  console.log("userRegister") 
			  if(res.data.success == true){
				swal("Login Successful!", "Welcome to R&R!", "success") 
				window.localStorage.setItem("token",res.data.token) 
				window.localStorage.setItem("email" , res.data.email) 
				window.localStorage.setItem("role" , res.data.role)
				window.location.href = CONFIG.F_DASHBOARD_URL
			  }
			})
		});
	});
	
	return (
	  <div>
			<p>Logging in... Please wait</p>
	  </div>
  )
}

export default OAuth2;