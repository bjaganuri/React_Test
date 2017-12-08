import React from "react";
import { Link } from "react-router";
import "jquery";

export function SignInAction(data,dispatch) {
    return {
        type: "usersSignin",
        payload: data 
    }
}

export function SignUpAction(data,dispatch) {
    return {
        type: "usersSignup",
        payload: data
    }
}

export function SetPasswordAuthAction(data,dispatch) {
     if (!data.authSuccess) {
		return {
			type: "usersSetPwdRecoverUser",
			payload: data
		}
    }	
	return {
        type: "usersSetPwdResetPwd",
        payload: data
    }
}