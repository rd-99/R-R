import Axios from "axios"
const {EMAIL_URL,APP_URL} = require('../config')



export const sendMail = async (maildata) => {

  const response = async (maildata) => { 
    await Axios.post(EMAIL_URL, {
    subject: maildata.mailSubject, //
    toEmail: maildata.toEmail,
    appName: maildata.appName, //TEST APPLICATION //R&R
    messageType: maildata.messageType, //A NEW MESSAGE 
    appText: maildata.appText, //SOME TEXT WILL COME HERE
    appLink: APP_URL //APPlink
  })
  .then(res => console.log(res , "success"));
}

let emailList = maildata?.toEmail;
emailList.forEach((item) => response({...maildata , toEmail : item}) )

}


