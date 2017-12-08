import React from "react";
import ReactDOM from "react-dom";

export default class AuthenticateUser extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className="row">
				<div className="col-lg-offset-3 col-lg-6 col-md-offset-2 col-md-8 col-sm-offset-1 col-sm-10">
					{this.props.children}
				</div>
			</div>		
		)
	}
}
