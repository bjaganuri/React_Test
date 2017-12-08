const signInInState = {
	username: "",
	password: "",
	status: "",
	failureMsgs: [],
	successMsg: ""
}

const signupInState = {
	name: "",
	dob: "Jun 25, 1993",
	email: "",
	mobile: "",
	gender: "",
	username: "",
	password: "",
	cpassword: "",
	status: "",
	failureMsgs: [],
	successMsg: ""
}

const setpwdInState = {
	email: "",
	mobile: "",
	dob: "June 25,1993",
	password: "",
	cpassword: "",
	authSuccess: false,
	recoveredData: {},
	successMsg: "",
	failureMsgs: []
}

const initSessionData = {
	sessionValidated: false,
	loggedIn: false,
	loggedUser: {}
}

export const sessionData = (state = initSessionData , action) => {
	switch (action.type)
	{
	case "LOGGED_IN":
		state = {
			...state,
			sessionValidated: action.payload.sessionValidated,
			loggedIn: action.payload.loggedIn,
			loggedUser: {
				...action.payload.loggedUser
			}
		}
		break;
	case "LOGGED_OUT": 
		state = {
			...state,
			sessionValidated: action.payload.sessionValidated,
			loggedIn: action.payload.loggedIn,
			loggedUser: {
				...action.payload.loggedUser
			}
		}
		break;
	
	}
	return state;
}

export const signInReducer = (state = signInInState, action) => {
	switch (action.type){
		case "USER_SIGN_IN_FULFILLED":
			state = {
				...state,
				status: action.payload.status,
				failureMsgs: [],
				successMsg: action.payload.successMsg
			};
			break;
		case "USER_SIGN_IN_REJECTED":
			state = {
				...state,
				status: action.payload.status,
				failureMsgs: [...action.payload.failureMsgs],
				successMsg: ""
			};
			break;
	}
	return state;
};

export const signUpReducer = (state = signupInState, action) => {
	switch (action.type){
		case "USER_SIGN_UP_FULFILLED":
			state = {
				...state,
				status: action.payload.status,
				failureMsgs: [],
				successMsg: action.payload.successMsg
			};
			break;
		case "USER_SIGN_UP_REJECTED":
			state = {
				...state,
				status: action.payload.status,
				failureMsgs: [...action.payload.failureMsgs],
				successMsg: ""
			};
			break;
	}
	return state;
};

export const setPasswordReducer = (state = setpwdInState, action) => {
	switch (action.type){
		case "USER_SET_PWD_AUTH_FULFILLED":
			state = {
				...state,
				authSuccess: action.payload.authSuccess,
				successMsg: action.payload.successMsg,
				recoveredData: { ...action.payload.recoveredData },
				failureMsgs: [...action.payload.failureMsgs]
			};
			break;
		case "USER_SET_PWD_AUTH_REJECTED":
			state = {
				...state,
				authSuccess: action.payload.authSuccess,
				successMsg: action.payload.successMsg,
				recoveredData: { ...action.payload.recoveredData },
				failureMsgs: [...action.payload.failureMsgs]
			};
			break;
		case "USER_RESET_PWD_FULFILLED":
			state = {
				...state,
				authSuccess: action.payload.authSuccess,
				successMsg: action.payload.successMsg,
				recoveredData: { ...action.payload.recoveredData },
				failureMsgs: [...action.payload.failureMsgs]
			};
			break;
		case "USER_RESET_PWD_REJECTED":
			state = {
				...state,
				authSuccess: action.payload.authSuccess,
				successMsg: action.payload.successMsg,
				recoveredData: { ...action.payload.recoveredData },
				failureMsgs: [...action.payload.failureMsgs]
			};
			break;
	}
	return state;
};
