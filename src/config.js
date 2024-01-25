// export const SERVER_BASE_URL = `http://ca2spafapp01q:3001`;

// export const REMOTE_URL = `http://ca2spafapp01q:3001/v1` 

//  export const EMAIL_URL = 'http://ca2spafapp01q/mailer/email'

//  export const APP_URL = 'http://ca2spafapp01q/rr/userLogin'
export const SERVER_BASE_URL = `http://localhost:3001`;

export const REMOTE_URL = `http://localhost:3001/v1` 

export const EMAIL_URL = 'http://ca2spafapp01q/mailer/email' //'http://localhost/mailer/email'

export const APP_URL = 'http://localhost/rr/userLogin'

export const CONFIG = {
	FORM_TEMPLATE: `${REMOTE_URL}/form`, 
	REMOTE_URL,
	SEND_NOMS_FOR_APPROVAL: `${REMOTE_URL}/sendAllToApprove`,
	BASE_URL: `${REMOTE_URL}/nominations`,
	ADD_USER_URL: `${REMOTE_URL}/addNewUser`,
	LOGIN_URL: `${REMOTE_URL}/login`,	
	REMOVE_USER_URL:`${REMOTE_URL}/removeUser`,
	CHANGE_ROLE_URL : `${REMOTE_URL}/changerole`,
	UPDATE_WINNERS_URL : `${REMOTE_URL}/updateWinners`,
	ALL_USERS_URL: `${REMOTE_URL}/allUsers`,
	PENDING_NOMINEES_URL: `${REMOTE_URL}/pendingNominees`,
	REVIEWED_NOMINEES_URL: `${REMOTE_URL}/reviewedNominees`,
	APPROVED_NOMINEES_URL: `${REMOTE_URL}/approvedNominees`,
	NOMINEES_URL:  `${REMOTE_URL}/nominees`,
	DETAILS_URL : `${REMOTE_URL}/details`,
	UPDATE_NOMINATION_URL: `${REMOTE_URL}/updateNominationStatus`,
	MY_NOMINEES_URL: `${REMOTE_URL}/myNominations`,
	ALL_NOMINATIONS_URL: `${REMOTE_URL}/allNominations`,
	USERS_BY_ROLE_URL: `${REMOTE_URL}/usersbyrole`,
	ASSIGN_REVIEWERS_URL: `${REMOTE_URL}/assignReviewers`,
	ASSIGN_FINALSCORE_URL: `${REMOTE_URL}/assignFinalScore`,
	ADD_CITATION_URL: `${REMOTE_URL}/addCitation`,
	CHANGE_STATUS_URL: `${REMOTE_URL}/changeStatus`,
	UPLOAD_FILES: `${REMOTE_URL}/uploadfiles`,
	SAVED_NOMS : `${REMOTE_URL}/savedNoms`,
	VIEW_FILES : `${REMOTE_URL}/viewfile`,
	DELETE_FILES : `${REMOTE_URL}/deletefile`,
	UPLOAD_MORE_DETAILS : `${REMOTE_URL}/moreinfo`,
	UPDATE_FILE_NAME : `${REMOTE_URL}/updatefiles` ,
	WINNERS_URL : `${REMOTE_URL}/lastQuarterWinners`,
	F_DETAILS_URL : `/rr/details`,
	F_ALLUSERS_URL : `/rr/allUsers`,
	F_LOGOUT_URL : `/rr/logout`,
	F_DASHBOARD_URL : `/rr/dashboard`,
	F_LOGIN_URL : `/rr/userlogin`,
	F_WORKFLOW_URL : `/rr/workflow`,
	F_SIGNUP_URL : `/rr/signup`,
	F_FINALAPPROVAL_URL : '/rr/finalApproval',
	F_CATEGORY_URL : `/rr/nominationCategories`,
	F_MYNOMINATIONS_URL : `/rr/myNominations`,
	F_NOMINEES_URL : `/rr/nominees`,
	F_RANKING_URL : `/rr/rankingofReviewedNominations`,
	F_ALLNOMS_URL : `/rr/allNominations`,
	F_FORM_URL : `/rr/nominationform` ,
	F_CERTIFICATE_URL : `/rr/certificate`,
	SSO_URL: `https://dev2-fedsvc.solutions.iqvia.com/oauth2/authorize?response_type=code&scope=openid&client_id=95MtsF_84AmedCuzFWrJyYJWpN0a&redirect_uri=http://ca2spafapp01q/rr/oauth2`,
	SSO_CLIENT_ID: `95MtsF_84AmedCuzFWrJyYJWpN0a`,
	SSO_CLIENT_SECRET: `v21Qw0GnSblACq7C5NSzEzVmeJwa`,
	SSO_BASE_URL: `https://dev2-fedsvc.solutions.iqvia.com`,
	SSO_CALL_BACK_URL: `http://ca2spafapp01q/rr/oauth2`
}

