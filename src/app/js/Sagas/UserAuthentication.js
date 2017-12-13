import React from 'react';
import { Link } from 'react-router';
import {call, put} from 'redux-saga/effects';
import { actions } from "react-redux-form";
import {push, goBack, go} from 'react-router-redux';

import { CallRest } from "../Api/RestCallApi";
import { restError,resetForm } from "../Actions/CommonActions";

export function* GetSessionInfo(action){
	const data = {
		...action.payload
	}
	
	const sessionInfo = yield call(CallRest , {
		url: "/sessionData",
		method: "GET",
		dataType: "json",
		data: {
			username: data.username,
			password: data.password
		}
	});
	if(sessionInfo.data.status === "AUTHORIZED"){
		yield put ({
			type: "LOGGED_IN",
			payload: {
				sessionValidated: true,
				loggedIn: true,
				loggedUser: {
					...sessionInfo.data.user
				}
			}
		})

		yield put (push("/authorized/home"))
	}
	else {
		yield put ({
			type: "LOGGED_OUT",
			payload: {
				sessionValidated: true,
				loggedIn: false,
				loggedUser: {}
			}
		})

		yield put (push("/authenticate/login"))
	}
}

export function* Signin(action) {
	const data = {
		...action.payload
	};
	const loginResponse = yield call(CallRest , {
		url: "/login",
		method: "POST",
		dataType: "json",
		data: {
			username: data.username,
			password: data.password
		}
	});

	if (loginResponse.data.status === "Failed") {
		let errorObj = {
			...loginResponse.data
		}
		let msg = "";
		if(errorObj.info && errorObj.info.hasOwnProperty("message")){
			msg += errorObj.info.message;
		}
		else{
			msg += "Unknown error occured pls try after some time";
		}
		if(errorObj.info && errorObj.info.hasOwnProperty("lockUntil")){
			msg += " "+ errorObj.info.lockUntil;
		}
		yield put({
			type: "USER_SIGN_IN_REJECTED",
			payload: {
				status: "Failed", 
				failureMsgs: [msg],
				successMsg: ""
			}
		})
	}
	else {
		yield put ({
			type: 'resetForm',
			payload: {
				modelname: 'signInStore'
			}
		})

		yield put({
			type: "USER_SIGN_IN_FULFILLED",
			payload: {
				status: "Success", 
				failureMsgs: [],
				successMsg: "Login Success...Please wait while we navigate!"
			}
		})
		
		yield put ({
			type: "getSessionData"
		})
	}
}

export function* Signup(action) {
	const data = {
		...action.payload
	};
	
	const signupResponse = yield call(CallRest , {
		url: "/signUp",
		method: "POST",
		dataType: "json",
		data: {
			name: data.name,
			dob: data.dob,
			email: data.email,
			mobile: data.mobile,
			gender: data.gender,
			username: data.username,
			password: data.password,
			cpassword: data.cpassword
		}
	});
	
	if (signupResponse.statusCode === 200 && signupResponse.data && signupResponse.data.status && signupResponse.data.status === "Success"){
		yield put ({
			type: 'resetForm',
			payload: {
				modelname: 'signUpStore'
			}
		})

		yield put({
			type: "USER_SIGN_UP_FULFILLED",
			payload: {
				status: "Success", 
				failureMsgs: [], 
				successMsg: <span>You have registered successfully... Click here to <Link to={"/authenticate/login"} className="react-route-link">Login</Link>!!!</span> 
			}
		})
	}
	else {
		let errorMsgs = ["Unknown error occured pls try again"];
		if (signupResponse.statusCode === 500 && signupResponse.data.status === "ERROR" && signupResponse.data.type === "VAL_ERROR") {
			errorMsgs = [JSON.stringify(signupResponse.data.message)];
		}
		else if(signupResponse.statusCode === 500 && signupResponse.data.status === "ERROR" && signupResponse.data.type === "SERVER_ERROR"){
			errorMsgs = [JSON.stringify(signupResponse.data.message)];
		}
		yield put({
			type: "USER_SIGN_UP_REJECTED",
			payload: { 
				status: "Failed", 
				failureMsgs: [...errorMsgs], 
				successMsg: "" 
			}
		})
	}
}

export function* SetPwdRecoverUser(action) {
	const data = {
		...action.payload
	};

	const recoverUserResponse = yield call(CallRest , {
		url: "/recoverUser",
		method: "GET",
		dataType: "json",
		data: {
			email: data.email,
            mobile: data.mobile,
            dob: data.dob
		}
	});

	if (Object.keys(recoverUserResponse.data).length > 0 && recoverUserResponse.data.hasOwnProperty("user") && Object.keys(recoverUserResponse.data.user).length > 0 ) {
		yield put({
			type: "USER_SET_PWD_AUTH_FULFILLED",
			payload: {
				authSuccess: true, 
				successMsg: "User Has been authenticated successfully!!", 
				recoveredData: recoverUserResponse.data.user, 
				failureMsgs: []
			}
		})
	}
	else {
		let errorMsg = (recoverUserResponse.data.info && recoverUserResponse.data.info.hasOwnProperty("message"))  ? recoverUserResponse.data.info.message : "Invalid User Data";
		yield put({
			type: "USER_SET_PWD_AUTH_REJECTED",
			payload: {
				authSuccess: false, 
				successMsg: "", 
				recoveredData: {}, 
				failureMsgs: [errorMsg]
			}
		})
	}
}

export function* SetPwdResetPwd(action) {
	const data = {
		...action.payload
	};

	const resetPwdResponse = yield call(CallRest , {
		url: "/setNewPassword",
		method: "POST",
		dataType: "json",
		data: {
			...data.recoveredData,
			password: data.password
		}
	});

	if (resetPwdResponse.statusCode === 200 && resetPwdResponse.data && resetPwdResponse.data.status && resetPwdResponse.data.status === "Success") {
		yield put ({
			type: 'resetForm',
			payload: {
				modelname: 'setPasswordStore'
			}
		})

		yield put({
			type: "USER_RESET_PWD_FULFILLED",
			payload: {
				authSuccess: false, 
				successMsg: <span>Password updated successfully!!! Click here to <Link to={"/authenticate/login"} className="react-route-link">Login</Link>!!!</span>, 
				recoveredData: {}, 
				failureMsgs: []
			}
		})
	}
	else {
		let errorMsgs = [];
		if(resetPwdResponse.statusCode === 500 && resetPwdResponse.data.status === "ERROR" && resetPwdResponse.data.type === "VAL_ERROR"){
			errorMsgs = ["Unknown error occured pls try again later!!!"];
		}
		else{
			errorMsgs.push("Failed to update password please try again!!");
		}

		yield put ({
			type: 'resetForm',
			payload: {
				modelname: 'setPasswordStore'
			}
		})

		yield put({
			type: "USER_RESET_PWD_REJECTED",
			payload: {
				authSuccess: false, 
				successMsg: "", 
				recoveredData: {}, 
				failureMsgs: [...errorMsgs]
			}
		})
	}
}