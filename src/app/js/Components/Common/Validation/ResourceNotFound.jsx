import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router";

export default class ResourceNotFound extends React.Component {
	render() {
		if (this.props.route.loggedin) {
			return (
				<h2>Requested resource not found. Click here to navigate <Link to={"authorized/home"}>Home</Link> page</h2>
			);
		}
		return (
			<h2>Requested resource not found. Click here to navigate <Link to={"authenticate/login"}>Login</Link> page</h2>
		);
	}

}
